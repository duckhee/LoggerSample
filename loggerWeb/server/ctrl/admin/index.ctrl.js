/** Admin Main Page Check Login */
const MainPage = (req, res, next) => {
    console.log('Admin Index Page');
    /** TODO need to session Info */
    const LoginInfo = req.session.UserLogin;
    if (LoginInfo) {
        return res.render('admin/index', {
            login: LoginInfo,
            title: 'Admin Main',
            message: req.flash('LoginMessage')
        });
    } else {
        //TODO Delete Data just Test
        var TestingLoginData = {
            userId: 'test',
            name: 'tester'
        };
        res.render('admin/index', {
            login: TestingLoginData,
            title: 'Admin Main Page',
            message: req.flash('LoginMessage')
        });
        //res.redirect('/admin/login');
    }
};


module.exports = {
    MainPage
};