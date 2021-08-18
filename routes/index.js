const express = require('express');
const router =  express.Router();
router.use('/',require('./device/index'));

module.exports = router;