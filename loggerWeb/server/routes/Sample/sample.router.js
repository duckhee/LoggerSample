const express = require('express');
const router = express.Router();

/** Sample Main Router */
const MainCtrl = require('../../ctrl/sample/index.ctrl');

router.get('/', MainCtrl.MainPage);

router.get('/list', MainCtrl.ListPage);

router.get('/cell-two', (req, res, next) => {

});

router.get('/cell-three', (req, res, next) => {

});

router.get('/logger', (req, res, next) => {

});

router.get('/DeviceData', (req, res, next) => {

});

router.get('/DeviceImage', (req, res, next) => {

});

module.exports = (app, csurfMiddleware) => {
    app.use('/sample', router);
};