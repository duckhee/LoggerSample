/** Customer User Page */
const MainPage = (req, res, next) => {
    res.redirect('/login');
};
/** Customer User Login Page */
const LoginPage = (req, res, next) => {
    //TODO session Check need
    res.render('CustomerPages/Users/Login/LoginPage');
};
/** Customer User Login Do */
const LoginDo = (req, res, next) => {

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