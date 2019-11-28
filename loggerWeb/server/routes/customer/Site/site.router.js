const express = require("express");
const router = express.Router();

/** Customer Site Router */
const SiteCtrl = require('../../../ctrl/customer/Site/site.ctrl');

const SiteRouter = (csurfMiddleWare) => {
    /** Site Main Page */
    router.get('/', SiteCtrl.MainPage);
    return router;
};


module.exports = SiteRouter;