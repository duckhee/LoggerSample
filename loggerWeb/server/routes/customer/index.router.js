const express = require('express');
const router = express.Router();
/** Control Main Router */
const MainCtrl = require('../../ctrl/customer/index.ctrl');

/** Customer Router Module */
const UserRouter = require('./user/user.router');

const DeviceRouter = require('./Device/index.router');
/* GET home page. */
router.get('/', MainCtrl.MainPage);
/** Page Testing router */
router.get('/test', MainCtrl.LoginDone);


//module.exports = router;
/**Customer Router Management */
module.exports = (app) => {
    /** index router */
    app.use('/', router);
    /** User Management Router */
    app.use('/', UserRouter);
    /** Device Router */
    DeviceRouter(app);
};