/** Device Model */
const models = require('../../../../DataBase/models/index');
const device = require('../../../../DataBase/models/device');
/** Device Detail Middle Connection */
const RawConnection = require('./device.select.interface');

/** Create Device */
const CreateDevice = (DeviceInfo) => {
    return new Promise((resolve, reject) => {
        models.device.create({

        }).then(result => {

        }).catch(err => {

        });
    });
};

/** Paging Device */
const PagingDevice = (DeviceInfo) => {
    return new Promise((resolve, reject) => {
        models.device.findAll().then(result => {

        }).catch(err => {

        });
    });
};

module.exports = {

};