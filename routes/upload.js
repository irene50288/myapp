var express = require('express');
var router = express.Router();
var images = require('../lib/images');

var fieldsArray = [
  {name: 'companyName', maxCount: 1},
  {name: 'companyLogo', maxCount: 1},
  {name: 'homescreenIcon', maxCount: 1},
  {name: 'heroText', maxCount: 1},
  {name: 'heroImage', maxCount: 1},
  {name: 'subText', maxCount: 1},
  {name: 'ctaText', maxCount: 1},
  {name: 'primaryFg', maxCount: 1},
  {name: 'primaryBg', maxCount: 1},
  {name: 'secondaryFg', maxCount: 1},
  {name: 'secondaryBg', maxCount: 1}
];

router.post('/', images.multer.fields(fieldsArray), function(req, res, next) {
  images.uploadFile(req).then(function(result){
    res.send(result);
  }).catch(function(err){
    console.log(err);
  });
});

module.exports = router;
