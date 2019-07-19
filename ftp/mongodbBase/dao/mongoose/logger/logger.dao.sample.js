const LoggerInfo = require('../../../MongooseModel/logger.info.Model');
const LoggerData = require('../../../MongooseModel/logger.data.Model');
const LoggerName = require('../../../MongooseModel/logger.name.Model');

/**
 * check logger info
 * check logger data
 * insert logger name
 * insert logger data
 * 
 */
const CheckLoggerInfo = (Info) => {

    return new Promise((resolve, reject) => {
        LoggerInfo.findOne({
            LoggerFolderName: Info
        }).populate('UserInfo').exec((err, res) => {
            if (err) {
                return reject(err);
            }
            if (res == null) {
                return resolve(0);
            }
            return resolve(res);
        });
    });
};

const CheckLoggerName = (NameJson) => {
    return new Promise((resolve, reject) => {
        LoggerName.findOne({
            folderName: NameJson.folderName
        }).populate('LoggerMainInfo').exec((err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        });
    });
};

const InsertLoggerName = (Name) => {
    return new Promise((resolve, reject) => {
        LoggerName.create(Name).then(result => {
            return resolve(result);
        }).catch(err => {
            return reject(err);
        });
    });
};

const CheckLoggerData = (dataInfo) => {
    return new Promise((resolve, reject) => {
        LoggerData.findOne({
            getFileName: dataInfo
        }, (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        });
    });
};

const InsertLoggerData = (LoggerDataJson) => {
    return new Promise((resolve, reject) => {
        LoggerData.create(LoggerDataJson).then(result => {
            return resolve(result);
        }).catch(err => {
            return reject(err);
        });
    });
};

const InsertLoggerDataArray = (ArrayValue) => {
    return new Promise((resolve, reject) => {
        LoggerData.insertMany(ArrayValue, (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        });
    });
};

/**
 * update logger info insert logger data array
 * update logger name insert logger data array
 */
const updateDateName = (updateJson, arrayList) => {
    return new Promise((resolve, reject) => {
        LoggerName.update({
            _id: updateJson._id
        }, {
            $set: {
                LoggerData: arrayList
            }
        }, (err, upset) => {
            if (err) {
                return reject(err);
            }
            return resolve(upset);
        });
    });
};

const updateDataInfo = (updateJson, arrayList) => {
    return new Promise((resolve, reject) => {
        LoggerInfo.update({
            _id: updateJson._id
        }, {
            $set: {
                LoggerData: arrayList
            }
        }, (err, upset) => {
            if (err) {
                return reject(err);
            }
            return resolve(upset);
        });
    });
};

module.exports = {
    CheckLoggerInfo,
    CheckLoggerName,
    InsertLoggerName,
    InsertLoggerData,
    CheckLoggerData,
    InsertLoggerDataArray,
    updateDataInfo,
    updateDateName

};