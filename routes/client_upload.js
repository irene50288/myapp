var express = require('express');
var router = express.Router();

/* GET page with form. */
router.get('/', function(req, res) {
  res.render('client_upload', { title: 'Express' });
});

module.exports = router;
