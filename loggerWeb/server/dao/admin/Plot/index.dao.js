const configDatabase = require('../../../../config/config.json');

const PlotDao = () => {
    if (configDatabase.database === 'mysql') {
        console.log('Admin Plot Mysql Setting')
        const MysqlPlotDao = require('./mysql/plot.dao');
        return MysqlPlotDao;
    } else if (configDatabase.database === 'mongodb') {
        console.log("Admin Plot mongoDB Setting");
        const MongoDBPlotDao = require('./mongoDB/plot.dao');
        return MongoDBPlotDao;
    }
};

module.exports = PlotDao;