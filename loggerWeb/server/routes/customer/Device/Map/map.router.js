const express = require('express');
const router = express.Router();
/** Customer Map Controller */
const CustomerMapCtrl = require('../../../../ctrl/customer/Device/Map/map.ctrl');

/** Map router Main */
router.get("/", CustomerMapCtrl.MainPage);

module.exports = router;