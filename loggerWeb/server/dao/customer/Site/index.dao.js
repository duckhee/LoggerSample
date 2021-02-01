/** config Database */
const configDatabase = require('../../../../config/config.json');

/** Customer Get Dao */
const SiteDao = () => {
    if (configDatabase.mysql) {
        console.log('Customer Site Mysql Setting');
        return MysqlSiteDao = require('./mysql/site.dao');
    } else if (configDatabase.mongoDB) {
        console.log('Customer Site mongoDB Setting');
        return mongoDBSiteDao = require('./mongoDB/site.dao');
    } else {
        throw new Error("Setting database config file");
    }
};

module.exports = SiteDao;