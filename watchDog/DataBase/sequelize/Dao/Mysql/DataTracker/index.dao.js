const models = require('../../../models/index');
const device = require("../../../models/device");
/** TEST DEVICE COLUMNS */
const DataTracker = require('../../../models/datatracker.js');
const DataTrackerColumnName = require('../../../models/DataTrackerColumnName');
const DeviceColumnData = require("../../../models/datatrackercolumndata");

/** Check DataTracker */
const CheckDataTracker = (_Insert) => {
    return new Promise((resolve, reject) => {
        models.DataTracker.findAll({
            where: {
                DeviceIdx: _Insert[0].id
            }
        }).then(result => {
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
        models.DataTrackerColumnName.findAll({
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


/** Insert Name */
const InsertDataTrackerName = (_Insert) => {
    return new Promise((resolve, reject) => {
        models.DeviceColumnData.create({
            DataTrackerIdx: _Insert[0].id,
            nameColumn: _Insert.nameColumns
        }).then(result => {
            console.log("INSERT DEVICE NAME");
            return resolve(result);
        }).catch(err => {
            return reject(err);
        });
    });
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
                        DataTrackerIdx: parseInt(_Insert[0].id),
                        DataColumn: "" + _Insert.dataColumns[i],
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

/** All Do Device Check, Insert Data */
const AllDo = (_Insert) => {
    return new Promise((resolve, reject) => {

    });
};

module.exports = {
    CheckDataTracker,
    CheckDataTrackerName,
    InsertDataTrackerName,
    InsertDataTrackerData
};