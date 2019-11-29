const models = require('../../../../../DataBase/models/index');
const DataTracker = require('../../../../../DataBase/models/datatracker');

/** Create Data Tracker */
const CreateRaw = (Info) => {
    console.log('Data Tracker RawDao');
    return new Promise((resolve, reject) => {
        models.DataTracker.create({
            /** Create Data Tracker */

        }).then(result => {

        }).catch(err => {

        });
    });
};

/** Delete Data Tracker */
const DeleteRaw = (Info) => {
    console.log('Data Tracker RawDao');
    return new Promise((resolve, reject) => {
        models.DataTracker.destroy({
            where: {

            }
        }).then(result => {

        }).catch(err => {

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

        }).then(result => {

        }).catch(err => {

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

        });
    });
};

module.exports = {
    CreateRaw,
    DeleteRaw,
    DetailRaw,
    ModifyRaw,
    PagingRaw,
};