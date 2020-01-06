const models = require('../../models/index');
const device = require("../../models/device");
/** TEST DEVICE COLUMNS */
const DeviceColumns = require('../../models/devicecolumns');
const DeviceColumnData = require("../../models/datatrackerdatacolumns");
/** PRODUCT DATA-TRACKER COLUMNS */
const DataTrackerColumns = require("../../models/datatrackercolumns");
const DataTrackerDataColumns = require("../../models/datatrackerdatacolumns");

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
            console.log("CHECK DEVICE NAME");
            return resolve(result);
        }).catch(err => {
            return reject(err);
        });
    });
};

/** Check Name Columns */
const CheckNameColumns = () => {
    /** Interface JSON */
    let _return = {
        "DataTracker": CheckDataTrackerName
    };
    console.log("RETURN VALUE : ", _return);
    return _return;
};

/** Insert Name */
const InsertDataTrackerName = (_Insert) => {
    return new Promise((resolve, reject) => {
        models.DeviceColumns.create({
            deviceIdx: _Insert.deviceIdx,
            columns: _Insert.name
        }).then(result => {
            console.log("INSERT DEVICE NAME");
            return resolve(result);
        }).catch(err => {
            return reject(err);
        });
    });
};

/** Insert Name Columns */
const InsertNameColumns = () => {
    /** Interface JSON */
    let _return = {
        "DataTracker": InsertDataTrackerName
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
                        columnValue: "" + _Insert.dataColumns[i]

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
            console.log("INSERT DATA MAKE COLUMNS : ", _InsertData.length);
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


/** Insert Data Columns */
const InsertDataColumns = () => {
    /** Interface JSON */
    let _return = {
        "DataTracker": InsertDataTrackerData
    };
    /** Insert HikVision Camera path */

    return _return;
};



module.exports = {
    CheckDevice,
    CheckNameColumns,
    InsertNameColumns,
    InsertDataColumns
};