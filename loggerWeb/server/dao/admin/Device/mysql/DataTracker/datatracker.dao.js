const models = require('../../../../../DataBase/models/index');
const DataTracker = require('../../../../../DataBase/models/datatracker');

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
                id: Info
            }
        }).then(result => {
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

            }
        }).then(result => {

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

        }).then(result => {

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

        }).then(result => {

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

        }).catch(err => {
            console.log("Raw Dao Device Data Tracker Page List Error code ::: ", err.code);
            console.log("Raw Dao Device Data Tracker Page List Error ::: ", err);
            return reject(err);
        });
    });
};

module.exports = {
    CreateRaw,
    DeleteRaw,
    DetailRaw,
    ModifyRaw,
    ListRaw,
    PagingRaw,
};