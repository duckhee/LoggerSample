const LoggerDao = require('../dao/mongoose/logger/logger.dao');
const FileUtil = require('../util/get.file.type');

const checkDataBaseRegiste = (folder) => {

    return new Promise((resolve, reject) => {
        if (folder == null) {
            var err = new Error("NOT FOLDER Error code == -1");
            err.code = -1;
            reject(err);
            return;
        }
        var loggerInfo = {
            folder: folder
        };
        LoggerDao.FindLoggerInfoAndUser(loggerInfo).then(result => {
            if (result.UserInfo.userId == null) {
                console.log(result.UserInfo.userId);
                var err = new Error("User Not Info error code == -2");
                err.code = -2;
                reject(err);
                return;
            }
            resolve(result);
            return;
        }).catch(err => {
            reject(err);
            return;
        });
    });
};

const InsertDataLogger = (LoggerInfo) => {

    console.log('checking ::: value ::: ', LoggerInfo.LoggerFolder);
    //console.log('Logger Info length ::: ', LoggerInfo.TestData.length);
    let CheckDataLength = LoggerInfo.TestData.length;
    let LoggerNameInfo = {
        fullNameData: LoggerInfo.TestData[0],
        LoggerMainInfoIndex: LoggerInfo.LoggerInfoIndex,
        folderName: LoggerInfo.LoggerFolder,
        //updateLoggerInfo: LoggerInfo.LoggerInfoValue

    };
    return new Promise((resolve, reject) => {
        if (CheckDataLength == null || CheckDataLength == 0) {
            var err = new Error("not array data error code === -4");
            err.code = -4;
            reject(err);
            return;
        }

        LoggerDao.InsertDataLoggerNameTest(LoggerNameInfo).then(NameResult => {
            //console.log('insert data logger name columns :: '.NameResult);
            //remove data logger name columns
            let Testing = LoggerInfo.TestData.splice(1, CheckDataLength);
            //console.log('Insert Logger data testing value splice ::: ', Testing);
            LoggerNameInfo.LoggerNameIndex = NameResult._id;
            LoggerNameInfo.fullValueData = Testing;
            LoggerNameInfo.getFileName = LoggerInfo.getFileName;
            LoggerNameInfo.updateLoggerName = NameResult;
            LoggerDao.InsertDataLoggerTest(LoggerNameInfo).then(result => {
                console.log('insert data logger testing result ::::', result.ArrayObject);
                //console.log('get logger info ::: ', LoggerInfo.LoggerInfoValue);
                if (LoggerInfo.LoggerInfoValue.LoggerData == null) {
                    LoggerInfo.LoggerInfoValue.LoggerData.push(result.ArrayObject);
                    LoggerNameInfo.updateLoggerName.LoggerData.push(result.ArrayObject);
                } else {
                    //console.log('testing get logger info data ::: ', LoggerInfo.LoggerInfoValue.LoggerData );
                    LoggerInfo.LoggerInfoValue.LoggerData = LoggerInfo.LoggerInfoValue.LoggerData.concat(result.ArrayObject);
                    LoggerNameInfo.updateLoggerName.LoggerData.concat(result.ArrayObject);
                }
                console.log('INFO result value ::: ', LoggerNameInfo.updateLoggerName.LoggerData);
                console.log('name result value ::: ', LoggerNameInfo.updateLoggerName.LoggerData);
                LoggerDao.UpdateLoggerInfo(LoggerInfo.LoggerInfoValue).then(updateResult => {
                    console.log('update logger info ::: ', updateResult);
                    LoggerDao.UpdateLoggerName(LoggerNameInfo.updateLoggerName).then(result => {
                        console.log('udpate logger name ::: ', result);
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

            }).catch(err => {
                if (err.code == -5) {

                } else {
                    console.log(err);
                }
                reject(err);
                return;
            });
        }).catch(err => {
            console.log('insert data logger name error code ::: ', err.code);
            console.log('insert data logger name error ::: ', err);
            reject(err);
            return;
        });
    });

};

const TestingCode = (LoggerInfo) => {
    return new Promise((resolve, reject) => {
        LoggerDao.TestingCode(LoggerInfo).then(result => {
            resolve(result);
            return;
        }).catch(err => {
            reject(err)
            return;
        });
    });
};

const InsertTest = (GetFilePath) => {
    let getTestData = FileUtil.GetFileText(GetFilePath);
    console.log('get read file :::: ', getTestData);

    console.log('get database testing folder name ::: ', getFolderName[0]);
    //get folder name and get registe or not database check logic start
    LoggerCtrl.checkDataBaseRegiste(getFolderName[0]).then(result => {
        console.log('check Data Base Registe ::: ', result);
        let getTestData = FileUtil.GetFileText(GetFilePath);
        let InsertInfo = {
            LoggerInfoIndex: result._id,
            TestData: getTestData,
            LoggerInfoValue: result,
            LoggerFolder: getFolderName[0],
            getFileName: getFileList[0]
        };
        // result.LoggerName.push();
        //console.log(getTestData);
        console.log('testing insert data logger before');
        LoggerCtrl.InsertDataLogger(InsertInfo).then(result => {
            console.log('testing123');
            console.log(result);
            process.exit(1);
        }).catch(err => {
            console.log('inset data logger error ::: ', err);
            console.log('testing1235');
            if (err.code == -5) {
                console.log('not match logger data make do');
                process.exit(1);
            }
            process.exit(1);
        });
        //process.exit(1);
    }).catch(err => {
        console.log('check data base registe error ', err);
        if (err.code == -1) {
            console.log('get not folder error do');
            process.exit(1);
        } else if (err.code == -3) {
            console.log('get not registe logger');
            process.exit(1);
        }
    });
    //end folder registe check logic
}

module.exports = {
    checkDataBaseRegiste,
    InsertDataLogger,
    InsertTest,
    TestingCode
};