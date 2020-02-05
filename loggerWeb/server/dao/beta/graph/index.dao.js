const configDatabase = require('../../../../config/config.json');

const IndexDao = () => {
    if (configDatabase.mysql) {
        console.log("Sample Mysql Setting");
        return MysqlIndexDao = require('./mysql/index.dao');
    } else if (configDatabase.mongoDB) {
        console.log("Sample MongoDB Setting");
        return MongoDBIndexDao = require('./mongoDB/index.dao');
    } else {
        throw new Error("Setting Database Config file");
    }
};

module.exports = IndexDao;