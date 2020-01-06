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
    /** Empty Check */
    function EmptyCheck(data) {
        if (data === "") {
            return true;
        } else {
            return false;
        }
    }
    /** Get Parameter */
    const OwnerEmail = req.body.SiteOwnerId || req.query.SiteOwnerId || req.param.SiteOwnerId || req.params.SiteOwnerId || '';
    const SiteID = req.body.SiteSelect || req.query.SiteSelect || req.param.SiteSelect || req.params.SiteSelect || '';
    const PlotID = req.body.PlotSelect || req.query.PlotSelect || req.param.PlotSelect || req.params.PlotSelect || "";
    const DeviceName = req.body.DeviceName || req.query.DeviceName || req.param.DeviceName || req.params.DeviceName || "";
    const DeviceType = req.body.deviceType || req.query.deviceType || req.param.deviceType || req.params.deviceType || "";
    const DeviceLat = req.body.lat || req.query.lat || req.param.lat || req.params.lat || '';
    const DeviceLon = req.body.lon || req.query.lon || req.param.lon || req.params.lon || "";
    const GetIP = req.body.IP || req.query.IP || req.param.IP || req.params.IP || "";
    const GetID = req.body.ID || req.query.ID || req.param.ID || req.params.ID || "";
    const GetPW = req.body.Pw || req.query.Pw || req.param.Pw || req.params.Pw || "";
    const FolderPath = req.body.Folderpath || req.query.Folderpath || req.param.Folderpath || req.params.Folderpath || "";
    const FileType = req.body.ecologFileType || req.query.ecologFileType || req.param.ecologFileType || req.params.ecologFileType || "";

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
    if (!EmptyCheck(PlotID)) {
        DeviceJson.PlotIdx = PlotID;
    }
    if (!EmptyCheck(DeviceName)) {
        DeviceJson.name = DeviceName;
    }
    if (!EmptyCheck(DeviceType)) {
        DeviceJson.DeviceType = DeviceType;
    }
    if (!EmptyCheck(DeviceLat)) {
        DeviceJson.Lat = DeviceLat;
    }
    if (!EmptyCheck(DeviceLon)) {
        DeviceJson.Lon = DeviceLon;
    }
    /** Todo Fix */
    if (!EmptyCheck(GetIP)) {
        DeviceJson.IP = GetIP;
    }
    if (!EmptyCheck(GetID)) {
        DeviceJson.ID = GetID;
    }
    if (!EmptyCheck(GetPW)) {
        DeviceJson.PW = GetPW;
    }
    if (!EmptyCheck(FolderPath)) {
        DeviceJson.Path = FolderPath;
    }
    if (!EmptyCheck(FileType)) {
        DeviceJson.FileType = FileType;
    }


    console.log("parameter device Create : " + OwnerEmail + ", " + SiteID + ', ' + PlotID + ', ' + DeviceName + ", " + DeviceType + ", " + DeviceLat + ", " + DeviceLon + ", " + GetIP + ", " + GetID + ", " + GetPW + ", " + FolderPath + ", " + FileType);
    AdminDeviceDao.CreateDevice(DeviceJson).then(result => {
        console.log("Device Create Success");
        return res.redirect('/admin/Device/list');
    }).catch(err => {
        console.log("Admin Device Ctrl Create page Error code ::: ", err.code);
        console.log("Admin Device Ctrl Create page Error ::: ", err);
        return res.redirect('/admin/Device/create');
    });

};
/** Admin Device List Page */
const ListPage = (req, res, next) => {
    /** Get Page Info */
    const Page = req.param.page || req.params.page || req.query.page || req.body.page || 0;

    /** Make Send Device Paging Dao */
    let DeviceJson = {
        pages: Page
    };
    /** Device Dao Paging */
    AdminDeviceDao.PagingDevice(DeviceJson).then(result => {
        console.log('result value : ', result);

        if (Number(Page) > result.pageNumber) {
            return res.redirect('/admin/Device/list?page=' + result.pageNumber);
        }
        if ((Number(Page) < 1) && (Page !== "")) {
            if (result.value.length === 0) {
                return res.render('admin/DevicePage/List/ListPage', {
                    login: TestingLoginData,
                    title: 'Admin Plot List Page',
                    DeviceInfoList: result.value,
                    DeviceAllPage: result.pageNumber,
                    curPage: Page,
                    _csrf: req.csrfToken()
                });
            }
            return res.redirect('/admin/Device/list?page=1');
        }
        if (parseInt(Page) < result.pageNumber - 3) {

            console.log('testing ');
        } else {
            console.log('testing failed');
        }
        return res.render('admin/DevicePage/List/ListPage', {
            login: TestingLoginData,
            title: 'Admin Device List Page',
            DeviceInfoList: result.value,
            DeviceAllPage: result.pageNumber,
            curPage: Page,
            _csrf: req.csrfToken()
        });

    }).catch(err => {
        console.log('Ctrl Admin Device Error code ::: ', err.code);
        console.log('Ctrl Admin Device Error ::: ', err);
        return res.redirect('/admin');
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

//TODO
/** Make Value Chart */
const _ChartData = (no) => {
    return new Promise((resolve, reject) => {
        if (no === "") {
            return reject("_ChartData");
        }
        AdminDeviceDao.DetailGraphDevice(no).then(result => {
            console.log("GET GRAPH DATA : ", result);
            if (result.DeviceType === "HikVision") {
                return resolve(null);
            }
            if (result.DeviceColumns.length == 0) {
                console.log("RESULT CHART NAME 0 : ", result.DeviceColumns);
                return reject("_ChartData");
            }
            let Names = result.DeviceColumns[0].dataValues.columns;
            let NamesSplit = Names.split(',');
            let dataOrigin = result.DeviceColumnData;
            let dataArray = [];
            for (let i in NamesSplit) {
                let dataJson = {};
                dataJson.name = NamesSplit[i];
                dataJson.data = [];
                if (Number(i) !== 0) {
                    dataArray.push(dataJson);
                }
            }
            console.log("DATA IS : ", result.DeviceColumnData.length);
            for (let i = 0; i < dataOrigin.length; i++) {
                //console.log('data origin : ', dataOrigin[i].dataValues.columnValue.split(','));

                let splitData = dataOrigin[i].dataValues.columnValue.split(',');
                let DataTime;
                for (let i2 in splitData) {
                    if (i2 == 0) {
                        //console.log('get Time : ', splitData[i2]);
                        DataTime = new Date(splitData[i2]); //.getTime();
                    } else {
                        let chartData = splitData[i2];
                        let InsertData = parseFloat(chartData);
                        if (isNaN(InsertData)) {
                            InsertData = null;
                        }
                        dataArray[i2 - 1].data.push([DataTime, InsertData]);
                        //console.log(chartData);
                    }
                }

            }
            return resolve(dataArray);
        }).catch(err => {
            return reject(err);
        });
    });
};

/** Admin Device Detail Page */
const DetailPage = (req, res, next) => {
    let no = req.param.no || req.params.no || req.query.no || "";
    console.log('parameter index ::: ', no);
    if (no === "") {
        req.flash('message', "Not Select Device Detail Number");
        return res.redirect('/admin/Device/list');
    }
    AdminDeviceDao.DetailDevice(no).then(result => {
        console.log('Device Detail Page Info : ', result.dataValues.id);
        console.log('NO : ', no);

        _ChartData(no).then(chartResult => {
            console.log("CHART DATA RESULT : ", chartResult);
            res.render('admin/DevicePage/Detail/DetailPage', {
                login: TestingLoginData,
                title: 'Admin Device Detail Page',
                DeviceInfo: result,
                chartData: chartResult,
                _csrf: req.csrfToken()
            });
        }).catch(err => {
            console.log("ERROR CHART DATA");
        });

        /*
        return res.render('admin/DevicePage/Detail/DetailPage', {
            login: TestingLoginData,
            title: 'Admin Device Detail Page',
            DeviceInfo: result,
            _csrf: req.csrfToken()
        });
        */
    }).catch(err => {
        console.log('Ctrl Admin Device Detail Page Error code ::: ', err.code);
        console.log('Ctrl Admin Device Detail Page Error ::: ', err);
        //return res.json(0);
        return res.redirect('/admin/Device/list');
    });

};

/** Admin Device Detail And Show Graph */
const DetailGraphDevice = (req, res, next) => {
    let no = req.param.no || req.params.no || req.query.no || "";
};

/** Admin Device Delete Do */
const DeleteDo = (req, res, next) => {
    const deleteValue = req.query.delete || req.body.delete || "";
    const Page = req.param.page || req.params.page || req.body.page || req.query.page || "";

    let DeleteJson = {};
    if (Page !== "") {
        DeleteJson.pages = pages;
    }

    if (deleteValue !== "") {
        DeleteJson.id = deleteValue;
    } else {
        return res.json(false);
    }

    console.log('get parameter : ', DeleteJson);

    AdminDeviceDao.DeleteDevice(DeleteJson).then(result => {
        if (result) {
            console.log('delete value : ', result);
            return res.json(result);
        } else {
            return res.json(false);
        }
    }).catch(err => {
        return res.json(false);
    });
};




module.exports = {
    MainPage,
    CreatePage,
    CreateDo,
    ListPage,
    ModifyPage,
    ModifyDo,
    DetailPage,
    DetailGraphDevice,
    DeleteDo
};