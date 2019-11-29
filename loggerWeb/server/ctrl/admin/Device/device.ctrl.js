/** Device Dao */
const Dao = require('../../../dao/admin/Device/index.dao');
const AdminDeviceDao = Dao();

/**
 * Raw Value is 
 * name
 * PlotIdx
 * DeviceType
 * Lat
 * Lon
 * IP
 * ID
 * PW
 * Path
 * FileType
 */


//TODO Session Checking
//TOdo Delte data just Testing
var TestingLoginData = {
    userId: 'test',
    name: 'tester'
};

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
    /** Get Parameter */
    const OwnerEmail = req.body.SiteOwnerId || req.query.SiteOwnerId || req.param.SiteOwnerId || req.params.SiteOwnerId || '';
    const SiteID = req.body.SiteSelect || req.query.SiteSelect || req.param.SiteSelect || req.params.SiteSelect || '';
    const PlotID = req.body.PlotSelect || req.query.PlotSelect || req.param.PlotSelect || req.params.PlotSelect || "";
    const DeviceName = req.body.DeviceName || req.query.DeviceName || req.param.DeviceName || req.params.DeviceName || "";
    const DeviceType = req.body.deviceType || req.query.deviceType || req.param.deviceType || req.params.deviceType || "";
    const DeviceLat = req.body.lat || req.query.lat || req.param.lat || req.params.lat || '';
    const DataTrackerIP = req.body.dataTrackerIP || req.query.dataTrackerIP || req.param.dataTrackerIP || req.params.dataTrackerIP || "";
    const DataTrackerID = req.body.dataTrackerID || req.query.dataTrackerID || req.param.dataTrackerID || req.params.dataTrackerID || "";
    const DataTrackerPW = req.body.dataTrackerPw || req.query.dataTrackerPw || req.param.dataTrackerPw || req.params.dataTrackerPw || "";
    const DataTrackerFolder = req.body.dataTrackerFolder || req.query.dataTrackerFolder || req.param.dataTrackerFolder || req.params.dataTrackerFolder || "";
    const EcologPath = req.body.ecologFTPFolder || req.query.ecologFTPFolder || req.param.ecologFTPFolder || req.params.ecologFTPFolder || "";
    const EcologType = req.body.ecologFileType || req.query.ecologFileType || req.param.ecologFileType || req.params.ecologFileType || "";
    const HikvisionIP = req.body.hikvisionIp || req.query.hikvisionIp || req.param.hikvisionIp || req.params.hikvisionIp || "";

    /** Device Type Mapping */

    console.log("parameter device Create : " + OwnerEmail + ", " + SiteID + ', ' + PlotID);
    res.redirect('/admin/Device/list');
};
/** Admin Device List Page */
const ListPage = (req, res, next) => {
    /** Get Page Info */


    /** Index page Number */
    var pageNumber = 1;
    /** Make Send Meber Paging Dao */
    var PageInfo = {
        page: 1,
        pageNumber: pageNumber,
        keyword: 'keyword'
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