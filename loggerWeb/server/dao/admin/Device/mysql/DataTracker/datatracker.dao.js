const models = require('../../../../../DataBase/models/index');
const DataTracker = require('../../../../../DataBase/models/datatracker');
/** Name Insert Dao */
const NameColumnDao = require('./dataTracker.name.dao');
/** Data Insert Dao */
const DataColumnsDao = require('./dataTracker.value.dao');

/** DataTracker Root Path */
const RootPath = "/DataTracker";

/** Create Data Tracker */
const CreateRaw = (Info) => {
    console.log('Data Tracker RawDao', Info);
    return new Promise((resolve, reject) => {
        models.DataTracker.create({
            /** Create Data Tracker */
            DeviceIdx: Info.DeviceIdx,
            DataTrackerIP: Info.IP,
            DataTrackerId: Info.ID,
            DataTrackerPw: Info.PW,
            FTPFolder: Info.Path
        }).then(result => {
            console.log('Raw Dao Device Data Tracker Create');
            return resolve(result);
        }).catch(err => {
            console.log("Raw Dao Device Data Tracker Create Error code ::: ", err.code);
            console.log("Raw Dao Device Data Tracker Create Error ::: ", err);
            return reject(err);
        });
    });
};

/** Delete Data Tracker */
const DeleteRaw = (Info) => {
    console.log('Data Tracker RawDao');
    return new Promise((resolve, reject) => {
        models.DataTracker.destroy({
            where: {
                DeviceIdx: Info.DeviceIdx
            }
        }).then(result => {
            console.log('Raw Dao Device Data Tracker Delete');
            return resolve(result);
        }).catch(err => {
            console.log("Raw Dao Device Data Tracker Delete Error code ::: ", err.code);
            console.log("Raw Dao Device Data Tracker Delete Error ::: ", err);
            return reject(err);
        });
    });
};

/** Detail Data Tracker */
const DetailRaw = (Info) => {
    console.log('Data Tracker RawDao');
    return new Promise((resolve, reject) => {
        models.DataTracker.findOne({
            where: {
                DeviceIdx: Info.DeviceIdx
            },
            include: [{
                    model: models.DataTrackerColumnName,
                    attributes: ['nameColumn']
                },
                {
                    model: models.DataTrackerColumnData,
                    attributes: ['DataColumn']
                }
            ]
        }).then(result => {
            console.log('Raw Dao Device Data Tracker Detail');
            return resolve(result);
        }).catch(err => {
            console.log("Raw Dao Device Data Tracker Detail Error code ::: ", err.code);
            console.log("Raw Dao Device Data Tracker Detail Error ::: ", err);
            return reject(err);
        });
    });
};

/** Update Data Tracker */
const ModifyRaw = (Info) => {
    console.log('Data Tracker RawDao');
    return new Promise((resolve, reject) => {
        models.DataTracker.update({
            /** Update Value */

        }, {
            /** Search Value */
            where: {
                DeviceIdx: Info.DeviceIdx
            }
        }).then(result => {
            console.log('Raw Dao Device Data Tracker Update');
        }).catch(err => {
            console.log("Raw Dao Device Data Tracker Update Error code ::: ", err.code);
            console.log("Raw Dao Device Data Tracker Update Error ::: ", err);
            return reject(err);
        });
    });
};

/** List Data Tracker */
const ListRaw = (Info) => {
    console.log('Data Tracker RawDao');
    return new Promise((resolve, reject) => {
        models.DataTracker.findAll({
            where: {
                DeviceIdx: Info.DeviceIdx
            },
        }).then(result => {
            console.log('Raw Dao Device Data Tracker List');
        }).catch(err => {
            console.log("Raw Dao Device Data Tracker List Error code ::: ", err.code);
            console.log("Raw Dao Device Data Tracker List Error ::: ", err);
            return reject(err);
        });
    });
};


/** List Data Tracker */
const PagingRaw = (Info) => {
    console.log('Data Tracker RawDao');
    return new Promise((resolve, reject) => {
        models.DataTracker.findAll({

        }).then(result => {
            console.log('Raw Dao Device Data Tracker Paging');
        }).catch(err => {
            console.log("Raw Dao Device Data Tracker Page List Error code ::: ", err.code);
            console.log("Raw Dao Device Data Tracker Page List Error ::: ", err);
            return reject(err);
        });
    });
};

/** Insert Data Value Raw */

module.exports = {
    CreateRaw,
    DeleteRaw,
    DetailRaw,
    ModifyRaw,
    ListRaw,
    PagingRaw,
};