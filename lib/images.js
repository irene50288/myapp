var Storage = require('@google-cloud/storage');
var fs = require('fs');
var UUID = require('uuid-js');
var CLOUD_BUCKET;
var stream;
var request = require('request');
var storage = Storage({
  projectId: 'fleet-tensor-152008',
  credentials: require('../private/PWAssemble-0c0e9bf53b13.json')
});
var options = {
  entity: 'allUsers',
  role: Storage.acl.READER_ROLE
};

// Returns the public, anonymously accessable URL to a given Cloud Storage
// object.
// The object's ACL has to be set to public read.
// [START public_url]
var getPublicUrl = function(filename) {
  return 'https://storage.googleapis.com/'+ CLOUD_BUCKET + '/' + filename;
};
// [END public_url]

// Express middleware that will automatically pass uploads to Cloud Storage.
// req.file is processed and will have two new properties:
// * ``cloudStorageObject`` the object name in cloud storage.
// * ``cloudStoragePublicUrl`` the public url to the object.
// [START process]
var sendUploadToGCS = function(reqFile, key, bucket, resultObj) {
  return new Promise(function(resolve, reject){
    var gcsname = reqFile.originalname;
    var file = bucket.file(gcsname);

    stream = file.createWriteStream({
      metadata: {
        contentType: reqFile.mimetype
      }
    });

    stream.on('error', function(err) {
      reqFile.cloudStorageError = err;
      return reject(err);
    });

    stream.on('finish', function() {
      reqFile.cloudStorageObject = gcsname;
      reqFile.cloudStoragePublicUrl = getPublicUrl(gcsname);
      if (key) {
        resultObj[key + 'Url'] = reqFile.cloudStoragePublicUrl;
      }
      return resolve(reqFile.cloudStoragePublicUrl);
    });

    stream.end(reqFile.buffer);
  });

};

var uploadFile = function(req) {
  var resultObj;
  var bucket;
  var bucketName = req.body.bucketName;
  return new Promise(function(resolve, reject) {
    findStorageBucket(req.body).then(function(storeBucket){
      bucket = storeBucket;
      getConfigJson(bucketName).then(function(obj){
        resultObj = obj;
        // update old configObj with new texts & colors
        var propKeys = Object.keys(req.body);
        propKeys.forEach(function (key) {
          resultObj[key] = req.body[key];
        });
        //update files
        var filesKeys = Object.keys(req.files);
        var promises = [];
        filesKeys.forEach(function (key) {
          promises.push(sendUploadToGCS(req.files[key][0], key, bucket, resultObj));
        });
        Promise.all(promises).then(function(){
          writeResultFile(bucket, resultObj);
        }).catch(function(err){
          return reject(err);
        });
      });
      return resolve('success');
    }).catch(function(err){
      return reject(err);
    });
  });
};

var getConfigJson = function(bucketId){
  return new Promise(function(resolve, reject){
    request('https://storage.googleapis.com/'+ bucketId+'/result.txt', function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var configObj = JSON.parse(body);
        return resolve(configObj);
      } else {
        return resolve({});
      }
    });
  });
};

var writeResultFile = function(bucket, resultObj){
  var file = bucket.file('result.txt');
  stream = file.createWriteStream({
    metadata: {
      contentType: 'text/plain'
    }
  });
  stream.end(JSON.stringify(resultObj));
};

var findStorageBucket = function(obj){
  return new Promise(function(resolve, reject){
    if (obj.bucketName) {
      bucket = storage.bucket(obj.bucketName);
      if (bucket) { // bucket found
        return resolve(bucket);
      };
    } else { // bucket not found or name is empty need to create a new one with proper acl
      var name = obj.companyName.toLowerCase() + UUID.create();
      storage.createBucket(name).then(function(data){
        bucket = data[0];
        bucket.acl.default.add(options).then(function(){
          return resolve(bucket);
        }).catch(function(err){
          return reject(err);
        });
      }).catch(function(err){
        return reject(err);
      });
    };
  });
};

// [END process]

// Multer handles parsing multipart/form-data requests.
// This instance is configured to store images in memory.
// This makes it straightforward to upload to Cloud Storage.
// [START multer]
var Multer = require('multer');
var multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // no larger than 10mb
  }
});
// [END multer]

module.exports = {
  'getPublicUrl': getPublicUrl,
  'sendUploadToGCS': sendUploadToGCS,
  'multer': multer,
  'uploadFile': uploadFile,
  'getConfigJson': getConfigJson
};