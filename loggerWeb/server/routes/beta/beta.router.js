const express = require('express');
const router = express.Router();

/** Beta Controller */
const BetaCtrl = require('../../ctrl/beta/index.ctrl');

/** Beta router */
const BetaRouter = (csurfMiddleware) => {

    /** Redirect Login Page */
    router.get('/', BetaCtrl.MainPage);

    /** Map Page Show Device Map */
    router.get('/map', csurfMiddleware, BetaCtrl.LoginChecker, BetaCtrl.MapPage);

    /** Show Graph Detail and Download Data */
    router.get('/detail', csurfMiddleware, BetaCtrl.LoginChecker, BetaCtrl.DetailPage);

    /** Beta User Login Page */
    router.get('/login', csurfMiddleware, BetaCtrl.LoginPage);

    /** Beta User Login Do */
    router.post('/login', csurfMiddleware, BetaCtrl.LoginDo);

    /** Beta User Log Out User Do */
    router.post('/logout', BetaCtrl.LoginChecker, csurfMiddleware, BetaCtrl.LogOut);

    /** Get Graph Data Json Type */
    router.get('/Data', BetaCtrl.GraphDataJson);

    /** Download CSV */
    router.get('/download', BetaCtrl.DownloadCSV);
    return router;
}

module.exports = (app, csurfMiddleware) => {
    app.use('/beta', BetaRouter(csurfMiddleware));
};