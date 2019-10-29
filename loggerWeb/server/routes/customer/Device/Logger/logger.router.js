const express = require('express');
const router = express.Router();

/** Logger Controller */
const LoggerCtrl = require('../../../../ctrl/customer/Device/Logger/logger.ctrl');

/** Logger Main Page */
router.get('/', LoggerCtrl.LoggerMainPage);

module.exports = router;