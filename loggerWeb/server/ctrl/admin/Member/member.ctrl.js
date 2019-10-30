/** Admin Member Dao */
const AdminMemberDao = require('../../../dao/admin/Members/mongoDB/members.dao');

/** Admin Member Main Page */
const MainPage = (req, res, next) => {

};

/** Admin Member List Page */
const ListPage = (req, res, next) => {
    //TODO Session Checking
    //TODO Delete Data just Test
    var TestingLoginData = {
        userId: 'test',
        name: 'tester'
    };
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
    res.render('admin/Member/List/ListPage', {
        login: TestingLoginData,
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