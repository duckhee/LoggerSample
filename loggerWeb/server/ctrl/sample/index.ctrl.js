const MainPage = (req, res, next) => {
    res.redirect('/sample/map');
};

/** Main List  */
const MapPage = (req, res, next) => {
    res.render('Sample/Home/map');
};

/** Detail Page */
const DetailPage = (req, res, next) => {
    res.render('Sample/Home/detail');
};

/** Get current Camera Set */
const CameraViewPage = (req, res, next) => {

};

module.exports = {
    MainPage,
    MapPage,
    DetailPage
};