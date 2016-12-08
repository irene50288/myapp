var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/upload', function(req, res) {
  res.send('File uploaded');
});

module.exports = router;
