const express = require('express');
const router = express.Router();
const DownloadLoggerCtrl = require('../../ctrl/download/logger.download.ctrl');


/**
 * logger data download
 */
router.post('/loggerData', DownloadLoggerCtrl.downloadLoggerData);


module.exports = router;