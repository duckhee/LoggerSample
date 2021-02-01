const _SampleDao = require('../../dao/Sample/index.dao');
const SampleDao = _SampleDao();

const MainPage = (req, res, next) => {
    res.redirect('/sample/map');
};

/** Main List  */
const MapPage = (req, res, next) => {
    SampleDao.SampleDao().then(result => {
        console.log("SAMPLE DATA ::: ", result.sites[0].plots[0].devices);
        return res.render('Sample/Home/map', {
            UserInfo: result,
            SiteInfo: result.sites,
            PlotInfo: 1 //result.site.plots
        });
    }).catch(err => {
        console.log("SAMPLE DATA ERROR CODE ::: ", err.code);
        console.log("SAMPLE DATA ERROR ::: ", err);
        return res.render('Sample/Home/map');
    });
};

/** Detail Page */
const DetailPage = (req, res, next) => {
    SampleDao.SampleDao().then(result => {
        return res.render('Sample/Home/detail', {
            UserInfo: result,
        });
    }).catch(err => {
        console.log("SAMPLE DATA ERROR CODE ::: ", err.code);
        console.log("SAMPLE DATA ERROR ::: ", err);
        return res.render('Sample/Home/detail');
    });

};

/** Get current Camera Set */
const CameraViewPage = (req, res, next) => {

};

module.exports = {
    MainPage,
    MapPage,
    DetailPage
};