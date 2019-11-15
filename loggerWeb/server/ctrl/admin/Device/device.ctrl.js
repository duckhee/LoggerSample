const LoggerCtrl = require('./logger/logger.ctrl');

/** Device Type Container */
let DeviceType = {};
/** Logger Type Add */
DeviceType.Logger = LoggerCtrl;

/** Export */
module.exports = DeviceType;