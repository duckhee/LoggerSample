const models = require('../../../models/index');
const device = require('../../../models/device');
/** ECOLOG DATABASE MODEL */
const ecolog = require('../../../models/ecolog');
const ecologColumn = require('../../../models/ecologcolumn');

/** Check Ecolog */
const CheckEcolog = (_Insert) => {
    return new Promise((resolve, reject) => {
        models.ecolog.findAll({
            where: {
                DeviceIdx: _Insert.dataValues.id
            }
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            console.log("Device Ecolog Column Check Error Code ::: ", err.code);
            console.log("Device Ecolog Column Check Error ::: ", err);
            return reject(err);
        });
    });
};

/** Ecolog MIS File Parsing Function */
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
};

/** Make Parsing Ecolog MIS File Make Date Time */
const _EcologMakeDate = (data, time) => {
    let _SDate;
    _SDate = String(data).substring(0, 4) + "/";
    _SDate += String(data).substring(4, 6) + "/";
    _SDate += String(data).substring(6, 8) + " ";
    _SDate += String(time).substring(0, 2) + ":";
    _SDate += String(time).substring(2, 4) + ":";
    _SDate += String(time).substring(4, 6);
    return new Date(_SDate);
};

/** Make Data Json Type (Database Column Matching) */
const _EclogDBData = (Insert) => {
    let _ReturnValue = [];
    console.log("Array LENGTH : ", Insert.length);
    console.log("ecolog id : ", Insert.ecologIdx);
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
};

/** Make Ecolog Data Json Type  */
const _MakeEcologData = (_Insert) => {
    console.log(_Insert.dataValues.id);
    return new Promise((resolve, reject) => {
        console.log("Make Ecolog Data : " + _Insert);
        _MISParser(_Insert.filesRaw, _Insert.ecologIdx).then(result => {
            //console.log("Parsing Data :", result);
            _EclogDBData(result).then(result2 => {
                //console.log('get Data : ', result2);
                return resolve(result2);
            }).catch(err => {
                return reject(err);
            });
        }).catch(err => {
            console.log("Make Ecolog Json Data Error Code ::: ", err.code);
            console.log("Make Ecolog Json Data Error ::: ", err);
            return reject(err);
        });
    });
};

/** Insert Ecolog Data Column */
const InsertDataColumn = (_Insert) => {
    return new Promise((resolve, reject) => {
        _MakeEcologData(_Insert).then(result => {
            if (result.length <= 0) {
                let err = new Error("Not Make Ecolog Data");
                return reject(err);
            }
            console.log("Insert Ecolog Data Json : " + result);
            models.ecologColumn.bulkCreate(result).then(() => {
                return resolve("DONE");
            }).catch(err => {
                return reject(err);
            });
        }).catch(err => {
            return reject(err);
        });
    });
};

/** Insert Ecolog DataBase */
const _InsertDB = (_Data) => {
    return new Promise((resolve, reject) => {
        CheckEcolog(_Data).then(CheckEcolog => {
            console.log("Check Ecolog Data : ", CheckEcolog);
            _Data.ecologIdx = CheckEcolog[0].dataValues.id;
            InsertDataColumn(_Data).then(result => {
                return resolve(result);
            }).catch(err => {
                return reject(err);
            });
        }).catch(err => {
            return reject(err);
        })
    });
};


module.exports = {
    CheckEcolog,
    _MakeEcologData,
    _InsertDB
};