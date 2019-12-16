const Dao = require('../../../dao/customer/Users/index.dao');
const UserDao = Dao();


/** Customer User Page */
const MainPage = (req, res, next) => {
    res.redirect('/login');
};
/** Customer User Login Page */
const LoginPage = (req, res, next) => {
    //TODO session Check need
    res.render('CustomerPages/Users/Login/LoginPage', {
        _csrf: req.csrfToken(),
        msg: req.flash('loginMsg')
    });
};
/** Customer User Login Do */
const LoginDo = (req, res, next) => {
    const Id = req.body.userId || req.query.userId || "";
    const pw = req.body.userPw || req.query.userPw || "";
    if (Id === "") {
        return res.redirect('/login');
    }
    if (pw === "") {
        return res.redirect('/login');
    }
    console.log("id : ", Id + ", pw : " + pw);
    let LoginJson = {
        email: Id,
        password: pw
    };

    UserDao.LoginUser(LoginJson).then(result => {
        if (result !== false) {

            return res.json(result);
        } else {
            req.flash('loginMsg', 'Not Match Email or Password');
            return res.redirect('/login');
        }
    }).catch(err => {
        console.log("Customer Login Page Ctrl Error code ::: ", err.code);
        console.log("Customer Login Page Ctrl Error ::: ", err);
        return res.redirect("/login");
    });

};
/** Customer User LogOut Do */
const LogOutDo = (req, res, next) => {

};
/** Customer User Profile Page */
const ProfilePage = (req, res, next) => {

};
/** Customer User Modify Page */
const ModifyPage = (req, res, next) => {

};
/** Customer User Modify Do */
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