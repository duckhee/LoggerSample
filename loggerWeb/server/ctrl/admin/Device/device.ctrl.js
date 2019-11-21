//TODO Session Checking
//TOdo Delte data just Testing
var TestingLoginData = {
    userId: 'test',
    name: 'tester'
};
/** Device Type Array */
const DeviceTypes = [];

/** Admin Device Main Page */
const MainPage = (req, res, next) => {
    res.redirect('/admin/Device/list');
};
/** Admin Device Create Page */
const CreatePage = (req, res, next) => {
    res.render('admin/DevicePage/Create/CreatePage', {
        login: TestingLoginData,
        title: 'Admin Device Create Page',
        _csrf: req.csrfToken()
    });
};
/** Admin Device Create Do */
const CreateDo = (req, res, next) => {
    res.redirect('/admin/Device/list');
};
/** Admin Device List Page */
const ListPage = (req, res, next) => {
    /** Get Page Info */
    var page = req.param('page');
    var keyword = req.param('keyword');

    /** Index page Number */
    var pageNumber = 1;
    /** Make Send Meber Paging Dao */
    var PageInfo = {
        page: page,
        pageNumber: pageNumber,
        keyword: keyword
    };

    var SampleDeviceInfo = {
        index: 1,
        SiteName: 'Test site',
        PlotName: 'Test plot',
        DeviceName: 'Testing Device',
        DeviceType: 'Data-tracker',
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    var SampleDeviceList = [SampleDeviceInfo, SampleDeviceInfo];
    res.render('admin/DevicePage/List/ListPage', {
        login: TestingLoginData,
        title: 'Admin Device List Page',
        DeviceInfoList: SampleDeviceList,
        _csrf: req.csrfToken()
    });

};
/** Admin Device Modify Page */
const ModifyPage = (req, res, next) => {
    let no = req.query.no || req.body.no || req.param.no || req.params.no;
    console.log('parameter index : ', no);
    res.render('admin/DevicePage/Modify/ModifyPage', {
        login: TestingLoginData,
        title: 'Admin Device Modify Page',
        _csrf: req.csrfToken()
    });
};
/** Admin Device Modify Do */
const ModifyDo = (req, res, next) => {

};
/** Admin Device Detail Page */
const DetailPage = (req, res, next) => {
    let no = req.param.no || req.params.no || req.query.no;
    console.log('parameter index ::: ', no);

    var DeviceSampleInfo = {
        SiteName: 'test',
        PlotName: 'Plot',
        DeviceName: 'Testing Device',
        DeviceLatitude: '20.00',
        DeviceLongitude: '10.00'
    };

    res.render('admin/DevicePage/Detail/DetailPage', {
        login: TestingLoginData,
        title: 'Admin Device Detail Page',
        DeviceInfo: DeviceSampleInfo,
        _csrf: req.csrfToken()
    });

};

/** Admin Device Delete Do */
const DeleteDo = (req, res, next) => {

};




module.exports = {
    MainPage,
    CreatePage,
    CreateDo,
    ListPage,
    ModifyPage,
    ModifyDo,
    DetailPage,
    DeleteDo
};