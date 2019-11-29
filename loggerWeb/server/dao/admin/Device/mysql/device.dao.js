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
 */


/** Create Device */
const CreateDevice = (DeviceInfo) => {
    return new Promise((resolve, reject) => {
        models.device.create({
            /** Create Device Columns */
            name: '',
            PlotIdx: '',
            DeviceType: '',
            Latitude: '',
            Longitude: '',
            FTPFolder: ''
        }).then(DeviceResult => {
            RawConnection[DeviceType].CreateRaw().then(RawResult => {
                console.log('Dao create Raw Device Success ::: ', RawResult);
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
                    console.log('Plot Info :: ', Device);
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

module.exports = {
    CreateDevice,
    PagingDevice
};