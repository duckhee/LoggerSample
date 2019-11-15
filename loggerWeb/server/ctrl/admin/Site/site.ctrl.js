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
        title: 'Admin Site Create Page'
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
        SiteInfoList: SampleSiteList
    });

};

/** Admin Site Edit Page */
const ModifyPage = (req, res, next) => {

};

/** Admin Site Edit Do */
const ModifyDo = (req, res, next) => {

};

/** Admin Site Delete Page */
const DeletePage = (req, res, next) => {

};

/** Admin Site Delete DO */
const DeleteDo = (req, res, next) => {

};


module.exports = {
    MainPage,
    CreatePage,
    CreateDo,
    ListPage,
    ModifyPage,
    ModifyDo,
    DeletePage,
    DeleteDo
};