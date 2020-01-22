const models = require('../../models/index');
const device = require("../../models/device");
/** TEST DEVICE COLUMNS */
const DeviceColumns = require('../../models/devicecolumns');
const DeviceColumnData = require("../../models/datatrackerdatacolumns");
/** PRODUCT DATA-TRACKER COLUMNS */
const DataTrackerColumns = require("../../models/datatrackercolumns");
const DataTrackerDataColumns = require("../../models/datatrackerdatacolumns");
/** PRODUCT HIKVISION CAMERA  */

/** PRODUCT ECOLOG COLUMNS */
const ecolog = require('../../models/ecolog');
const ecologColumn = require('../../models/ecologcolumn');


/** Check Device */
const CheckDevice = () => {
    return new Promise((resolve, reject) => {
        models.device.findAll({
            attributes: ['id', 'DeviceType', 'FTPFolder']
        }).then(result => {
            console.log("CHECK RESULT DEVICE");
            return resolve(result);
        }).catch(err => {
            return reject(err);
        });
    });
};

/** Check Name */
const CheckDataTrackerName = (_Insert) => {
    return new Promise((resolve, reject) => {
        console.log("FIND ALL WHERE DeviceIdx : ", _Insert[0].id);
        models.DeviceColumns.findAll({
            where: {
                deviceIdx: _Insert[0].id
            }
        }).then(result => {
            console.log("CHECK DEVICE NAME : ", result);
            return resolve(result);
        }).catch(err => {
            return reject(err);
        });
    });
};

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
}

/** Check DeviceType */
const CheckDeviceType = () => {
    let _return = {
        "DataTracker": "",
        "ecolog": CheckEcolog
    };
    console.log("DEVICE TYPE CHECK ", _return);
    return _return;
};

/** Check Name Columns */
const CheckNameColumns = () => {
    /** Interface JSON */
    let _return = {
        "DataTracker": CheckDataTrackerName,
    };
    console.log("RETURN VALUE : ", _return);
    return _return;
};

/** Insert Name */
const InsertDataTrackerName = (_Insert) => {
    return new Promise((resolve, reject) => {
        models.DeviceColumns.create({
            deviceIdx: _Insert[0].id,
            columns: _Insert.nameColumns
        }).then(result => {
            console.log("INSERT DEVICE NAME");
            return resolve(result);
        }).catch(err => {
            return reject(err);
        });
    });
};

/** Insert HikVision Path */
const InsertHikVision = (_Insert) => {
    return new Promise((resolve, reject) => {

    });
};

/** Insert Name Columns */
const InsertNameColumns = () => {
    /** Interface JSON */
    let _return = {
        "DataTracker": InsertDataTrackerName,
        "HikVision": InsertHikVision
    };
    return _return;
};

/** MAKE INSERT DATA */
const _DataTrackerMakeData = (_Insert) => {
    let _return = [];
    let _Time = new Date();
    return new Promise((resolve, reject) => {
        if (_Insert.dataColumns.length > 0) {
            for (let i = 0; i < _Insert.dataColumns.length; i++) {
                /** id Error Check */
                if (_Insert.dataColumns[i] !== "") {
                    _return.push({
                        deviceIdx: parseInt(_Insert[0].id),
                        columnValue: "" + _Insert.dataColumns[i],
                    });
                }
            }
            if (_return.length > 0) {
                return resolve(_return);
            }
            return reject("_MakeData");
        }
        return reject("_MakeData");
    });
};

/** Insert Data  */
const InsertDataTrackerData = (_Insert) => {
    return new Promise((resolve, reject) => {
        _DataTrackerMakeData(_Insert).then(_InsertData => {
            console.log("INSERT DATA MAKE COLUMNS : ", _InsertData);
            if (_InsertData.length > 0) {
                models.DeviceColumnData.bulkCreate(_InsertData).then(() => {
                    console.log("INSERT DEVICE DATA : ");
                    return resolve("DONE");
                }).catch(err => {
                    console.log("BULK INSERT ERROR");
                    return reject(err);
                });
            } else {
                return reject("InsertDataTrackerData");
            }
        }).catch(err => {
            return reject(err);
        });
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

/** Insert Data Columns */
const InsertDataColumns = () => {
    /** Interface JSON */
    let _return = {
        "DataTracker": InsertDataTrackerData,
        "HikVision": InsertHikVision,
        "ecolog": InsertEcologData
    };
    /** Insert HikVision Camera path */

    return _return;
};



module.exports = {
    CheckDevice,
    CheckNameColumns,
    CheckDeviceType,
    InsertNameColumns,
    InsertDataColumns
};