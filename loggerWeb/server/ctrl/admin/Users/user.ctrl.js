const Dao = require('../../../dao/admin/Users/index.dao');
const AdminUserDao = Dao();

//TODO Delete Data just Test
var TestingLoginData = {
    userId: 'test',
    name: 'tester'
};

/** Admin User Page */
const MainPage = (req, res, next) => {
    /** Admin User redirect Profile Page */
    res.redirect('/admin/User/profile');
};

/** Admin User Login Page */
const LoginPage = (req, res, next) => {
    //TODO Session Check
    res.render('admin/Users/LoginPage', {
        _csrf: req.csrfToken(),
        message: req.flash('LoginMessage')
    });
};

/** Admin User Login Do */
const LoginDo = (req, res, next) => {
    //TODO Session Check
    const InputEmail = req.body.email || req.query.email || req.param.email || req.params.email || "";
    const InputPassword = req.body.password || req.query.password || req.param.password || req.params.password || "";
    if (InputEmail === "") {
        console.log('not input email : ');
        console.log('flash message : ', req.flash('LoginMessage', 'not Email password'));
        return res.redirect('/admin/User/login');
    }
    if (InputPassword === "") {
        console.log('not input password : ');
        console.log('flash message : ', req.flash('LoginMessage', 'not Input password'));
        return res.redirect('/admin/User/login');
    }

    let LoginJson = {
        email: InputEmail,
        password: InputPassword
    };

    AdminUserDao.LoginUser(LoginJson).then(result => {
        if (result) {
            req.session.UserLogin = {
                name: result.UserName,
                email: result.UserEmail,
                level: result.UserLevel,
            };
            console.log('result User Level : ', Number(result.UserLevel));
            if (Number(result.UserLevel) < 3) {
                console.log('admin user : ', Number(result.UserLevel));
                return res.redirect('/admin');
            } else {
                /** flash message */
                req.flash('LoginMessage', 'not admin level');
                return res.redirect('/');
            }
        } else {
            console.log('not match password');
            /** flash message */
            req.flash('LoginMessage', 'not match password');
            return res.redirect('/admin/User/login');
        }
    }).catch(err => {
        return res.redirect('/admin/User/login');
    });

};

/** Admin User LogOut Do */
const LogOutDo = (req, res, next) => {
    //TODO Session Check
    const SessionInfo = req.session.UserLogin;
    if (SessionInfo) {
        req.session.destroy(() => {
            console.log('session delete', res.session.UserLogin);
            res.clearCookie('secreteKeyWon');
            res.redirect('/');
        });
    } else {

    }
};

/** Admin User Profile Page */
const ProfilePage = (req, res, next) => {
    if (req.session.userInfo && (req.session.UserLogin.level < 3)) {
        return res.render('admin/Users/ProfilePage', {
            login: TestingLoginData,
            title: 'Admin Profile Page',
            message: req.flash('LoginMessage')
        });
    } else {
        return res.redirect('/admin/User/login');
    }
};

/** Admin User Modify Page */
const ModifyPage = (req, res, next) => {
    res.render('admin/Users/ModifyPage', {
        login: TestingLoginData,
        title: 'Admin Modify Page'
    });
};

/** Admin User Modify Do */
const ModifyDo = (req, res, next) => {

};

module.exports = {
    MainPage,
    LoginPage,
    LoginDo,
    LogOutDo,
    ProfilePage,
    ModifyPage,
    ModifyDo
};