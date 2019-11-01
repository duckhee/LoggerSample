const express = require('express');
const router = express.Router();
/** Customer Data Report Controller */
const CustomerDataReportCtrl = require('../../../../ctrl/customer/Device/DataReport/datareport.ctrl');

/** Customer Data Report Main Page */
router.get('/', CustomerDataReportCtrl.MainPage);

module.exports = router;