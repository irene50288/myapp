var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/:bucketId', function(req, res) {
  request('https://storage.googleapis.com/'+ req.params.bucketId+'/result.txt', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var configObj = JSON.parse(body);
      console.log(configObj);
      res.render('index', { configObj: configObj });
    } else {
      console.log(error);
    }
  });
});

module.exports = router;
