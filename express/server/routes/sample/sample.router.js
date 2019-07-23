const express = require('express');
const router = express.Router();
const getReq = require('request');

/**
 * Sample One Page
 */
router.get('/', (req, res, next) => {
    res.render('sample/sample', {
        login: req.session.userInfo
    });
});

/**
 * Sample Cell One
 */
router.get('/cellOne', (req, res, next) => {

});

/**
 * Sample Cell Two
 */
router.get('/cellTwo', (req, res, next) => {

});

/**
 * Sample Cell Three
 */
router.get('/cellThree', (req, res, next) => {

});

/**
 * Get Main Web Data
 */
router.get('/DeviceData', (req, res, next) => {
    let no = req.query.no || req.params.no || req.param.no || req.body.no;
    getReq('http://www.iof.center/DataValue/getDeviceList10?no=' + no, (err, response, body) => {
        console.log("no :::::::::::::: " + no);
        console.log("response", typeof (body));
        res.send(body);
    });
});

/**
 * Get Main Web Image
 */
router.get('/DeviceImage', (req, res, next) => {
    let no = req.query.no || req.params.no || req.param.no || req.body.no;
    getReq("http://www.iof.center/DataValue/DeviceImageGet?no=" + no, (err, response, body) => {
        console.log("no :::::::::::::: " + no);
        res.send(body);
    });
});


module.exports = router;