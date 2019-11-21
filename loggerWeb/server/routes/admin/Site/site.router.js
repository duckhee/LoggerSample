const express = require('express');
const router = express.Router();
/** Control Site Router */
const AdminSiteCtrl = require('../../../ctrl/admin/Site/site.ctrl');

const SiteRouter = (csurfMiddleWare) => {
    /** Admin Site Main Page */
    router.get('/', AdminSiteCtrl.MainPage);
    /** Admin Site Create Page */
    router.get('/create', csurfMiddleWare, AdminSiteCtrl.CreatePage);
    /** Admin Site Create Do */
    router.post('/create', csurfMiddleWare, AdminSiteCtrl.CreateDo);
    /** Admin Site List Page */
    router.get('/list', csurfMiddleWare, AdminSiteCtrl.ListPage);
    /** Admin Site Detail Page */
    router.get('/detail', csurfMiddleWare, AdminSiteCtrl.DetailPage);
    /** Admin Site Modify Page */
    router.get('/modify', csurfMiddleWare, AdminSiteCtrl.ModifyPage);
    /** Admin Site Modify Do */
    router.post('/modify', csurfMiddleWare, AdminSiteCtrl.ModifyDo);
    /** Admin Site Delete Do */
    router.post('/delete', csurfMiddleWare, AdminSiteCtrl.DeleteDo);
    /** return router */
    return router;
};

module.exports = SiteRouter;