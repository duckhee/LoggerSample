/** Login check and show different Page */
const MainPage = (req, res, next) => {
    let LoginInfo = req.session.userInfo;
    if (LoginInfo) {
        //TODO
        res.render('CustomerPages/afterIndex', {

        });
    } else {
        res.render('CustomerPages/index');
    }
};

/** Testing Page */
const LoginDone = (req, res, next) => {
    res.render('CustomerPages/afterIndex', {});
};

module.exports = {
    MainPage,
    //TODO delete
    LoginDone
};