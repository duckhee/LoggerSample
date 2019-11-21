//TODO Session Checking
//TOdo Delte data just Testing
var TestingLoginData = {
    userId: 'test',
    name: 'tester'
};

/** Admin Site Page */
const MainPage = (req, res, next) => {
    res.redirect('/admin/Site/List/ListPage');
};

/** Admin Site Create Page */
const CreatePage = (req, res, next) => {
    res.render('admin/SitePage/Create/CreatePage', {
        login: TestingLoginData,
        title: 'Admin Site Create Page',
        _csrf: req.csrfToken()
    });
};

/** Admin Site Create Do */
const CreateDo = (req, res, next) => {
    res.redirect('/admin/Site/list');
};

/** Admin Site List Page */
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

    var SampleSiteInfo = {
        index: 1,
        UserId: 'tester',
        SiteName: 'testing site',
        plotNumber: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    var SampleSiteList = [SampleSiteInfo, SampleSiteInfo];
    res.render('admin/SitePage/List/ListPage', {
        login: TestingLoginData,
        title: 'Admin Site List Page',
        SiteInfoList: SampleSiteList,
        _csrf: req.csrfToken()
    });

};

/** Admin Site Detail Page */
const DetailPage = (req, res, next) => {
    let no = req.param.no || req.params.no || req.query.no;
    console.log('parameter index ::: ', no);
    var SampleDeviceInfo = {
        DeviceName: 'Testing',
        Type: 'Data Tracker'
    };
    var PlotDeviceArray = [SampleDeviceInfo, SampleDeviceInfo];
    var PlotDetailInfo = {
        PlotName: 'Test Plot',
        DeviceInfo: PlotDeviceArray
    };
    var PlotDetailArray = [PlotDetailInfo, PlotDetailInfo];
    //TODO Sample Data 
    var SampleSiteDetailInfo = {
        Name: 'Testing',
        PlotNumber: 5,
        PlotDetailInfo: PlotDetailArray
    };


    res.render('admin/SitePage/Detail/DetailPage', {
        login: TestingLoginData,
        title: 'Admin Site Detail page',
        SiteDetailInfo: SampleSiteDetailInfo,
        _csrf: req.csrfToken()
    });
};

/** Admin Site Edit Page */
const ModifyPage = (req, res, next) => {
    let no = req.params.no || req.param.no || req.query.no || req.body.no;
    console.log('parameter index : ', no);

    res.render('admin/SitePage/Modify/ModifyPage', {
        login: TestingLoginData,
        title: 'Admin Site Modify page',
        SiteDetailInfo: '',
        _csrf: req.csrfToken()
    });

};

/** Admin Site Edit Do */
const ModifyDo = (req, res, next) => {

};

/** Admin Site Delete DO */
const DeleteDo = (req, res, next) => {
    let deleteValue = req.query.delete || req.body.delete;
    console.log('delete value : ', deleteValue);
    res.json(deleteValue);
};




module.exports = {
    MainPage,
    CreatePage,
    CreateDo,
    ListPage,
    DetailPage,
    ModifyPage,
    ModifyDo,
    DeleteDo
};