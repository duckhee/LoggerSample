/** Admin Member Dao */
const AdminMemberDao = require('../../../dao/admin/Members/mongoDB/members.dao');

/** Admin Member Main Page */
const MainPage = (req, res, next) => {
    console.log('Main page is Member List Page');
    res.redirect('/admin/Members/list');
};

/** Admin Member List Page And Searching Use Parameter */
const ListPage = (req, res, next) => {
    //TODO Session Checking
    //TODO Delete Data just Test
    var TestingLoginData = {
        userId: 'test',
        name: 'tester'
    };
    //TODO Search and Paging
    const Page = req.param.page || req.params.page;
    const Search = req.param.search || req.params.search;
    /** Get page Info  */
    var page = req.param('page');
    /** Get Keyword Info */
    var keyword = req.param('keyword');
    /** */
    var pageNumber = 1;
    /** Make Send Meber Paging Dao */
    var PageInfo = {
        page: page,
        pageNumber: pageNumber,
        keyword: keyword
    };

    //TODO Testing Data
    var UserInfo = {
        index: 1,
        UserId: 'tester',
        UserName: 'won',
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    var UserList = [UserInfo, UserInfo];
    res.render('admin/Member/List/ListPage', {
        login: TestingLoginData,
        UserInfoList: UserList,
        title: 'Admin Member List Page'
    });
};


/** Admin Member Create Page */
const RegistePage = (req, res, next) => {
    //TODO Session Checking
    //TODO Delete Data just Test
    var TestingLoginData = {
        userId: 'test',
        name: 'tester'
    };
    res.render('admin/Member/Registe/RegistePage', {
        login: TestingLoginData,
        title: 'Admin Registe Customer Page'
    });
};

/** Admin Member Create Do */
const RegisteDo = (req, res, next) => {

};

/** Admin Member Profile Page */
const ProfilePage = (req, res, next) => {

};

/** Admin Member Modify Page */
const ModifyPage = (req, res, next) => {

};

/** Admin Member Modify Do */
const ModifyDo = (req, res, next) => {

};

/** Admin Member Delete Page */
const DeletePage = (req, res, next) => {

};

/** Admin Member Delete Do */
const DeleteDo = (req, res, next) => {

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
    ModifyPage,
    ModifyDo,
    DeletePage,
    DeleteDo,
    EmailCheck
};