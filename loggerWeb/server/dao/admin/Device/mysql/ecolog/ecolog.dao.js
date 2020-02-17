const models = require('../../../../../DataBase/models/index');
const ecolog = require('../../../../../DataBase/models/ecolog');
const ecologColumn = require('../../../../../DataBase/models/ecologcolumn');
/** ecolog Root Path */
const RootPath = "/ecolog";

/** Create ecolog */
const CreateRaw = (Info) => {
    console.log('ecolog RawDao');
    return new Promise((resolve, reject) => {
        models.ecolog.create({
            DeviceIdx: Info.DeviceIdx,
            FileFormat: Info.FileType
        }).then(result => {
            console.log('Raw Dao Device ecolog Create');
            return resolve(result);
        }).catch(err => {
            console.log("Raw Dao Device ecolog  Create Error code ::: ", err.code);
            console.log("Raw Dao Device ecolog  Create Error ::: ", err);
            return reject(err);
        });
    });
};

/** Delete ecolog */
const DeleteRaw = (Info) => {
    console.log('ecolog RawDao');
    return new Promise((resolve, reject) => {
        models.ecolog.destroy({
            where: {
                DeviceIdx: Info.DeviceIdx
            }
        }).then(result => {
            console.log('Raw Dao Device ecolog Delete');
        }).catch(err => {
            console.log("Raw Dao Device ecolog  Delete Error code ::: ", err.code);
            console.log("Raw Dao Device ecolog  Delete Error ::: ", err);
            return reject(err);
        });
    });
};

/** Detail ecolog */
const DetailRaw = (Info) => {
    console.log('ecolog RawDao');
    return new Promise((resolve, reject) => {
        models.ecolog.findOne({
            where: {
                DeviceIdx: Info.DeviceIdx
            },
            include: [{
                model: models.ecologColumn,
                attributes: ['ecologName', 'ecologData']
            }]
        }).then(result => {
            console.log('Raw Dao Device ecolog Detail');
            return resolve(result);
        }).catch(err => {
            console.log("Raw Dao Device ecolog  Detail Error code ::: ", err.code);
            console.log("Raw Dao Device ecolog  Detail Error ::: ", err);
            return reject(err);
        });
    });
};

/** Update ecolog */
const ModifyRaw = (Info) => {
    console.log('ecolog RawDao');
    return new Promise((resolve, reject) => {
        models.ecolog.update({

        }, {
            where: {
                DeviceIdx: Info.DeviceIdx
            }
        }).then(result => {
            console.log('Raw Dao Device ecolog Update');
        }).catch(err => {
            console.log("Raw Dao Device ecolog Page Update Error code ::: ", err.code);
            console.log("Raw Dao Device ecolog Page Update Error ::: ", err);
            return reject(err);
        });
    });
};

/** List Data Tracker */
const ListRaw = (Info) => {
    console.log('ecolog RawDao');
    return new Promise((resolve, reject) => {
        models.ecolog.findAll({
            where: {
                DeviceIdx: Info.DeviceIdx
            }
        }).then(result => {
            console.log('Raw Dao Device ecolog List');
	    return resolve(result);
        }).catch(err => {
            console.log("Raw Dao Device ecolog List Error code ::: ", err.code);
            console.log("Raw Dao Device ecolog List Error ::: ", err);
            return reject(err);
        });
    });
};

/** List ecolog */
const PagingRaw = (Info) => {
    console.log('ecolog RawDao');
    return new Promise((resolve, reject) => {
        models.ecolog.findAll({

        }).then(result => {
            console.log('Raw Dao Device ecolog Paging');
        }).catch(err => {
            console.log("Raw Dao Device ecolog Page List Error code ::: ", err.code);
            console.log("Raw Dao Device ecolog Page List Error ::: ", err);
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
