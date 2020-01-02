const MainPage = (req, res, next) => {
    res.render('Sample/Home/index');
};

/** Main List  */
const ListPage = (req, res, next) => {
    res.render('Sample/Home/list');
};

module.exports = {
    MainPage,
    ListPage
};