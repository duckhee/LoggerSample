const UserInfoSchema = require('../../../MongooseModel/User.model');
const LoggerInfoSchema = require('../../../MongooseModel/logger.info.Model');
const LoggerNameSchema = require('../../../MongooseModel/logger.name.Model');
const LoggerDateSchema = require('../../../MongooseModel/logger.data.Model');

const TestUser = () => {
    return new Promise((resolve, reject) => {
        UserInfoSchema.find({
            _id: 1
        }, (err, result) => {
            if (err) {
                console.log('error', err);
                reject(err);
                return;
            }
            resolve(result);
            return;
        });
    });
};


const InsertLoggerInfo = (LoggerInfo) => {
    return new Promise((resolve, reject) => {
        LoggerInfoSchema.create(LoggerInfo).then(result => {
            resolve(result);
        }).catch(err => {
            console.log('insert logger info error code :::: ', err.code);
            console.log('insert logger info error :::: ', err);
            reject(err);
        });
    });
};


const FindLoggerInfo = (LoggerInfo) => {
    return new Promise((resolve, reject) => {
        LoggerInfoSchema.findOne({
            LoggerFolderName: LoggerInfo.folder

        }, (err, result) => {
            if (err) {
                console.log('get logger info error code :::: ', err.code);
                console.log('get logger info error :::: ', err);
                reject(err);
                return;
            }
            resolve(result);
            return;
        });
    });
};

const UpdateLoggerInfo = (LoggerInfo) => {
    return new Promise((resolve, reject) => {
        LoggerInfoSchema.update({
            _id: LoggerInfo._id
        }, {
            $set: LoggerInfo
        }, function (err, output) {
            if (err) {
                console.log('User Update Logger info error code ::: ', err.code);
                console.log('User Update Logger info error  ::: ', err);
                reject(err);
                return;
            }
            console.log('update output :::: ', output);
            resolve(output);
            return;
        });
    });
};

const UpdateLoggerName = (LoggerInfo) => {
    return new Promise((resolve, reject) => {
        LoggerNameSchema.update({
            _id: LoggerInfo._id
        }, {
            $set: LoggerInfo
        }, function (err, output) {
            if (err) {
                console.log('User Update Logger info error code ::: ', err.code);
                console.log('User Update Logger info error  ::: ', err);
                reject(err);
                return;
            }
            console.log('update output :::: ', output);
            resolve(output);
            return;
        });
    });
};

const FindOneLoggerName = (InsertLoggerNameAndData) => {
    return new Promise((resolve, reject) => {
        LoggerNameSchema.findOne({
            folderName: InsertLoggerNameAndData.folderName
        }).exec((err, res) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res);
            return;
        });
    });
}

const InsertDataLoggerNameTest = (LoggerDataInfo) => {
    console.log('testing insert data logger name ::: ', LoggerDataInfo);
    return new Promise((resolve, reject) => {
        FindOneLoggerName(LoggerDataInfo).then(res => {
            console.log('data logger name find one result ::: ', res);
            if (res != null) {
                resolve(res);
                return;
            }
            LoggerNameSchema.create(LoggerDataInfo).then(result => {
                resolve(result);
                return;
            }).catch(err => {
                reject(err);
                return;
            });

        }).catch(err => {
            reject(err);
            return;
        });

    });
};

const InsertDataLoggerName = (LoggerDataInfo) => {

    return new Promise((resolve, reject) => {
        //let LoggerName = new LoggerNameSchema(LoggerDataInfo);
        LoggerNameSchema.findOneOrCreate(LoggerDataInfo, (err, res) => {
            if (err) {
                console.log('insert data logger name error code ::::  ', err.code);
                console.log('insert data logger name error ::::  ', err);
                reject(err);
                return;
            }

            console.log('insert logger data name ::: ', res);
            //console.log('done insert data logger name dao ', res);
            resolve(res);
            return;
        });
    });
};

