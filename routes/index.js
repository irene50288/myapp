var express = require('express');
var router = express.Router();
var images = require('../lib/images');
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { configObj: {} });
});

router.post('/', images.multer.single('theFile'), function(req, res) {
  var file = req.file;
  var newPath =  path.join(__dirname, '/../public/uploads/', file.originalname);

  fs.writeFile(newPath, file.buffer, function (err, data) {
    res.send('/uploads/' + file.originalname);
  });

});

module.exports = router;
