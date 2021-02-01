/** config DataBase */
const configDatabase = require('../../../../config/config.json');

/** Sample Get Dao */
const IndexDao = () => {
    if (configDatabase.mysql) {
        console.log("Sample Mysql Setting");
        return MysqlIndexDao = require('./mysql/index.dao');
    } else if (configDatabase.mongoDB) {
        console.log("Sample MongoDB Setting");
        return MongoDBIndexDao = require('./mongoDB/index.dao');
    } else {
        throw new Error("Setting database config file");
    }
};

module.exports = IndexDao;