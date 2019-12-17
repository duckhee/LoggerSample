/** Device Control router */
const express = require('express');
const router = express.Router();
/** Device Map Router */
const MapRouter = require('./Map/map.router');

/** DashBoard Router */
const DashBoardRouter = require('./DashBoard/dashboard.router');


router.get('/', (req, res, next) => {

});

router.use('/*', (req, res, next) => {
    console.log('device router main get middle ware');
    next();
});

module.exports = (app) => {
    app.use('/Device', router);

    /** DashBoard Router */
    app.use('/Device/DashBoard', DashBoardRouter);

};