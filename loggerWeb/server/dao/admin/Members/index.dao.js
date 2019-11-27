/** config Database */
const configDatabase = require('../../../../config/config.json');

/** Admin get Member Dao */
const MemberDao = () => {
    if (configDatabase.database === 'mysql') {
        console.log('Admin Member Mysql Setting');
        const MysqlMemberDao = require('./mysql/members.dao');

        return MysqlMemberDao;
    } else if (configDatabase.database === 'mongodb') {
        console.log('Admin Member mongoDB Setting');
        const MongoDBMemberDao = require('./mongoDB/members.dao');

        return MongoDBMemberDao;
    } else {
        throw new Error("Setting database config file");
    }
};


module.exports = MemberDao;