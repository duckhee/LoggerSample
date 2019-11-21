/**
 * Admin Login Or Admin User Do
 */
const express = require('express');
const router = express.Router();

/** Admin User Ctrl */
const AdminUserCtrl = require('../../../ctrl/admin/Users/user.ctrl');

const UserRouter = (csurfMiddleWare) => {
    /** Admin User Main Page */
    router.get('/', AdminUserCtrl.MainPage);
    /** Admin User Login  */
    router.get('/login', csurfMiddleWare, AdminUserCtrl.LoginPage);
    /** Admin User Login Do */
    router.post('/login', csurfMiddleWare, AdminUserCtrl.LoginDo);
    /** Admin User Profile Page */
    router.get('/profile', AdminUserCtrl.ProfilePage);
    /** Admin User Modify Page */
    router.get('/modify', csurfMiddleWare, AdminUserCtrl.ModifyPage);
    /** Admin User Modify Do */
    router.post('/modify', csurfMiddleWare, AdminUserCtrl.ModifyDo);
    /** Admin User LogOut Do */
    router.post('/logout', csurfMiddleWare, AdminUserCtrl.LogOutDo);
    /** return router */
    return router;
};
module.exports = UserRouter;