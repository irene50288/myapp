var Storage = require('@google-cloud/storage');

var CLOUD_BUCKET = 'pwa-uploads';

var storage = Storage({
  projectId: 'fleet-tensor-152008',
  credentials: require('../private/PWAssemble-0c0e9bf53b13.json')
});

storage.createBucket(CLOUD_BUCKET, function(err, bucket) {
  if (!err) {
    // "my-new-bucket" was successfully created.
  }
});
var bucket = storage.bucket(CLOUD_BUCKET);
// specify default permissions options for the bucket
var options = {
  entity: 'allUsers',
  role: Storage.acl.READER_ROLE
};

//  default ACL for the bucket
bucket.acl.default.add(options, function(err, aclObject) {});

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
var sendUploadToGCS = function(req, res, next) {
  if (!req.file) {
    return next();
  }

  var gcsname = Date.now() + req.file.originalname;
  var file = bucket.file(gcsname);

  var stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on('error', function(err) {
    req.file.cloudStorageError = err;
  next(err);
});

  stream.on('finish', function() {
    req.file.cloudStorageObject = gcsname;
  req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
  next();
});

  stream.end(req.file.buffer);
}
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
  'multer': multer
};