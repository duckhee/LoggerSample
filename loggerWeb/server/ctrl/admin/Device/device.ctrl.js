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

 /** Empty Check */
 function EmptyCheck(data){
     if(data === ""){
         return true;
     }else{
         return false;
     }
 }

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
    const DeviceLon = req.body.lon || re.query.lon || req.param.lon || req.params.lon || "";
    const GetIP = req.body.IP || req.query.IP || req.param.IP || req.params.IP || "";
    const GetID = req.body.ID || req.query.ID || req.param.ID || req.params.ID || "";
    const GetPW = req.body.Pw || req.query.Pw || req.param.Pw || req.params.Pw || "";
    const FolderPath = req.body.Folderpath || req.query.Folderpath || req.param.Folderpath || req.params.Folderpath || "";
    const FileType = req.body.Filetype || req.query.Filetype || req.param.Filetype || req.params.Filetype || "";
    
    /** Device Type Mapping */
    let DeviceJson = {};

    /*
    if(!EmptyCheck(OwnerEmail)){
        DeviceJson.UserEmail = OwnerEmail;
    }
    if(!EmptyCheck(SiteID)){
        DeviceJson.SiteID = SiteID;
    }
    */
    if(!EmptyCheck(PlotID)){
        DeviceJson.PlotIdx = PlotID;
    }
    if(!EmptyCheck(DeviceName)){
        DeviceJson.name = DeviceName;
    }
    if(!EmptyCheck(DeviceType)){
        DeviceJson.DeviceType = DeviceType;
    }
    if(!EmptyCheck(DeviceLat)){
        DeviceJson.Lat = DeviceLat;
    }
    if(!EmptyCheck(DeviceLon)){
        DeviceJson.Lon = DeviceLon;
    }
    if(!EmptyCheck(GetIP)){
        DeviceJson.IP = GetIP;
    }
    if(!EmptyCheck(GetID)){
        DeviceJson.ID = GetID;
    }
    if(!EmptyCheck(GetPW)){
        DeviceJson.PW = GetPW;
    }
    if(!EmptyCheck(FolderPath)){
        DeviceJson.Path = FolderPath;
    }
    if(!EmptyCheck(FileType)){
        DeviceJson.FileType = FileType;
    }


    console.log("parameter device Create : " + OwnerEmail + ", " + SiteID + ', ' + PlotID+', '+DeviceName+", "+DeviceType+", "+DeviceLat+", "+DeviceLon+", "+GetIP+", "+GetID+", "+GetPW+", "+FolderPath+", "+FileType);
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