const InsertDataLoggerTest = (LoggerDataInfo) => {

    //console.log("Insert Data Logger Info", LoggerDataInfo);
    let ArrayValue = new Array();
    return new Promise((resolve, reject) => {
        LoggerDateSchema.findOne({
            getFileName: LoggerDataInfo.getFileName
            //getFileName: 'TEST'
        }, (err, findResult) => {
            if (err) {
                console.log('find one result data error code ::: ', err.code);
                console.log('find one result data error ::: ', err);
                reject(err);
                return;
            }
            console.log('find result result', findResult);
            if (findResult == null || findResult == '') {
                for (var i in LoggerDataInfo.fullValueData) {
                    //console.log('TESTING VALUE ::: ', LoggerDataInfo.fullValueData[i]);
                    let JsonValue = {
                        LoggerMainInfoIndex: LoggerDataInfo.LoggerMainInfoIndex,
                        LoggerNameIndex: LoggerDataInfo.LoggerNameIndex,
                        getFileName: LoggerDataInfo.getFileName
                    };
                    let fullTextValue = LoggerDataInfo.fullValueData[i];
                    if (fullTextValue == null || fullTextValue == '') {
                        console.log('null data full text value');

                    } else {
                        JsonValue.fullValueData = fullTextValue;
                        console.log('testing for value i ::: ', i);
                        console.log('full text value ::: ', fullTextValue);
                        console.log('json value :::: ', JsonValue);
                        ArrayValue.push(JsonValue);
                    }

                    if (i == LoggerDataInfo.fullValueData.length - 1) {
                        console.log("Array value ", ArrayValue);
                        console.log('array value length ::: ', ArrayValue.length);
                        LoggerDateSchema.insertMany(ArrayValue, (err, res) => {
                            if (err) {
                                console.log('insert logger data error code ::: ', err.code);
                                console.log('insert logger data error ::: ', err);
                                reject(err);
                                return;
                            }
                            console.log('insert many data result ::: ', res);
                            resolve(res);
                            return;
                        });
                    }
                };
            } else {
                var err = new Error('already insert data error code === -5 ');
                err.code = -5;
                reject(err);
                return;
            }
        });

    });


};

const InsertDataLogger = (LoggerDataInfo) => {
    console.log('insert data many ::: ', LoggerDataInfo);

    return new Promise((resolve, reject) => {

    });
};


const FindLoggerInfoAndUser = (LoggerInfo) => {
    return new Promise((resolve, reject) => {
        LoggerInfoSchema.findOne({
            LoggerFolderName: LoggerInfo.folder
        }).populate('UserInfo').exec((err, res) => {
            if (err) {
                console.log('get logger info and user get error code ::: ', err.code);
                console.log('get logger info and user get error ::: ', err);
                reject(err);
                return;
            }
            if (res == null) {
                var err = new Error("NOT DATA INSERT Error code == -3");
                err.code = -3;
                reject(err);
                return;
            }
            resolve(res);
            return;
        });
    });
};

const TestingCode = (LoggerInfo) => {
    var array = [];
    return new Promise((resolve, reject) => {
        LoggerInfoSchema.find({
            LoggerFolderName: 'ecolog'
        }).populate({
            path: 'UserInfo',
            match: {
                userId: 'admin'
            }
        }).exec((err, res) => {
            if (err) {
                console.log('testing error code');
                console.log(err);
                reject(err);
                return;
            }
            console.log('testing cdoelkfajdskf');
            console.log(res[0]);
            if (res == null) {
                console.log('null data');
            } else {
                //array.push(res);
            }
            resolve(res);
            return;
        });
    });
};

const InsertLoggerNameAndData = (LoggerInfo) => {
    var LoggerName = {
        fullNameData: '',
        LoggerMainInfoIndex: '',
        LoggerDataIndex: '',

    };
    var LoggerData = {
        fullValueData: '',
        LoggerInfo: '',
        LoggerNameIndex: '',
    };
    console.log('insert all data name and data');
    return new Promise((resolve, reject) => {

    });
};


module.exports = {
    FindLoggerInfo,
    InsertLoggerInfo,
    TestUser,
    InsertDataLoggerName,
    InsertDataLoggerNameTest,
    InsertDataLogger,
    FindLoggerInfoAndUser,
    InsertLoggerNameAndData,
    UpdateLoggerInfo,
    UpdateLoggerName,
    TestingCode,
    InsertDataLoggerTest
};