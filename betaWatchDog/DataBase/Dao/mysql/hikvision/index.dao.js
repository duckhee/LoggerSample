const models = require('../../../models/index');
const device = require('../../../models/device');
/** HIKVISION DATABASE MODEL */
const hikvision = require('../../../models/hikvision');
const HikVisionPath = require('../../../models/HikVisionPath');

/** Check HikVision */
const CheckHikVision = (_Insert) => {
    return new Promise((resolve, reject) => {
        models.hikvision.findAll({
            where: {
                DeviceIdx: _Insert[0].id
            }
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            console.log("Device HikVision Column Check Error Code ::: ", err.code);
            console.log("Device HikVision Column Check Error ::: ", err);
            return reject(err);
        });
    });
};

module.exports = {
    CheckHikVision
};