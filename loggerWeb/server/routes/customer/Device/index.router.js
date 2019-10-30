/** Device Control router */
const express = require('express');
const router = express.Router();
/** Device Map Router */
const MapRouter = require('./Map/map.router');
/** Logger Router */
const LoggerRouter = require('./Logger/logger.router');

router.get('/', (req, res, next) => {

});

module.exports = (app) => {
    app.use('/Device', router);
    /** Logger Router */
    app.use('/Device/logger', LoggerRouter);
    /** Map Router */
    app.use('/DeviceMap', MapRouter);
};