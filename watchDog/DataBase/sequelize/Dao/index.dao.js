const configDatabase = require("../../../config/config.json");


const _InitDao = () => {
    if (configDatabase.DataBaseType.mysql) {
        return MysqlDao = require('./Mysql/index.dao');
    } else if (configDatabase.DataBaseType.mongodb) {
        return MongoDBDao = require('./MongoDB/index.dao');
    } else {
        throw new Error("SETTING DATABASE CONFIG FILE");
    }
};


module.exports = _InitDao;