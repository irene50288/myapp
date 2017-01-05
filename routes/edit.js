var express = require('express');
var router = express.Router();
var request = require('request');


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
  request('https://storage.googleapis.com/'+ req.params.bucketId+'/result.txt', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var configObj = JSON.parse(body);
      configObj.bucketName = bucketId;
      parseFileNames(configObj);
      res.render('index', { configObj: configObj });
    } else {
      console.log(error);
    }
  });
});

module.exports = router;
