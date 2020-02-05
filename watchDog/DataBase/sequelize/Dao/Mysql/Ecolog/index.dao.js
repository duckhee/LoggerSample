const models = require('../../../models/index');
const device = require("../../../models/device");
/** PRODUCT ECOLOG COLUMNS */
const ecolog = require('../../../models/ecolog');
const ecologColumn = require('../../../models/ecologcolumn');


/** Check Ecolog */
const CheckEcolog = (_Insert) => {
    return new Promise((resolve, reject) => {
        models.ecolog.findAll({
            where: {
                DeviceIdx: _Insert[0].id
            }
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            return reject(err);
        })
    });
};

/** Ecolog Logic */
const _MISParser = (_data, ecologId) => {
    let _RawData = _data;
    let _SensorStartString = "<SENSOR>";
    let _SensorEndString = "</SENSOR>";
    let _DataStart = "</DATEFORMAT>";
    let _NewData = "<STATION>";
    let _Return = [];
    return new Promise((resolve, reject) => {
        console.log("Parsing ID : ", ecologId);
        while (true) {
            let ReturnJson = {};
            ReturnJson.name = _RawData.substring(_RawData.indexOf(_SensorStartString) + _SensorStartString.length, _RawData.indexOf(_SensorEndString));
            ReturnJson.ecologIdx = parseInt(ecologId);
            _RawData = _RawData.slice(_RawData.indexOf(_DataStart) + _DataStart.length);
            if (_RawData.indexOf(_NewData) == -1) {
                ReturnJson.raw = _RawData.substring(0, _RawData.length).split("\r\n");
                _Return.push(ReturnJson);
                break;
            }
            ReturnJson.raw = _RawData.substring(0, _RawData.indexOf(_NewData)).split("\r\n");
            _Return.push(ReturnJson);
        };
        return resolve(_Return);
    });
}

const _EcologMakeDate = (data, time) => {
    let _SDate;
    _SDate = String(data).substring(0, 4) + "/";
    _SDate += String(data).substring(4, 6) + "/";
    _SDate += String(data).substring(6, 8) + " ";
    _SDate += String(time).substring(0, 2) + ":";
    _SDate += String(time).substring(2, 4) + ":";
    _SDate += String(time).substring(4, 6);
    return new Date(_SDate);
}
const _EclogDBData = (Insert) => {
    let _ReturnValue = [];
    console.log("Array LENGTH : ", Insert.length);
    console.log("ecolog id : ", Insert.ecologId);
    return new Promise((resolve, reject) => {
        for (var i = 0; i < Insert.length; i++) {
            for (var j = 0; j < Insert[i].raw.length; j++) {
                let _InsertJson = {};
                _InsertJson.ecologName = Insert[i].name;
                _InsertJson.ecologIdx = Insert[i].ecologIdx; //Insert[0].ecologIdx;
                let _Detail = Insert[i].raw[j].split(";");
                let _Date = _EcologMakeDate(_Detail[0], _Detail[1]);
                if (!isNaN(_Date)) {
                    _InsertJson.createdAt = _Date;
                    _InsertJson.updatedAt = _Date;
                }
                let _FloatValue = parseFloat(_Detail[2]);
                if (isNaN(_FloatValue)) {
                    console.log("NULL");
                    console.log("DATA " + i + " : ", _Detail[2]);
                    if (_Detail[2] == undefined) {
                        console.log("NULL VALUE");
                    } else {
                        //console.log("Insert full : ", _InsertJson);
                        _InsertJson.ecologName = Insert[i].name;
                        _InsertJson.ecologData = _Detail[2];
                        //console.log("Insert full : ", _InsertJson);
                        _ReturnValue.push(_InsertJson);
                    }

                } else {
                    //console.log("parse float : ", _FloatValue);
                    _InsertJson.ecologData = String(_FloatValue);
                    _ReturnValue.push(_InsertJson);
                }
            }
        }
        if (_ReturnValue.length > 0) {
            return resolve(_ReturnValue);
        } else {
            return reject(null);
        }
    });
}
const _MakeEcologData = (_Insert) => {
    console.log(_Insert[0].id);
    return new Promise((resolve, reject) => {
        _MISParser(_Insert.dataColumns, _Insert.ecologId).then(result => {
            console.log("Parsing Data :", result);
            _EclogDBData(result).then(result2 => {
                //console.log('get Data : ', result2);
                return resolve(result2);
            }).catch(err => {
                return reject(err);
            });
        }).catch(err => {
            return reject(err);
        })
    });
};

const InsertEcologData = (_Insert) => {
    return new Promise((resolve, reject) => {
        console.log("Testing : ", _Insert);
        _MakeEcologData(_Insert).then(result => {
            if (result.length > 0) {
                console.log("Bulk Insert Data : ", result);
                models.ecologColumn.bulkCreate(result).then(() => {
                    return resolve("DONE");
                }).catch(err => {
                    console.log("BULK INSERT ERROR");
                    return reject(err);
                });
            } else {
                return reject("InsertEcologData Null");
            }
        }).catch(err => {
            console.log("_MakeEcologData Error code");
            return reject(err);
        })
    });
};

/** All Do Device Check, Insert Data */
const AllDo = (_Insert) => {
    return new Promise((resolve, reject) => {
        CheckEcolog(_Insert).then(CheckDevice => {
            _Insert.ecologId = CheckDevice[0].id;
            InsertEcologData(_Insert).then(result => {
                return resolve(result);
            }).catch(err => {
                return reject(err);
            });
        }).catch(err => {
            return reject(err);
        });
    });
};

module.exports = {
    CheckEcolog,
    InsertEcologData,
    AllDo
};