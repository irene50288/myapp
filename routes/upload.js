var express = require('express');
var router = express.Router();
var images = require('../lib/images');

/* POST to /upload */
// router.post('/', images.multer.single('sampleFile'), images.sendUploadToGCS, function(req, res, next) {
//   var data = req.body;
//
//   console.log(req);
//   if (req.file && req.file.cloudStoragePublicUrl) {
//     data.imageUrl = req.file.cloudStoragePublicUrl;
//     res.send('File uploaded!');
//     console.log(data.imageUrl);
//   } else {
//     res.send('failed');
//   }
//
// });
var fieldsArray = [
  {name: 'companyName', maxCount: 1},
  {name: 'companyLogo', maxCount: 1},
  {name: 'homescreenIcon', maxCount: 1},
  {name: 'heroText', maxCount: 1},
  {name: 'heroImage', maxCount: 1},
  {name: 'subText', maxCount: 1},
  {name: 'ctaText', maxCount: 1},
  {name: 'colorFgPrimary', maxCount: 1},
  {name: 'colorBgPrimary', maxCount: 1},
  {name: 'colorFgSecondary', maxCount: 1},
  {name: 'colorBgSecondary', maxCount: 1}
];

router.post('/', images.multer.fields(fieldsArray), function(req, res, next) {
  images.uploadFile(req).then(function(result){
    console.log(result);
    res.send(result);
  }).catch(function(err){
    console.log(err);
  });
});

module.exports = router;
