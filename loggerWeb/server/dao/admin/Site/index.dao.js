/** config DataBase */
const configDatabase = require('../../../../config/config.json');

const SiteDao = () => {
    if (configDatabase.database === 'mysql') {
        const MysqlSiteDao = require('./mysql/site.dao');
        return MysqlSiteDao;
    } else if (configDatabase.database === 'mongodb') {
        const MongoDBSiteDao = require('./mongoDB/site.dao');
        return MongoDBSiteDao;
    } else {
        throw new Error("Setting Database config file ");
    }
};

module.exports = SiteDao;