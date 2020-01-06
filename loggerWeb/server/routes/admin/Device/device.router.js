const express = require("express");
const router = express.Router();

/** Admin Device Controller */
const AdminDeviceCtrl = require('../../../ctrl/admin/Device/device.ctrl');
/** Admin Device Json Controller */
const AdminDeviceJsonCtrl = require('../../../ctrl/admin/Device/Data.Json.ctrl');

const DeviceRouter = (csurfMiddleWare) => {
    /** Admin Device Main Page */
    router.get('/', AdminDeviceCtrl.MainPage);
    /** Admin Device Create Page */
    router.get('/create', csurfMiddleWare, AdminDeviceCtrl.CreatePage);
    /** Admin Device Create Do */
    router.post('/create', csurfMiddleWare, AdminDeviceCtrl.CreateDo);
    /** Admin Device List Page */
    router.get('/list', csurfMiddleWare, AdminDeviceCtrl.ListPage);
    /** Admin Device Detail page */
    router.get('/detail', csurfMiddleWare, AdminDeviceCtrl.DetailPage);
    /** Admin Device Detail And Show Graph */
    //router.get('/graph', csurfMiddleWare);
    /** Admin Device delete Do */
    router.post('/delete', csurfMiddleWare, AdminDeviceCtrl.DeleteDo);
    /** return router */
    router.get('/getData', AdminDeviceJsonCtrl.ListAllData);
    /** Get Picture */
    router.get('/getPicture', AdminDeviceJsonCtrl._SampleCapture);
    return router;
};

module.exports = DeviceRouter;