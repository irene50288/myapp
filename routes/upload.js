var express = require('express');
var router = express.Router();
var images = require('../lib/images');

/* POST to /upload */
router.post('/', images.multer.single('sampleFile'), images.sendUploadToGCS, function(req, res, next) {
  var data = req.body;

  if (req.file && req.file.cloudStoragePublicUrl) {
    data.imageUrl = req.file.cloudStoragePublicUrl;
    res.send('File uploaded!');
  } else {
    res.send('failed');
  }

});

module.exports = router;
