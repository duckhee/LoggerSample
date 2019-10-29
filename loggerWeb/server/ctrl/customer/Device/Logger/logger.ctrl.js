/** Move Logger Main Page */
const LoggerMainPage = (req, res, next) => {
    //TODO Session Check
    res.render('CustomerPages/LoggerPages/index', {});
};

/** Get Logger Info and Show Graph */
const LoggerGraphPage = (req, res, next) => {

};


module.exports = {
    LoggerMainPage
};