var express = require('express');
var router = express.Router();

/* POST to /upload */
router.post('/upload', function(req, res) {
  res.send('File uploaded');
});

module.exports = router;