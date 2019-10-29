/** Admin Member Main Page */
const MainPage = (req, res, next) => {

};

/** Admin Member List Page */
const ListPage = (req, res, next) => {
    /** Get page Info  */
    var page = req.param('page');
    /** Get Keyword Info */
    var keyword = req.param('keyword');
    /** */
    var pageNumber = 1;
    /** Make Send Meber Paging Dao */
    var PageInfo = {
        page:page,
        pageNumber:pageNumber,
        ketword:ketword
    };

};

/** Admin Member Create Page */
const RegistePage = (req, res, next) => {

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

module.exports = {
    MainPage,
    ListPage,
    RegistePage,
    RegisteDo,
    ProfilePage,
    ModifyPage,
    ModifyDo,
    DeletePage,
    DeleteDo
};