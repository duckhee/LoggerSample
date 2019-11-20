/** Admin Main Page Check Login */
const MainPage = (req, res, next) => {
    console.log('Admin Index Page');
    /** TODO need to session Info */
    const LoginInfo = req.session.userInfo;
    if (LoginInfo) {
        res.render('admin/index', {
            login: LoginInfo,
            title: 'Admin Main'
        });
    } else {
        //TODO Delete Data just Test
        var TestingLoginData = {
            userId: 'test',
            name: 'tester'
        };
        res.render('admin/index', {
            login: TestingLoginData,
            title: 'Admin Main Page'
        });
        //res.redirect('/admin/login');
    }
};


module.exports = {
    MainPage
};