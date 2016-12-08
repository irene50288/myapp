var express = require('express');
var router = express.Router();

var config = {};
/* POST to /upload */
router.post('/', function (req, res) {

    var gcloud = require('gcloud')(config);
    var gcs = gcloud.storage();
    var bucket = gcs.bucket(config.storageBucket);

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    res.send('File uploaded!');

});

module.exports = router;
