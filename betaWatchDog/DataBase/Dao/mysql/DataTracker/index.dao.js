const models = require('../../../models/index');
const device = require('../../../models/device');
/** DATATRACKER DATABASE MODEL */
const DataTracker = require('../../../models/datatracker');
const DataTrackerColumnName = require('../../../models/DataTrackerColumnName');
const DataTrackerColumnData = require("../../../models/DataTrackerColumnData");

/** DataTracker Check */
const CheckDataTracker = (_Insert) => {
    return new Promise((resolve, reject) => {
        console.log("Cehck Data Tracker Id : " + _Insert.dataValues.id);
        models.DataTracker.findAll({
            where: {
                DeviceIdx: _Insert.dataValues.id
            }
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            console.log('Device DataTracker Column Check Error Code ::: ', err.code);
            console.log('Device DataTracker Column Check Error ::: ', err);
            return reject(err);
        });
    });
};

/** DataTracker Name Check */
const CheckDataTrackerNameColumns = (DataTrackerId) => {
    return new Promise((resolve, reject) => {
        models.DataTrackerColumnName.findOne({
            where: {
                DataTrackerIdx: DataTrackerId
            }
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            console.log("Device DataTracker Name Column Check Error Code ::: ", err.code);
            console.log("Device DataTracker Name Column Check Error ::: ", err);
            return reject(err);
        });
    });
};

/** DataTracker Split Data Raw File */
const GetColumns = (filesRaw, value) => {
    let SplitData = filesRaw.filesRaw.split('\r\n');
    if (value == "name") {
        return SplitData[0];
    }
    if (value == "data") {
        SplitData.splice(0, 1);
        return SplitData;
    }
};


/** Make Data Json Type(Database Column Matching) */
const _DataTrackerMakeData = (_Raw, _type) => {
    let _returnArray = [];
    return new Promise((resolve, reject) => {
        if (_Raw.dataColumn.length > 0) {
            /**  */
            if (_type == "data") {
                /** DataColumn */

            } else if (_type == "name") {
                /** nameColumn */
            } else {
                console.log("Data Tracker Make Data Not Match Type Error");
                let err = new Error("Data Tracker Make Data Not Match Type Error");
                return reject(err);
            }
            /**  */
        } else {
            console.log('Not have DataTracker Data');
            let err = new Error('Not have DataTracker Data');
            return reject(err);
        }

    });
};

/** Insert DataTracker Name Column */
const InsertNameColumn = (DataTrackerId, nameData) => {
    return new Promise((resolve, reject) => {
        models.DataTrackerColumnName.create({
            DataTrackerIdx: DataTrackerId,
            nameColumn: nameData
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            console.log("Data Tracker Insert Name Column Error Code ::: ", err.code);
            console.log("Data Tracker Insert Name Column Error ::: ", err);
            return reject(err);
        });
    });
};

/** Make DataTracker Data Column Json Type */
const MakeDataJson = (DataTrackerId, data) => {
    let _return = [];
    return new Promise((resolve, reject) => {
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                if (data[i] !== "") {
                    _return.push({ DataTrackerIdx: parseInt(DataTrackerId), DataColumn: "" + data[i] });
                }
            }
            return resolve(_return);
        } else {
            let err = new Error("Null Insert Data ");
            return reject(err);
        }
    });
};

/** Insert DataTracker Data Column */
const InsertDataColumn = (_Insert) => {
    return new Promise((resolve, reject) => {
        models.DataTrackerColumnData.bulkCreate(_Insert).then(() => {
            return resolve("DONE");
        }).catch(err => {
            console.log("Data Tracker Bulk Insert Data Column Error Code ::: ", err.code);
            console.log("Data Tracker Bulk Insert Data Column Error ::: ", err);
            return reject(err);
        });
    });
};

/** Insert DataTracker DataBase */
const _InsertDB = (_Insert) => {
    return new Promise((resolve, reject) => {
        let NameColumns = GetColumns(_Insert, "name");
        let DataColumns = GetColumns(_Insert, "data");
        console.log("Check Insert Data : " + _Insert);
        CheckDataTracker(_Insert).then(CheckDataTracker => {
            console.log("Check DataTracker : " + CheckDataTracker[0].dataValues.id);
            CheckDataTrackerNameColumns(CheckDataTracker[0].dataValues.id).then(CheckNameColumn => {
                console.log("Check Name Column : " + CheckNameColumn);
                if (!CheckNameColumn) {
                    console.log("Name Column Not Have. " + CheckDataTracker[0].dataValues.id + ", IP : " + CheckDataTracker[0].dataValues.DataTrackerIP);
                    InsertNameColumn(CheckDataTracker[0].dataValues.id, NameColumns).then(result => {
                        console.log("Insert Name Column Done(InsertDB)");
                    }).catch(err => {
                        return reject(err);
                    });
                } else {
                    console.log("Name Column Have. " + CheckDataTracker[0].dataValues.id + ", IP : " + CheckDataTracker[0].dataValues.DataTrackerIP);
                }
                MakeDataJson(CheckDataTracker[0].dataValues.id, DataColumns).then(InsertData => {
                    InsertDataColumn(InsertData).then(result => {
                        return resolve("DONE");
                    }).catch(err => {
                        return reject(err);
                    });
                }).catch(err => {
                    return reject(err);
                });
            }).catch(err => {
                return reject(err);
            });
        }).catch(err => {
            return reject(err);
        });
    });
};


module.exports = {
    CheckDataTracker,
    GetColumns,
    _InsertDB
};