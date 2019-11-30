const models = require('../../../../../DataBase/models/index');
const hikvision = require('../../../../../DataBase/models/hikvision');


/** Create hikvision */
const CreateRaw = (Info) => {
    console.log('hikvision RawDao');
    return new Promise((resolve, reject) => {
        models.hikvision.create({
            DeviceIdx: Info.DeviceIdx,
            HikVisionIp: Info.IP,
            HikVisionId: Info.ID,
            HikVisionPw: Info.PW,
            FTPFolder: Info.Path
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            console.log("Raw Dao Device hikvision Create Error code ::: ", err.code);
            console.log("Raw Dao Device hikvision Create Error ::: ", err);
            return reject(err);
        });
    });
};

/** Delete hikvision */
const DeleteRaw = (Info) => {
    console.log('hikvision RawDao');
    return new Promise((resolve, reject) => {
        models.hikvision.destroy({

        }).then(result => {

        }).catch(err => {
            console.log("Raw Dao Device hikvision Delete Error code ::: ", err.code);
            console.log("Raw Dao Device hikvision Delete Error ::: ", err);
            return reject(err);
        });
    });
};

/** Detail hikvision */
const DetailRaw = (Info) => {
    console.log('hikvision RawDao');
    return new Promise((resolve, reject) => {
        models.hikvision.findOne({

        }).then(result => {

        }).catch(err => {
            console.log("Raw Dao Device hikvision Detail Error code ::: ", err.code);
            console.log("Raw Dao Device hikvision Detail Error ::: ", err);
            return reject(err);
        });
    });
};

/** Update hikvision */
const ModifyRaw = (Info) => {
    console.log('hikvision RawDao');
    return new Promise((resolve, reject) => {
        models.hikvision.update({

        }, {

        }).then(result => {

        }).catch(err => {
            console.log("Raw Dao Device hikvision Update Error code ::: ", err.code);
            console.log("Raw Dao Device hikvision Update Error ::: ", err);
            return reject(err);
        });
    });
};

/** List Data Tracker */
const ListRaw = (Info) => {
    console.log('hikvision RawDao');
    return new Promise((resolve, reject) => {
        models.hikvision.findAll({

        }).then(result => {

        }).catch(err => {
            console.log("Raw Dao Device hikvision List Error code ::: ", err.code);
            console.log("Raw Dao Device hikvision List Error ::: ", err);
            return reject(err);
        });
    });
};

/** List hikvision */
const PagingRaw = (Info) => {
    console.log('hikvision RawDao');
    return new Promise((resolve, reject) => {
        models.hikvision.findAll({

        }).then(result => {

        }).catch(err => {
            console.log("Raw Dao Device hikvision Page List Error code ::: ", err.code);
            console.log("Raw Dao Device hikvision Page List Error ::: ", err);
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