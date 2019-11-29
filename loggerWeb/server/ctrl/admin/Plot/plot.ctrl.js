const Dao = require('../../../dao/admin/Plot/index.dao');
const AdminPlotDao = Dao();

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
        _csrf: req.csrfToken(),
        message: req.flash()
    });
};

/** Admin Plot Create Do */
const CreateDo = (req, res, next) => {
    const PlotOwner = req.param.PlotOwnerId || req.params.PlotOwnerId || req.body.PlotOwnerId || req.query.PlotOwnerId || "";
    const PlotSite = req.param.SiteName || req.params.SiteName || req.body.SiteName || req.query.SiteName || "";
    const PlotName = req.param.PlotName || req.params.PlotName || req.body.PlotName || req.query.PlotName || "";
    const SiteIdx = req.param.SiteCheckId || req.params.SiteCheckId || req.body.SiteCheckId || req.query.SiteCheckId || '';
    console.log('get parameter : ', PlotOwner + ', ' + PlotSite + ', ' + PlotName + ', ' + SiteIdx);
    /** Make Create Plot Json */
    if (PlotOwner == "") {
        req.flash("Msg", "Plot Owner Not Empty");
        return res.redirect('/admin/Plot/create');
    }
    if (SiteIdx === "") {
        req.flash("Msg", "Plot Site Not Empty");
        return res.redirect('/admin/Plot/create');
    }
    if (PlotName === "") {
        req.flash("Msg", "Plot Name Not Empty");
        return res.redirect('/admin/Plot/create');
    }
    let CreateJson = {
        owner: PlotOwner,
        siteIdx: SiteIdx,
        name: PlotName
    };
    AdminPlotDao.CreatePlot(CreateJson).then(result => {
        return res.redirect('/admin/Plot/list');
    }).catch(err => {
        console.log('Admin Ctrl Create Plot Error code ::: ', err.code);
        console.log('Admin Ctrl Create Plot Error ::: ', err);
        return res.redirect('/admin/Plot/create');
    });

};

/** Admin Plot List Page */
const ListPage = (req, res, next) => {
    const Page = req.param.page || req.params.page || req.query.page || 0;
    const SearchSiteName = req.param.searchBySiteName || req.params.searchBySiteName || req.query.searchBySiteName || req.body.searchBySiteName || "";
    const SearchPlotName = req.param.searchByPlotName || req.params.searchByPlotName || req.query.searchByPlotName || req.body.searchByPlotName || "";

    /** Make Send Plot Paging Dao */
    let PlotListJson = {
        pages: Page,
        SearchesBySiteName: SearchSiteName,
        SearchesByPlotName: SearchPlotName
    };

    AdminPlotDao.PagingPlot(PlotListJson).then(result => {
        return res.render('admin/PlotPage/List/ListPage', {
            login: TestingLoginData,
            title: 'Admin Plot List Page',
            PlotInfoList: result.value,
            _csrf: req.csrfToken()
        });
    }).catch(err => {
        console.log('Ctrl Plot List Page Error code ::: ', err.code);
        console.log('Ctrl Plot List Page Error ::: ', err);
        return res.redirect('/admin');
    });
};

/** Admin Plot Detail page */
const DetailPage = (req, res, next) => {
    let no = req.param.no || req.params.no || req.query.no || "";
    console.log('parameter index ::: ', no);
    if (no === "") {
        req.flash('message', "Not Null Plot Selecter");
        return res.redirect('/admin/Plot/list');
    }
    let DetailJson = {
        id: no
    };

    AdminPlotDao.DetailPlot(DetailJson).then(result => {
        console.log('Detail Value ', result);

        return res.render('admin/PlotPage/Detail/DetailPage', {
            login: TestingLoginData,
            title: 'Admin Plot Detail Page',
            PlotDetailInfo: result,
            _csrf: req.csrfToken()
        });
    }).catch(err => {
        console.log("Admin Plot Ctrl Detail Error code ::: ", err.code);
        console.log("Admin Plot Ctrl Detail Error ::: ", err);
        return res.redirect('/admin/Plot/list');
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
    let deleteValue = req.query.delete || req.body.delete || "";
    let pages = req.query.page || req.body.page || "";

    let DeleteJson = {};
    if (pages !== "") {
        DeleteJson.pages = pages;
    }
    if (deleteValue !== "") {
        DeleteJson.id = deleteValue;
    } else {
        return res.json(false);
    }
    AdminPlotDao.DeletePlot(DeleteJson).then(result => {
        if (result) {
            console.log('result : ', result);
            return res.json(result.value);
        } else {
            console.log('delete failed');
            return res.json(false);
        }
    }).catch(err => {
        console.log('delete plot ctrl error : ', err);
        return res.json(false);
    });

};

/** Admin Plot Name Check */
const NameCheck = (req, res, next) => {
    console.log('Plot Name Check');
    const PlotName = req.body.plotName || req.query.plotName || req.param.plotName || req.params.plotName || "";
    console.log("Plot Name : ", PlotName);
    AdminPlotDao.PlotNameCheck(PlotName).then(result => {
        if (result.length === 0) {
            console.log('Not Have Plot');
            return res.json(0);
        } else {
            console.log('Have Plot');
            return res.json(result);
        }
    }).catch(err => {
        console.log('Admin Ctrl Name Check Plot Error code ::: ', err.code);
        console.log('Admin Ctrl Name Check Plot Error ::: ', err);
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