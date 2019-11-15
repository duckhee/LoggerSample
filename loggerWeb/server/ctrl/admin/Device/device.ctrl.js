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

const CreatePage = (req, res, next) => {
    res.render('admin/DevicePage/Create/CreatePage', {
        login: TestingLoginData,
        title: 'Admin Device Create Page'
    });
};

const CreateDo = (req, res, next) => {
    res.redirect('/admin/Device/list');
};

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

    };

    var SampleDeviceList = [SampleDeviceInfo, SampleDeviceInfo];
    res.render('admin/DevicePage/List/ListPage', {
        login: TestingLoginData,
        title: 'Admin Device List Page',
        DeviceInfoList: ''

    });

};

const ModifyPage = (req, res, next) => {

};

const ModifyDo = (req, res, next) => {

};

const DetailPage = (req, res, next) => {

};

const DeletePage = (req, res, next) => {

};

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
    DeletePage,
    DeleteDo
};