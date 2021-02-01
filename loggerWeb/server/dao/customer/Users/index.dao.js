/** config DataBase */
const configDatabase = require('../../../../config/config.json');

/** Customer Get Dao */
const UserDao = () => {
    if (configDatabase.mysql) {
        console.log('Customer Device Mysql Setting');
        return MysqlUserDao = require('./mysql/user.dao');
    } else if (configDatabase.mongoDB) {
        console.log('Customer Device mongoDB Setting');
        return MongoDBUserDao = require('./mongoDB/user.dao');
    } else {
        throw new Error("Setting database config file");
    }
};


module.exports = UserDao;