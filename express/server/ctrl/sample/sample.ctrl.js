const getReq = require('request');

const SamplePage = (req, res, next) => {
    console.log("Sample Main Page");
    res.render('sample/sample', {
        login: req.session.userInfo
    });
};

const CellOnePage = (req, res, next) => {
    console.log("Sample Cell One Page");
    res.render('sample/cellSample', {
        login: req.session.userInfo,
        imageTitle: 'Cell 1 Image',
        ChartTitle: 'Cell 1',
        GetNo: '1'
    });
};

const CellTwoPage = (req, res, next) => {
    console.log("Sample Cell Two Page");
    res.render('sample/cellSample', {
        login: req.session.userInfo,
        imageTitle: 'Cell 2 Image',
        ChartTitle: 'Cell 2',
        GetNo: '2'
    });
};

const CellThreePage = (req, res, next) => {
    console.log("Sample Cell Three Page");
    res.render('sample/cellSample', {
        login: req.session.userInfo,
        imageTitle: 'Cell 3 Image',
        ChartTitle: 'Cell 3',
        GetNo: '4'
    });
};

const GetDeviceData = (req, res, next) => {
    let no = req.query.no || req.params.no || req.param.no || req.body.no;
    getReq('http://www.iof.center/DataValue/getDeviceList10?no=' + no, (err, response, body) => {
        console.log("no :::::::::::::: " + no);
        console.log("response", typeof (body));
        res.send(body);
    });
};

const GetImagePath = (req, res, next) => {
    let no = req.query.no || req.params.no || req.param.no || req.body.no;
    getReq("http://www.iof.center/DataValue/DeviceImageGet?no=" + no, (err, response, body) => {
        console.log("no :::::::::::::: " + no);
        res.send(body);
    });
};

module.exports = {
    GetDeviceData,
    GetImagePath,
    SamplePage,
    CellOnePage,
    CellTwoPage,
    CellThreePage
};