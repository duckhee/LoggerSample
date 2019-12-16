const express = require('express');
const router = express.Router();

const CustomerUserCtrl = require("../../../ctrl/customer/Users/user.ctrl");

const UserRouter = (app, csurfMiddleWare) => {

    router.get("/", CustomerUserCtrl.MainPage);

    /**
     * Create Get Router
     */
    router.get('/create', (req, res, next) => {
        /** Not Yet Need */
        res.redirect('/login');
    });
    /**
     * Create Post Router
     */
    router.post('/create', (req, res, next) => {
        /** NOt yet Need */
        res.redirect('/login');
    });

    /**
     * Login Get Router
     */
    router.get('/login', csurfMiddleWare, CustomerUserCtrl.LoginPage);
    /**
     * Login Post Router
     */
    router.post('/login', csurfMiddleWare, CustomerUserCtrl.LoginDo);

    /**
     * LogOut Post Router
     */
    router.post('/logout', CustomerUserCtrl.LogOutDo);

    /**
     * Profile Get Router
     */
    router.get('/profile', CustomerUserCtrl.ProfilePage);

    /**
     * Modify Get Router
     */
    router.get('/Modify', csurfMiddleWare, CustomerUserCtrl.ModifyPage);

    /**
     * Modify Post Router
     */
    router.post('/Modify', csurfMiddleWare, CustomerUserCtrl.ModifyDo);

    return router;

}

module.exports = UserRouter;