const express = require('express');
const router = express.Router();
const LoggerDataCtrl = require('../../ctrl/logger/logger.ctrl');

router.get('/getLoggerData', (req, res, next) => {

});

router.get('/getLoggerDataMongo', LoggerDataCtrl.GetTestingLogger);

module.exports = router;