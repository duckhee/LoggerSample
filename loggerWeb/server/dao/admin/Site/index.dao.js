/** config DataBase */
const configDatabase = require('../../../../config/config.json');

const SiteDao = () => {
    if (configDatabase.mysql) {
        console.log("Admin Site Mysql Setting");
        const MysqlSiteDao = require('./mysql/site.dao');
        return MysqlSiteDao;
    } else if (configDatabase.mongoDB) {
        console.log("Admin Site mongoDB Setting");
        const MongoDBSiteDao = require('./mongoDB/site.dao');
        return MongoDBSiteDao;
    } else {
        throw new Error("Setting Database config file ");
    }
};

module.exports = SiteDao;