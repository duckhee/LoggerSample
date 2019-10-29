/** Admin User Page */
const MainPage = (req, res, next) => {
    res.redirect('/admin/user/profile', {});
};

/** Admin User Login Page */
const LoginPage = (req, res, next) => {
    //TODO Session Check
    res.render('admin/Users/LoginPage');
};

/** Admin User Login Do */
const LoginDo = (req, res, next) => {
    //TODO Session Check
    const InputEmail = req.body.email || req.query.email || req.param.email || req.params.email;
    const InputPassword = req.body.password || req.query.password || req.param.password || req.params.password;

    console.log('Input Email : ' + InputEmail + ', Input Password : ' + InputPassword);
};

/** Admin User LogOut Do */
const LogOutDo = (req, res, next) => {
    //TODO Session Check
    const SessionInfo = req.session.userInfo;
    if (SessionInfo) {
        req.session.destroy(() => {
            res.session;
            console.log('session delete');
            res.clearCookie('secreteKeyWon');
            res.redirect('/');
        });
    } else {

    }
};

/** Admin User Profile Page */
const ProfilePage = (req, res, next) => {

};

/** Admin User Modify Page */
const ModifyPage = (req, res, next) => {

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