const express = require('express');
const router = express.Router();
const LoggerDataCtrl = require('../../ctrl/logger/logger.ctrl');

router.get('/chart', (req, res, next) => {
    res.render('test', {
        login: req.session.userInfo
    });
});

router.get('/testing', LoggerDataCtrl.GetLoggerData);

router.get("/testingData", LoggerDataCtrl.GetTestingLogger);

module.exports = router;