const express = require('express');
const router = express.Router();
/** Control Main Router */
const AdminMainCtrl = require('../../ctrl/admin/index.ctrl');

/** Testing Function */


/** Admin Get Router */
router.get('/', AdminMainCtrl.MainPage);
/** Admin Member Router */
const MemberRouter = require('./Member/member.routes');
/** Admin User Router */
const UserRouter = require('./Users/users.router');

module.exports = (app) => {
    /** Index router */
    app.use('/admin', router);
    /** Member router */
    app.use('/admin/Members', MemberRouter);
    /** Admin User router */
    app.use('/admin/User', UserRouter);
};