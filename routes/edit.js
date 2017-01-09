var express = require('express');
var router = express.Router();
var images = require('../lib/images');


var parseFileNames = function(obj){
  var fileKeys = ['companyLogo', 'homescreenIcon', 'heroImage'];
  if (obj) {
    fileKeys.forEach(function (key) {
      var url = obj[key+'Url'];
      var parts = url.split('/');
      var index = parts.length - 1;
      obj[key] = parts[index];
    });
  }
};


/* GET home page. */
router.get('/:bucketId', function(req, res) {
  images.getConfigJson(req.params.bucketId).then(function(configObj){
    configObj.bucketName = req.params.bucketId;
    parseFileNames(configObj);
    res.render('index', { configObj: configObj });
  }).catch(function(err){
    console.log(err);
  });
});

module.exports = router;
