const MongooseUserDao = require('../../../dao/mongoose/admin/user/user.admin.mongoose.dao');


const InsertPage = (req, res, next) => {
    console.log('insert admin member page show');
    res.render('admin/user/insertPage', {
        login: req.session.userInfo
    });
};

const InsertDo = (req, res, next) => {
    console.log('insert amdin member post do');
    const UserInfo = {
        userId: req.body.user_id,
        userPw: req.body.user_pw,
        userName: req.body.user_name
    };
    MongooseUserDao.InsertUser(UserInfo).then((result) => {
        console.log(result);
        res.redirect('/admin/member');

    }).catch((err) => {
        console.log('insert do ctrl mongoose error code :::', err.code);
        console.log('insert do ctrl mongoose error :::', err);
        res.redirect('/admin/member/create');
    });
};

const UserIdCheck = (req, res, next) => {
    console.log('user id check post do');
    const UserInfo = {
        userId: req.body.userId
    };
    MongooseUserDao.FindUserCountById(UserInfo).then((result) => {
        res.json(result);
    }).catch((err) => {
        console.log('find by user id check ctrl error code :::: ' + err.code);
        console.log('find by user id check ctrl error :::: ' + err);
        res.json(-1);
    });
};

const UserListPagingSearchPage = (req, res, next) => {
    var page = req.param('page');
    var keyword = req.param('keyword');
    console.log("page ::: " + page + ", search keyword ::: " + keyword);
    var pageNum = 1;
    var PageInfo = {
        page: page,
        pageNum: pageNum, //4
        keyword: keyword
    };
    console.log('pre Info ::: ', PageInfo);
    MongooseUserDao.PagingSearch(PageInfo).then(result => {
        console.log('Paging Search result ::: ', result);
        res.render('admin/user/listPage', {
            user: result.result,
            login: req.session.userInfo,
            page: result
        });
    }).catch(err => {
        console.log('paging and search paging user Ctrl error code ::: ', err.code);
        console.log('paging and search paging user Ctrl error ::: ', err);
        res.redirect('/admin/member/list');
    });
};

const UserDetailPage = (req, res, next) => {
    console.log("user Detail Page show");
    var UserIndex = req.param('no');
    MongooseUserDao.FindUserInfoAll(UserIndex).then(UserDetail => {
        console.log('user Detail ::: ', UserDetail);
        if(UserDetail == null)
        {
            console.log('UserDetail data null');
             res.redirect('/admin/member/list');
        }
        res.render('admin/user/detailPage', {
            login: req.session.userInfo,
            user: UserDetail
        });

    }).catch(err => {
        res.json(err);
    });
};

const UserUpdatePage = (req, res, next) => {
    console.log('user Update Page show');
    var UserIndex = req.param('no');
    console.log(UserIndex);
    if (UserIndex == null || UserIndex == '') {
        res.redirect('/admin/member/list');
    } else {
        MongooseUserDao.FindUserByIndex(UserIndex).then(UserResult => {
            console.log('user update result ::: ', UserResult);
            if (UserResult != null) {
                res.render('admin/user/updatePage', {
                    login: req.session.userInfo,
                    user: UserResult
                });
            } else {
                res.redirect('/admin/member/list');
            }
        }).catch(err => {
            console.log('user update page ctrl error code ::: ', err.code);
            console.log('user update page ctrl error ::: ', err);
            res.redirect('/admin/member/list');
        });
    }
};

const UserUpdateDo = (req, res, next) => {
    console.log('user Update post do');
    
};



module.exports = {
    InsertPage,
    InsertDo,
    UserIdCheck,
    UserListPagingSearchPage,
    UserDetailPage,
    UserUpdatePage,
    UserUpdateDo
};