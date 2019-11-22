//TODO Session Checking
//TODO Delete Data just Test
var TestingLoginData = {
    userId: 'test',
    name: 'tester'
};

/** Admin Member Dao */
const AdminMemberDao = require('../../../dao/admin/Members/mongoDB/members.dao');

/** Admin Member Main Page */
const MainPage = (req, res, next) => {
    console.log('Main page is Member List Page');
    res.redirect('/admin/Members/list');
};

/** Admin Member List Page And Searching Use Parameter */
const ListPage = (req, res, next) => {
    //TODO Search and Paging
    const Page = req.param.page || req.params.page;
    const Search = req.param.search || req.params.search;
    /** Get page Info  */
    var page = req.param('page');
    /** Get Keyword Info */
    var keyword = req.param('keyword');
    /** Index page Number */
    var pageNumber = 1;
    /** Make Send Meber Paging Dao */
    var PageInfo = {
        page: page,
        pageNumber: pageNumber,
        keyword: keyword
    };

    //TODO Testing Data
    var SampleUserInfo = {
        index: 1,
        UserId: 'tester',
        UserLevel: 2,
        UserName: 'won',
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    var SampleUserInfo2 = {
        index: 2,
        UserId: 'tester',
        UserLevel: 2,
        UserName: 'won',
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    var SampleUserList = [SampleUserInfo, SampleUserInfo2];
    res.render('admin/Member/List/ListPage', {
        login: TestingLoginData,
        UserInfoList: SampleUserList,
        title: 'Admin Member List Page',
        _csrf: req.csrfToken()
    });
};


/** Admin Member Create Page */
const RegistePage = (req, res, next) => {
    // console.log('csurfMiddleWare :: ', req.csrfToken());
    req.session.logined = true;
    if (!req.session.count) {
        req.session.count = 0;
    } else {
        req.session.count += 1;
    }
    console.log('req session : ', req.session);
    res.render('admin/Member/Registe/RegistePage', {
        login: TestingLoginData,
        title: 'Admin Registe Customer Page',
        _csrf: req.csrfToken()
    });
};

/** Admin Member Create Do */
const RegisteDo = (req, res, next) => {
    console.log('session get : ', req.session);
    console.log('session testing count : ', req.session.logined);
    //console.log('res :: ', res);
    if (req.session.count) {
        console.log('session count : ', req.session.count);
    }
    res.json('test');
};

/** Admin Member Profile Page */
const ProfilePage = (req, res, next) => {


};

/** Admin Member DetailPage */
const DetailPage = (req, res, next) => {
    let no = req.param.no || req.params.no || req.query.no;
    console.log('member index no ::: ', no);
    let SampleMemberInfo = {
        UserEmail: 'test@co.kr',
        UserName: 'test',
        UserLevel: '5'
    };

    res.render('admin/Member/Detail/DetailPage', {
        login: TestingLoginData,
        title: 'Admin Member Detail Page',
        _csrf: req.csrfToken()
    });
};

/** Admin Member Modify Page */
const ModifyPage = (req, res, next) => {
    const no = req.param.no || req.params.no || req.query.no;
    console.log("parameter index ::: ", no);
    res.render('admin/Member/Modify/ModifyPage', {
        login: TestingLoginData,
        title: 'Admin Member Modify Page',
        _csrf: req.csrfToken()
    });
};

/** Admin Member Modify Do */
const ModifyDo = (req, res, next) => {

};

/** Admin Member Delete Do */
const DeleteDo = (req, res, next) => {
    let deleteValue = req.param.delete || req.params.delete || req.body.delete || req.query.delete;

    console.log('delete value ::: ', deleteValue);

    res.json(true);
};

/** Admin Member Email Check */
const EmailCheck = (req, res, next) => {

};

module.exports = {
    MainPage,
    ListPage,
    RegistePage,
    RegisteDo,
    ProfilePage,
    DetailPage,
    ModifyPage,
    ModifyDo,
    DeleteDo,
    EmailCheck
};