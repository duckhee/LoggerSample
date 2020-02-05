/** User Dao */
const _UserDao = require('../../dao/beta/user/index.dao');
const UserDao = _UserDao();

/** Login Check Middle ware */
const LoginChecker = (req, res, next) => {
    if (!req.session.UserLogin) {
        return res.redirect('/beta/login');
    }
    return next();
};

/** Redirect Login Page */
const MainPage = (req, res, next) => {
    console.log("Redirect Login page ");
    return res.redirect('/beta/login');
};

/** Map Page Show Device Map */
const MapPage = (req, res, next) => {
    console.log("Map Page");
    UserDao.SampleDao(req.session.UserLogin.email).then(result => {
        console.log('result : ', result);
        return res.render('Sample/beta/map', {
            UserInfo: result,
            SiteInfo: result.sites,
            PlotInfo: result.sites.plots
        });
    }).catch(err => {
        console.log("Get Sample Error : ", err);
        throw new Error(err);
    });
};

/** Show Graph Detail Download */
const DetailPage = (req, res, next) => {
    console.log("Detail Page");
    UserDao.SampleDao(req.session.UserLogin.email).then(result => {
        return res.render('Sample/beta/detail', {
            UserInfo: result,
        });
    }).catch(err => {
        console.log("Get Sample Error : ", err);
        throw new Error(err);
    });
};

/** Login User Page */
const LoginPage = (req, res, next) => {
    console.log('Session Check : ', req.session.UserLogin);
    if (req.session.UserLogin) {
        return res.redirect('/beta/map');
    }
    return res.render('Sample/beta/login', {
        _csrf: req.csrfToken(),
        msg: req.flash('LoginMsg')
    });
};

/** Login User Do */
const LoginDo = (req, res, next) => {
    const UserEmail = req.body.userId || req.query.userId || "";
    const UserPassword = req.body.userPw || req.query.userPw || "";
    console.log('User Email : ' + UserEmail + ", User Password : " + UserPassword);
    if (UserEmail == "") {
        console.log("not User Email");
        return res.redirect('/beta/login');
    }
    if (UserPassword == "") {
        console.log("not User password");
        return res.redirect('/beta/login');
    }
    let UserVO = {
        Email: UserEmail,
        password: UserPassword
    };
    UserDao.LoginDao(UserVO).then(result => {
        console.log('result : ', result);
        if (result) {
            req.session.UserLogin = {
                name: result.UserName,
                email: result.UserEmail,
                level: result.UserLevel,
            }
            return res.redirect('/beta/map');
        } else {
            req.flash("LoginMsg", "비밀번호가 일치 하지 않습니다.");
            return res.redirect('/beta/login');
        }
    }).catch(err => {
        console.log("Beta Login Do Error code ::: ", err.code);
        console.log("Beta Login Do Error ::: ", err);
        return res.redirect('/beta/login');
    });
};

/** Log Out User */
const LogOut = (req, res, next) => {
    console.log("Beta User Log Out ...");
    req.session.destroy(() => {
        console.log("session Delete Beta User Info");
        res.clearCookie('secreteKeyWon');
        return res.redirect('/beta/login');
    });
    return res.redirect('/beta/login');
};

/** Make Chart Graph Data Json Type */
const GraphDataJson = (req, res, next) => {
    const StartDate = req.body.start || req.query.start || req.params.start || req.param.start || "";
    const EndDate = req.body.end || req.query.end || req.params.end || req.param.end || "";
    return res.json(0);
};

/** Download Device Data CSV */
const DownloadCSV = (req, res, next) => {
    return res.json(0);
};



module.exports = {
    LoginChecker,
    MainPage,
    MapPage,
    DetailPage,
    LoginPage,
    LoginDo,
    LogOut,
    GraphDataJson,
    DownloadCSV
};