/** Index Model */
const models = require('../../../../../DataBase/models/index');
/** Device Model */
const device = require('../../../../../DataBase/models/device');
/** Ecolog Model */
const ecolog = require('../../../../../DataBase/models/ecolog');
/** Ecolog Column Model */
const ecologColumn = require('../../../../../DataBase/models/ecologcolumn');

/** ApexChart Data Type Make */
const ApexChartData = () => {

};

/** Graph data get Module */
const graph = (no, options) => {
    console.log("Search Options : ", options);
    var option = {};
    /** select Options */
    if (options.start) {
        if (options.end) {
            option = {
                createdAt: {
                    [models.Sequelize.Op.between]: [options.start, options.end]
                }
            };
        }
    }

    return new Promise((resolve, reject) => {
        models.ecolog.findOne({
            where: {
                DeviceIdx: no
            },
            attributes: ['id'],
            include: [{
                model: models.ecologColumn,
                attributes: ['ecologName', 'ecologData', 'createdAt'],
                where: option
            }]
        }).then(result => {
            if (!result) {
                return resolve(0);
            }
            return resolve(result);
        }).catch(err => {
            console.log("Beta Ecolog Graph Get Data Error Code ::: ", err.code);
            console.log("Beta Ecolog Graph Get Data Error ::: ", err);
            return reject(err);
        });
    });
};

/** Download data get Module */
const download = () => {
    return new Promise((resolve, reject) => {

    });
};

module.exports = {
    graph,
    download
};