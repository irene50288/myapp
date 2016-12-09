var express = require('express');
var router = express.Router();
var gcloud = require('gcloud');

var config = {
    projectId: 'fleet-tensor-152008'
};
var gcs = gcloud.storage(config);

gcs.createBucket('my-new-bucket', function(err, bucket) {
  if (!err) {
    // "my-new-bucket" was successfully created.
  }
});

var bucket = gcs.bucket('my-existing-bucket');

/* POST to /upload */
router.post('/', function (req, res) {


    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

  bucket.upload('/photos/zoo/zebra.jpg', function(err, file) {
    if (!err) {
      // "zebra.jpg" is now in your bucket.
    }
  });

    res.send('File uploaded!');

});

module.exports = router;
