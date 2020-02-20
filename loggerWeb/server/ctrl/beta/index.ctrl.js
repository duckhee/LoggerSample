/** User Dao */
const _UserDao = require('../../dao/beta/user/index.dao');
const UserDao = _UserDao();
/** Graph Dao */
const Device = require('../../dao/beta/graph/graph.interface');
const graph = Device.graphSelector();
/** Download Dao */
const _Download = require('../../dao/beta/download/download.interface');
const Download = _Download.DownloadSelector();

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
            PlotInfo: result.sites.plots,
            _csrf: req.csrfToken(),
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
            _csrf: req.csrfToken(),
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
        //res.clearCookie('secreteKeyWon');
        return res.redirect('/beta/login');
    });
    return res.redirect('/beta/login');
};

/** Make Chart Graph Data Json Type */
const GraphDataJson = (req, res, next) => {
    const StartDate = req.body.start || req.query.start || req.params.start || req.param.start || "";
    const EndDate = req.body.end || req.query.end || req.params.end || req.param.end || "";
    const no = req.body.no || req.query.no || req.params.no || req.param.no || "";
    console.log("Device Id : " + no + ", Start Date : " + StartDate + ", End Date : " + EndDate + ", body : " + req.body);
    /** Device Id Null */
    if (no == "") {
        let msg = {
            msg: 'Not Device ...'
        };
        return res.json(msg);
    }
    let options = {};

    if (new Date(StartDate) !== "Invalid Date") {
        if (new Date(EndDate) !== "Invalid Date") {
            options.start = StartDate;
            options.end = EndDate;
        }
    } else {
        let start = new Date();
        options.start = start.setDate(start.getDate() - 1);

        options.end = Date.now();
    }

    Device.GetDeviceType(no).then(resultDevice => {
        if (!resultDevice) {
            console.log('result Type NUll: ', resultDevice);
            return res.json({ error: "null" });
        }
        console.log('device Type', resultDevice.dataValues.deviceType);
        console.log(' graph : ', options);

        graph[resultDevice.dataValues.deviceType](no, options).then(result => {
            if (result == 0) {
                console.log("Device Data : ", result);
                return res.json({ error: "null" });
            }
            return res.json(result);
        }).catch(err => {
            console.log('Get Error : ', err);
            return res.json({ error: "null" });
        });
        //return res.json(result);
    }).catch(err => {
        console.log("get Device Type Error ::: ", err);
        return res.json({ error: err.code });
    });
    //return res.json(0);
};

/** Download Device Data CSV */
const DownloadCSV = (req, res, next) => {
    const StartDate = req.body.start || req.query.start || req.params.start || req.param.start || "";
    const EndDate = req.body.end || req.query.end || req.params.end || req.param.end || "";
    const no = req.body.no || req.query.no || req.params.no || req.param.no || "";
    console.log("Start Date : " + StartDate + ", End Date : " + EndDate + ", Device No : " + no);
    let options = {};

    if (no == "") {
        let err = new Error("Not Select Device");
        return next(err);
    }
    if (new Date(StartDate) !== "Invalid Date") {
        if (new Date(EndDate) !== "Invalid Date") {
            options.start = StartDate;
            options.end = EndDate;
        }
    }
    Device.GetDeviceType(no).then(Device => {
        Download[Device.dataValues.deviceType](no).then(result => {
            if (!result) {
                console.log("Download Logic Error");
                return res.redirect('/beta/detail');
            }
            /** excel4node download Function */
            else {
                console.log("Download Logic Start");
                return result.write("download.csv", res);
                //return result;
            }
        }).catch(err => {
            console.log("Download Error Code ::: ", err.code);
            console.log("Download Error ::: ", err);
            return res.redirect('/beta/detail');
        });
    }).catch(err => {
        console.log("Download Error Code ::: ", err.code);
        console.log("Download Error ::: ", err);
        return res.redirect('/beta/detail');
    });
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