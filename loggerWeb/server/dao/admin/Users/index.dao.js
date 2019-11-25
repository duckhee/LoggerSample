/** config Database */
const configDatabase = require('../../../../config/config.json');



/** Admin get User Dao */
const UserDao = () => {
    if (configDatabase.database === "mysql") {
        console.log('mysql db setting');
        const MysqlUserDao = require('./mysql/users.dao');
        return MysqlUserDao;
    } else if (configDatabase.database === 'mongodb') {
        console.log('mongo db setting');
        const MongoDBUserDao = require('./mongoDB/users.dao');
        return MongoDBUserDao;
    } else {
        throw new Error("Setting database config file");
    }
};

module.exports = UserDao();