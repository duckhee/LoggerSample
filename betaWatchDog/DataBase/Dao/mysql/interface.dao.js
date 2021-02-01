const models = require('../../models/index');
const device = require('../../models/device');
/** DataTracker Module */
const _DataTracker = require('./DataTracker/index.dao');
/** Ecolog Module */
const _Ecolog = require('./ecolog/index.dao');
/** Check Device */
const GetDeviceType = () => {
    return new Promise((resolve, reject) => {
        models.device.findAll({
            attributes: ['id', 'DeviceType', 'FTPFolder']
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            console.log('get All Device Type Error Code ::: ', err.code);
            console.log('get All Device Type Error ::: ', err);
            return reject(err);
        });
    });
};

/** Check Device Find One */
const CheckDeviceType = (_FTPFolder) => {
    return new Promise((resolve, reject) => {
        models.device.findOne({
            where: {
                FTPFolder: _FTPFolder
            }
        }).then(result => {
            if (result != 0) {
                let err = new Error("Not Have Device");
                return reject(err);
            }
            return resolve(result);
        }).catch(err => {
            console.log("get Device Check Error Code ::: ", err.code);
            console.log("get Device Check Error ::: ", err);
            return reject(err);
        });
    });
};

const DeviceCheck = () => {
    let _return = {
        "DataTracker": _DataTracker.CheckDataTracker,
        "ecolog": _Ecolog.CheckEcolog,
        "hikVision": ''
    };
    return _return;
};

const InsertName = (files) => {
    let _return = {
        "DataTracker": _DataTracker.GetColumns(files, "name"),
        "ecolog": '',
        "hikVision": ''
    };
    return _return;
};

const InsertData = (files) => {
    let _return = {
        "DataTracker": _DataTracker.GetColumns(files, "data"),
        "ecolog": '',
        "hikVision": ''
    };
    return _return;
};

const MakeInsertData = () => {
    let _return = {
        "DataTracker": _DataTracker.GetColumns,
        "ecolog": _Ecolog._MakeEcologData,
        "hikVision": ''
    };

    return _return;
};

const _Insert = () => {
    let _return = {
        "DataTracker": _DataTracker._InsertDB,
        "ecolog": _Ecolog._InsertDB,
        "hikVision": ''
    };
    return _return;
};

module.exports = {
    GetDeviceType,
    CheckDeviceType,
    DeviceCheck,
    InsertName,
    InsertData,
    _Insert
};