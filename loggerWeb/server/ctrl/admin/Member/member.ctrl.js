/** Data Access Object */
const Dao = require('../../../dao/admin/Members/index.dao');
const AdminMemberDao = Dao();
//TODO Session Checking
//TODO Delete Data just Test
var TestingLoginData = {
    userId: 'test',
    name: 'tester'
};



/** Admin Member Main Page */
const MainPage = (req, res, next) => {
    console.log('Main page is Member List Page');
    res.redirect('/admin/Members/list');
};

/** Admin Member List Page And Searching Use Parameter */
const ListPage = (req, res, next) => {
    //TODO Search and Paging
    const Page = req.param.page || req.params.page || req.query.page || 0;
    const SearchName = req.param.searchByName || req.params.searchByName || req.query.searchByName || req.body.searchByName || "";
    const SearchId = req.param.searchById || req.params.searchById || req.query.searchById || req.body.searchById || "";
    const SearchLevel = req.param.searchByLevel || req.params.searchByLevel || req.query.searchByLevel || req.body.searchByLevel || "";


    /** Make Send Member Paging Dao */
    let UserList = {
        pages: Page,
        SearchesByName: SearchName,
        SearchesById: SearchId,
        SearchesByLevel: SearchLevel
    };

    /** Member Dao Paging */
    AdminMemberDao.PagingUser(UserList).then(result => {
        if (Number(page) > result.pageNumber) {
            return res.redirect('/admin/Members/list?page=' + result.pageNumber);
        }
        if ((Number(page) < 1) && (page !== "")) {
            return res.redirect('/admin/Members/list?page=' + 1);
        }
        return res.render('admin/Member/List/ListPage', {
            login: TestingLoginData,
            UserInfoList: result.value,
            UserAllPage: result.offset,
            title: 'Admin Member List Page',
            _csrf: req.csrfToken()
        });
    }).catch(err => {
        console.log('error code : ', err.code);
        return res.redirect('/admin');
    });

};


/** Admin Member Create Page */
const RegistePage = (req, res, next) => {
    // console.log('csurfMiddleWare :: ', req.csrfToken());

    console.log('req session : ', req.session);
    res.render('admin/Member/Registe/RegistePage', {
        login: TestingLoginData,
        title: 'Admin Registe Customer Page',
        _csrf: req.csrfToken()
    });
};

/** Admin Member Create Do */
const RegisteDo = (req, res, next) => {
    const GetEmail = req.body.userEmail || req.query.userEmail || "";
    const GetPw = req.body.userPw || req.query.userPw || "";
    const GetName = req.body.userName || req.query.userName || "";
    /** Make user model */
    let UserModel = {
        email: GetEmail,
        password: GetPw,
        name: GetName
    };
    if (GetEmail === "" || GetPw === "" || GetName === "") {
        return res.redirect('/admin/Members/registe');
    }
    AdminMemberDao.RegisteUser(UserModel, (err, user, created) => {
        if (err) {
            return res.redirect('/admin/Members/registe');
        } else if (created) {
            console.log('created :: ', created);
            return res.redirect('/admin');
        } else if (user) {
            console.log('user email', user);
            return res.redirect('/admin/Members/registe');
        } else {
            return res.redirect('/admin/Members/registe');
        }
    });
};

/** Admin Member Profile Page */
const ProfilePage = (req, res, next) => {


};

/** Admin Member DetailPage */
const DetailPage = (req, res, next) => {
    let no = req.param.no || req.params.no || req.query.no || req.body.no || "";

    console.log('member index no ::: ', no);
    let SampleMemberInfo = {
        UserEmail: 'test@co.kr',
        UserName: 'test',
        UserLevel: '5'
    };

    if (no === "") {
        console.log('not user select');
        return res.redirect('/admin/Members/list');
    }

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
    const no = req.param.no || req.params.no || req.query.no || req.body.no || "";

};

/** Admin Member Delete Do */
const DeleteDo = (req, res, next) => {
    let deleteValue = req.param.delete || req.params.delete || req.body.delete || req.query.delete || "";
    let pages = req.param.page || req.params.page || req.query.page || req.body.page || "";
    let SearchName = req.param.searchByName || req.params.searchByName || req.query.searchByName || req.body.searchByName || "";
    let SearchId = req.param.searchById || req.params.searchById || req.query.searchById || req.body.searchById || "";
    let SearchLevel = req.param.searchByLevel || req.params.searchByLevel || req.query.searchByLevel || req.body.searchByLevel || "";

    console.log('key word : ' + SearchName + ", " + SearchId + ', ' + SearchLevel);
    let DeleteJson = {};

    /** User Session get */
    console.log('user Session : ', req.session);
    if (pages !== "") {
        DeleteJson.pages = pages;
    }
    if (SearchName !== "") {
        DeleteJson.SearchesByName = SearchName;
    }
    if (SearchId !== "") {
        DeleteJson.SearchesById = SearchId;
    }

    if (SearchLevel !== "") {
        DeleteJson.SearchesByLevel = SearchLevel;
    }

    if (deleteValue !== "") {
        DeleteJson.id = deleteValue;
    } else {
        return res.json(false);
    }
    console.log('array delete : ', deleteValue);
    AdminMemberDao.DeleteUser(DeleteJson).then(result => {
        console.log('result value : ', result);
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

/** Admin Member Email Check */
const EmailCheck = (req, res, next) => {
    console.log('member email check');
    const UserEmail = req.body.email || req.query.email || req.param.email || req.params.email || "";
    console.log('user Email : ', UserEmail);
    AdminMemberDao.EmailCheckUser(UserEmail).then(result => {
        console.log('result : ', result);

        if (result === 0) {
            console.log('not have user email');
            res.json(0);
        } else {
            console.log('have user email');
            res.json(1);
        }
    }).catch(err => {
        console.log('error code ::: ', err.code);
        res.json('-1');
    });
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