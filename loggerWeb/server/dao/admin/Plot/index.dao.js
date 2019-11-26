const configDatabase = require('../../../../config/config.json');

const PlotDao = () => {
    if (configDatabase.database === 'mysql') {
        const MysqlPlotDao = require('./mysql/plot.dao');
        return MysqlPlotDao;
    } else if (configDatabase.database === 'mongodb') {
        const MongoDBPlotDao = require('./mongoDB/plot.dao');
        return MongoDBPlotDao;
    }
};

module.exports = PlotDao;