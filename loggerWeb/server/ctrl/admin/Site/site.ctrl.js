/** Data Access Object */
const Dao = require('../../../dao/admin/Site/index.dao');
const AdminSiteDao = Dao();

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
    /** Get Parameter */
    const SiteOwner = req.param.SiteOwnerId || req.params.SiteOwnerId || req.query.SiteOwnerId || req.body.SiteOwnerId || "";
    const SiteName = req.param.SiteName || req.params.SiteName || req.query.SiteName || req.body.SiteName || "";
    /** checking parameter */
    console.log('get parameter : ' + SiteOwner + ", " + SiteName);
    let CreateJson = {
        name: SiteName,
        owner: SiteOwner
    };

    /** Create Site Dao */
    AdminSiteDao.CreateSite(CreateJson).then(result => {
        console.log('site ctrl get result : ', result);
        return res.redirect('/admin/Site/list');
    }).catch(err => {
        console.log('Site Create Error code ::: ', err.code);
        console.log('Site Create Error ::: ', err);
        return res.redirect('/admin/Site/create');
    });

};

/** Admin Site List Page */
const ListPage = (req, res, next) => {
    /** Get Page Info */
    const Page = req.param.page || req.params.page || req.query.page || 0;
    const SearchName = req.param.searchByName || req.params.searchByName || req.query.searchByName || req.body.searchByName || "";
    const SearchOwner = req.param.searchByOwner || req.params.searchByOwner || req.query.searchByOwner || req.body.searchByOwner || "";

    /** Make Send Site Paging Dao */
    var PageInfo = {
        pages: Page,
        SearchName: SearchName,
        SearchOwner: SearchOwner

    };

    AdminSiteDao.PagingSite(PageInfo).then(result => {
        if (Number(Page) > result.pageNumber) {
            return res.redirect('/admin/Site/list?page=' + result.pageNumber);
        }
        if ((Number(Page) < 1) && (Page !== "")) {
            if (result.value.length === 0) {
                return res.render('admin/SitePage/List/ListPage', {
                    login: TestingLoginData,
                    title: 'Admin Site List Page',
                    SiteInfoList: result.value,
                    SiteAllPage: result.offset,
                    _csrf: req.csrfToken()
                });
            }
            return res.redirect('/admin/Site/list?page=' + 1);
        }
        return res.render('admin/SitePage/List/ListPage', {
            login: TestingLoginData,
            title: 'Admin Site List Page',
            SiteInfoList: result.value,
            SiteAllPage: result.offset,
            _csrf: req.csrfToken()
        });
    }).catch(err => {
        console.log('error code : ', err);

        return res.redirect('/admin');
    });
};


/** Admin Site Delete DO */
const DeleteDo = (req, res, next) => {
    let deleteValue = req.query.delete || req.body.delete || "";
    let pages = req.param.page || req.params.page || req.query.page || req.body.page || "";
    let SearchName = req.param.searchByName || req.params.searchByName || req.query.searchByName || req.body.searchByName || "";
    let SearchOwner = req.param.searchByOwner || req.params.searchByOwner || req.query.searchByOwner || req.body.searchByOwner || "";

    let DeleteJson = {};
    if (pages !== "") {
        DeleteJson.pages = pages;
    }
    if (SearchName !== "") {
        DeleteJson.SearchesByName = SearchName;
    }
    if (SearchOwner !== "") {
        DeleteJson.SearchesByOwner = SearchOwner;
    }
    if (deleteValue !== "") {
        DeleteJson.id = deleteValue;
    } else {
        return res.json(false);
    }
    console.log('delete value : ', deleteValue);
    AdminSiteDao.DeleteSite(DeleteJson).then(result => {
        if (result) {
            console.log('delete success');
            return res.json(result.value);
        } else {
            console.log('delete failed');
            return res.json(false);
        }
    }).catch(err => {
        return res.json(false);
    });
};

/** Admin Site Detail Page */
const DetailPage = (req, res, next) => {
    let no = req.param.no || req.params.no || req.query.no || "";
    console.log('parameter index ::: ', no);
    let DetailJson = {
        id: no
    };

    /** Detail Site Dao */
    AdminSiteDao.DetailSite(DetailJson).then(result => {
        console.log('result : ', result.dataValues.plots);

        return res.render('admin/SitePage/Detail/DetailPage', {
            login: TestingLoginData,
            title: 'Admin Site Detail page',
            SiteDetailInfo: result,
            _csrf: req.csrfToken()
        });

    }).catch(err => {
        console.log('Admin Ctrl Detail Page Error code ::: ', err.code);
        console.log('Admin Ctrl Detail Page Error ::: ', err);
        return res.redirect('/admin/Site/list');
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

/** Admin Site Name Check */
const NameCheck = (req, res, next) => {
    console.log('Site Name check');
    const UserEmail = req.body.email || req.query.email || req.param.email || req.params.email || "";
    console.log('site Name : ', UserEmail);
    AdminSiteDao.SiteNameCheck(UserEmail).then(result => {
        if (result.length === 0) {
            console.log('Not Have User');
            return res.json(0);
        } else {
            console.log('Have User');
            return res.json(result);
        }
    }).catch(err => {
        console.log('Dao Checking Site User Email Error code ::: ', err.code);
        console.log('Dao Checking Site User Email Error ::: ', err);
        return res.json('-1');
    });
};


module.exports = {
    MainPage,
    CreatePage,
    CreateDo,
    ListPage,
    DetailPage,
    ModifyPage,
    ModifyDo,
    DeleteDo,
    NameCheck
};