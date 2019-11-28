/** config Database */
const configDatabase = require('../../../../config/config.json');

/** Admin Get Device */
const DeviceDao = () => {
    if (configDatabase.mysql) {
        console.log('Admin Device Mysql Setting');
        return MysqlDeviceDao = require('./mysql/device.dao');
    } else if (configDatabase.mongoDB) {
        console.log('Admin Device mongoDB Setting');
        return MongoDBDeviceDao = require('./mongoDB/device.dao');
    } else {
        throw new Error("Setting database config file");
    }
};

module.exports = DeviceDao;