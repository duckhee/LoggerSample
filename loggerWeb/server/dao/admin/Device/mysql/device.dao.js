/** get Support Device */
const ConfigFile = require('../../../../../config/config.json');
/** Device Model */
const models = require('../../../../DataBase/models/index');
const device = require('../../../../DataBase/models/device');
/** Get Device Raw Value */
const RawType = ConfigFile.supportDevice;
/** Device Detail Middle Connection */
const RawConnection = require('./device.select.interface');

/**
 * Raw Value is 
 * DeviceID
 * IP
 * ID
 * PW
 * Path
 * FileType
 * DeviceIdx
 */


/** Create Device */
const CreateDevice = (DeviceInfo) => {
    console.log("insert Device Value : ", DeviceInfo);
    return new Promise((resolve, reject) => {
        models.device.create({
            /** Create Device Columns */
            name: DeviceInfo.name,
            PlotIdx: DeviceInfo.PlotIdx,
            DeviceType: DeviceInfo.DeviceType,
            Latitude: DeviceInfo.Lat,
            Longitude: DeviceInfo.Lon,
            FTPFolder: DeviceInfo.Path
        }).then(DeviceResult => {
            DeviceInfo.DeviceIdx = DeviceResult.id;
            /** Raw Create Device Value */
            console.log(`${DeviceInfo.DeviceType} Insert Value ${RawConnection[DeviceInfo.DeviceType]()}`);
            RawConnection[DeviceInfo.DeviceType]().CreateRaw(DeviceInfo).then(RawResult => {
                console.log('Dao create Raw Device Success ::: ', RawResult);
                return resolve(RawResult);
            }).catch(err => {
                console.log('Raw Dao Device Create Error code ::: ', err.code);
                console.log('Raw Dao Device Create Error ::: ', err);
                return reject(err);
            });
        }).catch(err => {
            console.log("Dao Device Create Error code ::: ", err.code);
            console.log("Dao Device Create Error ::: ", err);
            return reject(err);
        });
    });
};

/** Count Device */
const CountDevice = () => {
    return new Promise((resolve, reject) => {
        models.device.count().then(result => {
            return resolve(result);
        }).catch(err => {
            console.log("Dao Device Count Error code ::: ", err.code);
            console.log("Dao Device Count Error ::: ", err);
            return reject(err);
        });
    });
};

/** Paging Device */
const PagingDevice = (DeviceInfo) => {
    return new Promise((resolve, reject) => {
        CountDevice().then(Count => {
            let AllDeviceNumber = Count;
            let PagingNum = DeviceInfo.pages;
            let offsetting = 0;
            let MaxPages;
            if (parseInt(AllDeviceNumber % 10) !== 0) {
                MaxPages = parseInt(AllDeviceNumber / 10 + 1);
            } else {
                MaxPages = parseInt(AllDeviceNumber / 10);
            }
            console.log('plot count ::: ', AllDeviceNumber);
            console.log('Page Info : ', DeviceInfo);
            if (PagingNum > 1) {
                offsetting = 10 * (PagingNum - 1);
            }
            console.log('offset : ', offsetting);
            let SearchOptions = {};
            if (DeviceInfo) {
                models.device.findAll({
                    where: SearchOptions,
                    offset: offsetting,
                    limit: 10,
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    include: {
                        model: models.plot,
                        include: {
                            model: models.site
                        }
                    }
                }).then(Device => {
                    console.log('Device Info :: ', Device[0]);
                    //console.log('Plot Info :: ', Plots[0].dataValues.site.dataValues);
                    /** return value */
                    let returnValue = {
                        offset: offsetting,
                        value: Device,
                        pageNumber: MaxPages
                    };
                    return resolve(returnValue);
                }).catch(err => {
                    console.log('Dao Device Paging Error code ::: ', err.code);
                    console.log('Dao Device Paging Error ::: ', err);
                    return reject(err);
                });
            }
        }).catch(err => {
            console.log('Dao Device Paging Count Error code ::: ', err.code);
            console.log('Dao Device Paging Count Error ::: ', err);
            return reject(err);
        });
    });
};

/** Delete Device */
const DeleteDevice = (DeviceInfo) => {
    return new Promise((resolve, reject) => {
        models.device.destroy({
            where: {
                id: DeviceInfo.id
            }
        }).then(DeleteResult => {
            console.log('Device delete done and delete result : ', DeleteResult);
            PagingDevice(DeviceInfo).then(result => {
                console.log("Device Delete Paging result value :: ", result);
                return resolve(result);
            }).catch(err => {
                console.log("Dao Delete Device Paging Error code ::: ", err.code);
                console.log("Dao Delete Device Paging Error ::: ", err);
                return reject(err);
            });
        }).catch(err => {
            console.log('Dao Delete Device Error code ::: ', err.code);
            console.log('Dao Delete Device Error ::: ', err);
            return reject(err);
        });
    });
};

/** Device Insert Name Value */
const NameColumnsDevice = () => {

};

/** Device Get Data Value */
const ValueColumnsDevice = () => {

};

module.exports = {
    CreateDevice,
    PagingDevice,
    DeleteDevice
};