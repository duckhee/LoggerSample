const express = require('express');
const router = express.Router();

/** Admin Plot Controller */
const AdminPlotCtrl = require("../../../ctrl/admin/Plot/plot.ctrl");

const PlotRouter = (csurfMiddleWare) => {
    /** Admin Plot Main Page */
    router.get('/', AdminPlotCtrl.MainPage);
    /** Admin Plot Create Page */
    router.get('/create', csurfMiddleWare, AdminPlotCtrl.CreatePage);
    /** Admin Plot Create Do */
    router.post('/create', csurfMiddleWare, AdminPlotCtrl.CreateDo);
    /** Admin Plot List page */
    router.get('/list', csurfMiddleWare, AdminPlotCtrl.ListPage);
    /** Admin Plot Detail page */
    router.get('/detail', csurfMiddleWare, AdminPlotCtrl.DetailPage);
    /** Admin Plot Modify Page */
    router.get('/modify', csurfMiddleWare, AdminPlotCtrl.ModifyPage);
    /** Admin Plot Modify Do */
    router.post('/modify', csurfMiddleWare, AdminPlotCtrl.ModifyDo);
    /** Admin Plot Delete Do */
    router.post('/delete', csurfMiddleWare, AdminPlotCtrl.DeleteDo);
    /** return router */
    return router;
};
module.exports = PlotRouter;