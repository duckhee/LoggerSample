/** Index Models */
const models = require('../../../DataBase/models/index');
/** Device Models */
const device = require('../../../DataBase/models/device');
/** Ecolog Function */
const EcologDao = require('./ecolog/index.dao');

/** Get Device Type */
const GetDeviceType = (DeviceNo) => {
    return new Promise((resolve, reject) => {
        models.device.findOne({
            where: {
                id: DeviceNo
            },
            attributes: ['id', 'deviceType', 'FTPFolder']
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            console.log("Beta get Device Type Error code ::: ", err.code);
            console.log('Beta get Device Type Error ::: ', err);
            return reject(err);
        });
    });
};

/** Graph Device Type Selector */
const graphSelector = () => {
    let _return = {
        "dataTracker": '',
        "ecolog": EcologDao().graph,
        "hikVision": ''
    };
    return _return;
};

/** Download Device Type CSV Data */
const DownloadSelector = () => {
    let _return = {
        "dataTracker": '',
        "ecolog": EcologDao().download,
        "hikVision": ''
    };
    return _return;
};



module.exports = {
    GetDeviceType,
    graphSelector,
    DownloadSelector
};