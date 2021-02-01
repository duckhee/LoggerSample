/** config Database */
const configDatabase = require('../../../../config/config.json');



/** Admin get User Dao */
const UserDao = () => {
    if (configDatabase.mysql) {
        console.log('Admin User Mysql Setting');
        const MysqlUserDao = require('./mysql/users.dao');

        return MysqlUserDao;
    } else if (configDatabase.mongoDB) {
        console.log('Admin User mongoDB Setting');
        const MongoDBUserDao = require('./mongoDB/users.dao');

        return MongoDBUserDao;
    } else {
        throw new Error("Setting database config file");
    }
};

module.exports = UserDao;