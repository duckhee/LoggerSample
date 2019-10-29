var express = require('express');
var router = express.Router();
/** Control Main Router */
const MainCtrl = require('../../ctrl/customer/index.ctrl');

/** Customer Router Module */
const UserRouter = require('./user/user.router');
const LoggerRouter = require('./Device/Logger/logger.router');

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
    /** Logger Router */
    app.use('/logger', LoggerRouter);


};