/** Index Model */
const models = require('../../../../../DataBase/models/index');
/** Device Model */
const device = require('../../../../../DataBase/models/device');
/** Ecolog Model */
const ecolog = require('../../../../../DataBase/models/ecolog');
/** Ecolog Column Model */
const ecologColumn = require('../../../../../DataBase/models/ecologcolumn');

/** ApexChart Data Type Make */
const ApexChartData = (data) => {
    //console.log("Make Ecolog Chart Data : ", data);
    return new Promise((resolve, reject) => {
        let _return = [];
        if (data.length == 0) {
            console.log("Not Data");
            return reject(null);
        }
        let _returnValue1 = {};
        let _returnValue2 = {};
        let _returnValue3 = {};
        let _returnValue4 = {};
        let _returnValue5 = {};
        let _returnValue6 = {};
        let data1 = [];
        let data2 = [];
        let data3 = [];
        let data4 = [];
        let data5 = [];
        let data6 = [];

        for (var i = 0; i < data.length; i++) {
            //            _SetJson.data = [new Date(data[i].createdAt), data[i].ecologData];
            if (data[i].ecologName == "0001") {
                _returnValue1.name = "깊이(M)";
                //_returnValue1.data.push([new Date(data[i].createdAt), data[i].ecologData]);
                let Dates = new Date(data[i].createdAt);
                let GetHours = Dates.getHours() + 9;
                Dates.setHours(GetHours);
                data1.push([Dates, data[i].ecologData]);
            } else if (data[i].ecologName == "0002") {
                _returnValue2.name = "온도(℃)";
                let Dates = new Date(data[i].createdAt);
                let GetHours = Dates.getHours() + 9;
                Dates.setHours(GetHours);
                data2.push([Dates, data[i].ecologData]);
                //_returnValue2.data.push([new Date(data[i].createdAt), data[i].ecologData]);
            } else if (data[i].ecologName == "0003") {
                _returnValue3.name = "EC(ms/cm)";
                let Dates = new Date(data[i].createdAt);
                let GetHours = Dates.getHours() + 9;
                Dates.setHours(GetHours);
                data3.push([Dates, data[i].ecologData]);
                //_returnValue3.data.push([new Date(data[i].createdAt), data[i].ecologData]);
            } else if (data[i].ecologName == "0004") {
                _returnValue4.name = "염분";
                let Dates = new Date(data[i].createdAt);
                let GetHours = Dates.getHours() + 9;
                Dates.setHours(GetHours);
                data4.push([Dates, data[i].ecologData]);
                //_returnValue4.data.push([new Date(data[i].createdAt), data[i].ecologData]);
            } else if (data[i].ecologName == "0005") {
                _returnValue5.name = "TDS(mg/L)";
                let Dates = new Date(data[i].createdAt);
                let GetHours = Dates.getHours() + 9;
                Dates.setHours(GetHours);
                data5.push([Dates, data[i].ecologData]);
                //_returnValue5.data.push([new Date(data[i].createdAt), data[i].ecologData]);
            } else if (data[i].ecologName == "0006") {
                _returnValue6.name = "전원(V)";
                let Dates = new Date(data[i].createdAt);
                let GetHours = Dates.getHours() + 9;
                Dates.setHours(GetHours);
                data6.push([Dates, data[i].ecologData]);
                //_returnValue6.data.push([new Date(data[i].createdAt), data[i].ecologData]);
            }
            //console.log("SET JSON : ", _SetJson);
        }
        _returnValue1.data = data1;
        _returnValue2.data = data2;
        _returnValue3.data = data3;
        _returnValue4.data = data4;
        _returnValue5.data = data5;
        _returnValue6.data = data6;
        console.log("value 1 : " + _returnValue1.data.length);
        console.log("value 2 : " + _returnValue2.data.length);
        console.log("value 3 : " + _returnValue3.data.length);
        console.log("value 4 : " + _returnValue4.data.length);
        console.log("value 5 : " + _returnValue5.data.length);
        console.log("value 6 : " + _returnValue6.data.length);
        if (_returnValue1.data.length !== 0) {
            _return.push(_returnValue1);
        }
        if (_returnValue2.data.length !== 0) {
            _return.push(_returnValue2);
        }
        if (_returnValue3.data.length !== 0) {
            _return.push(_returnValue3);
        }
        if (_returnValue4.data.length !== 0) {
            _return.push(_returnValue4);
        }
        if (_returnValue5.data.length !== 0) {
            _return.push(_returnValue5);
        }
        if (_returnValue6.data.length !== 0) {
            _return.push(_returnValue6);
        }

        return resolve(_return);
    });
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
                where: option,
            }]
        }).then(result => {
            if (!result) {
                return resolve(0);
            }
            ApexChartData(result.dataValues.ecologColumns).then(results => {
                return resolve(results);
            }).catch(err => {
                console.log('Beta Ecolog Graph Data Make Error Code ::: ', err.code);
                console.log('Beta Ecolog Graph Data Make Error ::: ', err);
                return reject(err);
            });
        }).catch(err => {
            console.log("Beta Ecolog Graph Get Data Error Code ::: ", err.code);
            console.log("Beta Ecolog Graph Get Data Error ::: ", err);
            return reject(err);
        });
    });
};

/** Download data get Module */
const download = (no, options) => {
    return new Promise((resolve, reject) => {
        models.ecolog.findOne({
            where: {
                DeviceIdx: no
            },
            attributes: ['id'],
            include: [{
                model: models.ecologColumn,
                attribute: ['ecologName', 'ecologData', 'createdAt'],
                where: options
            }, {
                model: models.device,
                attributes: ['id', 'name']
            }]
        }).then(result => {
            if (!result) {
                return resolve(null);
            }
            return resolve(result);
        }).catch(err => {
            console.log("Beta Ecolog Download Data Error Code ::: ", err.code);
            console.log("Beta Ecolog Download Data Error ::: ", err);
            return reject(err);
        });
    });
};

module.exports = {
    graph,
    download
};
