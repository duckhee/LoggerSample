const express = require("express");
const router = express.Router();

/** Customer Site Router */
const SiteCtrl = require('../../../ctrl/customer/Site/site.ctrl');

const SiteRouter = (csurfMiddleWare) => {
    /** Site Main Page */
    router.get('/', SiteCtrl.MainPage);
    /** Site List Page */
    router.get('/list', SiteCtrl.ListPage);
    /** Site Detail Page */
    router.get('/detail', SiteCtrl.DetailPage);
    /** Site Modify Page */
    router.get('/update', SiteCtrl.ModifyPage);
    /** Site Modify Do */
    router.get('/update', SiteCtrl.ModifyDo);
    /** Site Delete Do */
    router.post('/delete', SiteCtrl.DeleteDo);
    return router;
};


module.exports = SiteRouter;