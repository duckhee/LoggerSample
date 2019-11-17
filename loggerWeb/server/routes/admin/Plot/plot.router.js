const express = require('express');
const router = express.Router();

/** Admin Plot Controller */
const AdminPlotCtrl = require("../../../ctrl/admin/Plot/plot.ctrl");

/** Admin Plot Main Page */
router.get('/', AdminPlotCtrl.MainPage);
/** Admin Plot Create Page */
router.get('/create', AdminPlotCtrl.CreatePage);
/** Admin Plot Create Do */
router.post('/create', AdminPlotCtrl.CreateDo);
/** Admin Plot List page */
router.get('/list', AdminPlotCtrl.ListPage);
/** Admin Plot Detail page */
router.get('/detail', AdminPlotCtrl.DetailPage);
/** Admin Plot Modify Page */
router.get('/modify', AdminPlotCtrl.ModifyPage);
/** Admin Plot Modify Do */
router.post('/modify', AdminPlotCtrl.ModifyDo);
/** Admin Plot Delete Page */
router.get('/delete', AdminPlotCtrl.DeletePage);
/** Admin Plot Delete Do */
router.post('/delete', AdminPlotCtrl.DeleteDo);

module.exports = router;