/** get Support Device */
const ConfigFile = require('../../../../../../../config/config.json');
/** Sequelize Model */
const models = require('../../../../../../DataBase/models/index');
/** Device Model */
const device = require('../../../../../../DataBase/models/device');
/** Ecolog Model */
const ecolog = require("../../../../../../DataBase/models/ecolog");
/** Ecolog Data Model */
const ecologColumn = require('../../../../../../DataBase/models/ecologcolumn');

const MakeEcologChart = (data) => {
    //console.log("Make Ecolog Chart Data : ", data);
    return new Promise((resolve, reject) => {
        console.log('test Ecolog Chart : ', data);
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
                data1.push([new Date(data[i].createdAt), data[i].ecologData]);
            } else if (data[i].ecologName == "0002") {
                _returnValue2.name = "온도(℃)";
                data2.push([new Date(data[i].createdAt), data[i].ecologData]);
                //_returnValue2.data.push([new Date(data[i].createdAt), data[i].ecologData]);
            } else if (data[i].ecologName == "0003") {
                _returnValue3.name = "EC(ms/cm)";
                data3.push([new Date(data[i].createdAt), data[i].ecologData]);
                //_returnValue3.data.push([new Date(data[i].createdAt), data[i].ecologData]);
            } else if (data[i].ecologName == "0004") {
                _returnValue4.name = "염분";
                data4.push([new Date(data[i].createdAt), data[i].ecologData]);
                //_returnValue4.data.push([new Date(data[i].createdAt), data[i].ecologData]);
            } else if (data[i].ecologName == "0005") {
                _returnValue5.name = "TDS(mg/L)";
                data5.push([new Date(data[i].createdAt), data[i].ecologData]);
                //_returnValue5.data.push([new Date(data[i].createdAt), data[i].ecologData]);
            } else if (data[i].ecologName == "0006") {
                _returnValue6.name = "전원(V)";
                data6.push([new Date(data[i].createdAt), data[i].ecologData]);
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

        _return.push(_returnValue1);
        _return.push(_returnValue2);
        _return.push(_returnValue3);
        _return.push(_returnValue4);


        return resolve(_return);



    });
};
/** Ecolog Graph */
const Graph = (no) => {
    return new Promise((resolve, reject) => {
        models.device.findOne({
            where: {
                id: no
            },
            attributes: ['name', 'DeviceType'],
            include: [{
                model: models.ecolog,
                attributes: ['FileFormat'],
                include: [{
                    model: models.ecologColumn,
                    attributes: ['ecologName', 'ecologData', 'createdAt']
                }]
            }]
        }).then(result => {
            return resolve(result);
            //TODO Add
            /*
            MakeEcologChart(result.dataValues.ecolog.ecologColumns).then(results => {
                return resolve(results);
            }).catch(err => {
                return reject(err);
            });
            */
        }).catch(err => {
            console.log("Dao Graph Ecolog Error code ::: ", err.code);
            console.log("Dao Graph Ecolog Error ::: ", err);
            return reject(err);
        });
    });
};

/** Export Module */
module.exports = {
    Graph
};