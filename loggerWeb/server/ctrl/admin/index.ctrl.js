/** User Dao */
const UDao = require('../../dao/admin/Users/index.dao');
const AdminUserDao = UDao();

/** Admin Get Device Info  */
const Dao = require('../../dao/admin/Device/index.dao');
const DeviceDao = Dao();

/** Login Check */
const Logind = (req, res, next) => {
    console.log("Admin Level Check");
    if (!req.session.UserLogin) {
        return res.redirect('/admin/user/login');
    }
    console.log("User Info : ", req.session.UserLogin);
    if (Number(req.session.UserLogin.level) < 3) {
        return next();
    }
    return res.redirect('/beta');
};

/** Admin Main Page Check Login */
const MainPage = (req, res, next) => {
    console.log('Admin Index Page');
    /** TODO need to session Info */
    const LoginInfo = req.session.UserLogin;
    if (LoginInfo) {
        //AdminUserDao.UserAllDeviceLatLan().then(DeviceInfo => {
        DeviceDao.GPSAllDevice().then(DeviceInfo => {

            return res.render('admin/index', {
                login: LoginInfo,
                DeviceInfo: DeviceInfo,
                title: 'Admin Main',
                message: req.flash('LoginMessage')
            });
        }).catch(err => {
            console.log("Admin Main Page Get Device Info Error code ::: ", err.code);
            console.log("Admin Main Page Get Device Info Error ::: ", err);
            return res.render('admin/index', {
                login: LoginInfo,
                DeviceInfo: null,
                title: 'Admin Main',
                message: req.flash('LoginMessage')
            });
        });

    } else {
        //TODO Delete Data just Test
        var TestingLoginData = {
            userId: 'test',
            name: 'tester'
        };
        AdminUserDao.UserAllDeviceLatLan().then(result => {

        }).catch(err => {

        });
        return res.render('admin/index', {
            login: TestingLoginData,
            title: 'Admin Main Page',
            DeviceInfo: null,
            message: req.flash('LoginMessage')
        });


        //res.redirect('/admin/login');
    }
};


module.exports = {
    MainPage
};