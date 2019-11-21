//TODO Session Checking
//TOdo Delte data just Testing
var TestingLoginData = {
    userId: 'test',
    name: 'tester'
};


/** Admin Plot Main Page */
const MainPage = (req, res, next) => {
    res.redirect('/admin/Plot/list');
};

/** Admin Plot Create Page */
const CreatePage = (req, res, next) => {
    res.render('admin/PlotPage/Create/CreatePage', {
        login: TestingLoginData,
        title: 'Admin Plot Create page',
        _csrf: req.csrfToken()
    });
};

/** Admin Plot Create Do */
const CreateDo = (req, res, next) => {

};

/** Admin Plot List Page */
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

    var SamplePlotInfo = {
        index: 1,
        SiteName: 'testing site',
        PlotName: 'Test',
        DeviceNumber: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    var SamplePlotList = [SamplePlotInfo, SamplePlotInfo];
    res.render('admin/PlotPage/List/ListPage', {
        login: TestingLoginData,
        title: 'Admin Plot List Page',
        PlotInfoList: SamplePlotList,
        _csrf: req.csrfToken()
    });
};

/** Admin Plot Detail page */
const DetailPage = (req, res, next) => {
    let no = req.param.no || req.params.no || req.query.no;
    console.log('parameter index ::: ', no);
    var DeviceSampleData = {
        DeviceName: 'testingDevice',
        DeviceType: 'data-tracker',
        Latitude: '23.00',
        Longitude: '12.00'
    };
    var DeviceSampleArray = [DeviceSampleData, DeviceSampleData];
    var PlotSampleData = {
        PlotName: 'Plot Testing',
        DeviceNumber: 2,
        DeviceInfo: DeviceSampleArray
    };
    res.render('admin/PlotPage/Detail/DetailPage', {
        login: TestingLoginData,
        title: 'Admin Plot Detail Page',
        PlotDetailInfo: PlotSampleData,
        _csrf: req.csrfToken()
    });
};

/** Admin Plot Modify Page */
const ModifyPage = (req, res, next) => {
    let no = req.query.no || req.body.no || req.param.no || req.params.no;
    console.log('parameter index : ', no);

    res.render('admin/PlotPage/Modify/ModifyPage', {
        login: TestingLoginData,
        title: 'Admin Plot Modify Page',
        _csrf: req.csrfToken()
    });

};

/** Admin Plot Modify Do */
const ModifyDo = (req, res, next) => {

};

/** Admin Plot Delete Do */
const DeleteDo = (req, res, next) => {
    let deleteValue = req.query.delete || req.body.delete;
    console.log('delete data : ', deleteValue);
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