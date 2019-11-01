/** Device Control router */
const express = require('express');
const router = express.Router();
/** Device Map Router */
const MapRouter = require('./Map/map.router');
/** Logger Router */
const LoggerRouter = require('./Logger/logger.router');
/** DashBoard Router */
const DashBoardRouter = require('./DashBoard/dashboard.router');
/** DataReport Router */
const DataReportRouter = require('./DataReport/datareport.router');

router.get('/', (req, res, next) => {

});

router.use('/*', (req, res, next) => {
    console.log('device router main get middle ware');
    next();
});

module.exports = (app) => {
    app.use('/Device', router);
    /** Logger Router */
    app.use('/Device/logger', LoggerRouter);
    /** Map Router */
    app.use('/Device/Map', MapRouter);
    /** DashBoard Router */
    app.use('/Device/DashBoard', DashBoardRouter);
    /** DataReport Router */
    app.use('/Device/DataReport', DataReportRouter);
};