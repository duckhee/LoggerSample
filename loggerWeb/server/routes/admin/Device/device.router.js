const express = require("express");
const router = express.Router();

/** Admin Device Controller */
const AdminDeviceCtrl = require('../../../ctrl/admin/Device/device.ctrl');

/** Admin Device Main Page */
router.get('/', AdminDeviceCtrl.MainPage);
/** Admin Device Create Page */
router.get('/create', AdminDeviceCtrl.CreatePage);
/** Admin Device Create Do */
router.post('/create', AdminDeviceCtrl.CreateDo);
/** Admin Device List Page */
router.get('/list', AdminDeviceCtrl.ListPage);
/** Admin Device Detail page */
router.get('/detail', AdminDeviceCtrl.DetailPage);

module.exports = router;