const express = require('express');
const router = express.Router();

/** Admin Plot Controller */
const AdminPlotCtrl = require("../../../ctrl/admin/Plot/plot.ctrl");

/** Plot Main Page */
router.get('/', AdminPlotCtrl.MainPage);
/** Plot Create Page */
router.get('/create', AdminPlotCtrl.CreatePage);
/** Plot Create Do */
router.post('/create', AdminPlotCtrl.CreateDo);
/** Plot List page */
router.get('/list', AdminPlotCtrl.ListPage);
/** Plot Modify Page */
router.get('/modify', AdminPlotCtrl.ModifyPage);
/** Plot Modify Do */
router.post('/modify', AdminPlotCtrl.ModifyDo);
/** Plot Delete Page */
router.get('/delete', AdminPlotCtrl.DeletePage);
/** Plot Delete Do */
router.post('/delete', AdminPlotCtrl.DeleteDo);

module.exports = router;