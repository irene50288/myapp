var Storage = require('@google-cloud/storage');

var CLOUD_BUCKET;
// var bucket;
var stream;
var storage = Storage({
  projectId: 'fleet-tensor-152008',
  credentials: require('../private/PWAssemble-0c0e9bf53b13.json')
});
var options = {
  entity: 'allUsers',
  role: Storage.acl.READER_ROLE
};



var createStorageBucket = function(name) {
  return new Promise(function(resolve, reject){
    storage.createBucket(name);
    var bucket = storage.bucket(name);

// specify default permissions options for the bucket
    var options = {
      entity: 'allUsers',
      role: Storage.acl.READER_ROLE
    };

//  default ACL for the bucket
    bucket.acl.default.add(options);
    CLOUD_BUCKET = name;
    return resolve(bucket);

  });

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
var sendUploadToGCS = function(reqFile, bucket) {
  console.log('passed file to sendFunc ' + reqFile.originalname);
  // if (!reqFile) {
  //   return next();
  // }

  var gcsname = reqFile.originalname + Date.now();
  var file = bucket.file(gcsname);

  stream = file.createWriteStream({
    metadata: {
      contentType: reqFile.mimetype
    }
  });

  stream.on('error', function(err) {
    reqFile.cloudStorageError = err;
  // next(err);
});

  stream.on('finish', function() {
    reqFile.cloudStorageObject = gcsname;
    reqFile.cloudStoragePublicUrl = getPublicUrl(gcsname);
    console.log(reqFile.cloudStoragePublicUrl);
  // next();

});

  stream.end(reqFile.buffer);
};

var uploadFile = function(req) {
  return new Promise(function(resolve, reject) {
    var name = req.body['companyName'] + Date.now();
    //create storage bucket
    var bucket;
    storage.createBucket(name).then(function(data){
      bucket = data[0];

      bucket.acl.default.add(options).then(function(data){
        CLOUD_BUCKET = name;

        var filesKeys = Object.keys(req.files);
        filesKeys.forEach(function (key) {
          sendUploadToGCS(req.files[key][0], bucket);
        });
        return resolve('success');
      });
    });
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
  'createStorageBucket': createStorageBucket,
  'multer': multer,
  'uploadFile': uploadFile
};