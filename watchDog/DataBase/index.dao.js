const config = require('../config/config.json');

/** Return Database Type Dao*/
const Dao = () => {
    if (config.DataBaseType.mysql) {
        return MysqlDao = require('./Mysql/index.dao');
    } else if (config.DataBaseType.mongodb) {
        return MongoDBDao = require('./MongoDB/index.dao');
    } else {
        throw new Error("Setting Config file");
    }
};

module.exports = Dao;