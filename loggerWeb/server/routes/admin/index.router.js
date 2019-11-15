const express = require('express');
const router = express.Router();
/** Control Main Router */
const AdminMainCtrl = require('../../ctrl/admin/index.ctrl');

/** Testing Function */


/** Admin Get Router */
router.get('/', AdminMainCtrl.MainPage);
/** Admin Member Router */
const MemberRouter = require('./Member/member.router');
/** Admin User Router */
const UserRouter = require('./Users/users.router');
/** Admin Site Router */
const SiteRouter = require('./Site/site.router');
/** Admin Plot Router */
const PlotRouter = require("./Plot/plot.router");

module.exports = (app) => {
    /** Index router */
    app.use('/admin', router);
    /** Member router */
    app.use('/admin/Members', MemberRouter);
    /** Admin User router */
    app.use('/admin/User', UserRouter);
    /** Admin Site router */
    app.use('/admin/Site', SiteRouter);
    /** Admin Plot router */
    app.use('/admin/Plot', PlotRouter);

};