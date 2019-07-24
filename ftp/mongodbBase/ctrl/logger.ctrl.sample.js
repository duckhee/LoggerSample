const LoggerDao = require('../dao/mongoose/logger/logger.dao.sample');
const FileUtil = require('../util/get.file.type');
const Sync = require('sync');
//const mainFTPFolder = process.cwd() + '/../sampleData';
//const mainFTPFolder = process.cwd() + '/../../../test';
/**
 * insert logger data
 * insert logger name
 */
const CheckLoggerInfo = (Folder) => {
    return new Promise((resolve, reject) => {

    });
};

const CheckLoggerInfoArray = (FolderList) => {
    var ArrayValue = new Array();

    return new Promise((resolve, reject) => {
        for (var list of FolderList) {
            let ResultJson = {};
            ResultJson.FolderName = list;
            LoggerDao.CheckLoggerInfo(list).then(result => {
                ResultJson.resultValue = result;
                ArrayValue.push(ResultJson);
                if (ArrayValue.length == FolderList.length) {
                    return resolve(ArrayValue);
                }
            }).catch(err => {
                return reject(err);
            });
        }
    });
};

const GetFile = (info) => {
    return new Promise((resolve, reject) => {

    });
};

const GetFileList = (info) => {

    let FileListArray = new Array();
    return new Promise((resolve, reject) => {
        for (var file of info) {
            let FileInfo = {
                Folder: file.FileName,
                Path: file.Path,
                LoggerMain: file.LoggerMain
            };

            try {
                FileInfo.FileList = FileUtil.GetFileList(file.Path);
                FileListArray.push(FileInfo);
            } catch (err) {
                return reject(err);
            }
        }
        return resolve(FileListArray);

    });
};

const GetAllText = (FileNameList) => {
    let FileTextArray = new Array();
    return new Promise((resolve, reject) => {
        for (var fileData of FileNameList) {
            for (var fileAll of fileData.FileList) {
                let FileDataJson = {
                    Folder: fileData.Folder,
                    File: fileAll,
                    LoggerMain: fileData.LoggerMain
                };

                try {
                    FileDataJson.Text = FileUtil.GetFileText(fileData.Path + '/' + fileAll);
                    FileTextArray.push(FileDataJson);
                } catch (err) {
                    return reject(err);
                }

            }
        }
        return resolve(FileTextArray);
    });
};

const InsertDataLogger = async (ListJson, callback) => {

    /**
     * check empty 
     * if empty return true
     * not empty return false
     */
    const isEmpty = function (value) {
        if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
            return true;
        } else {
            return false;
        }
    };

    const Delay = async () => {
        return new Promise(resole => setTimeout(resole, 500));
    };
    var ReturnJson = {};
    var NameReturnJson = {};
    var LoggerInfoReturnJson = {};
    for (var fileName of ListJson) {
        let InsertDataList = new Array();
        //check Logger Name Value flag
        LoggerInfoReturnJson = fileName.LoggerMain;
        var NameFlag = 0;
        console.log('File Name ::: ', fileName);
        var InsertDataJson = {
            getFileName: fileName.File,
            LoggerMainInfoIndex: fileName.LoggerMain._id,
        };
        let LoggerNameValue;
        for (var fileData of fileName.Text) {
            //console.log('Count flag = ', NameFlag);
            //check Logger Name Value
            if (NameFlag == 0) {
                var NameJson = {
                    folderName: fileName.Folder,
                    LoggerMain: fileName.LoggerMain,
                    fullNameData: fileData,
                    LoggerMainInfoIndex: fileName.LoggerMain._id
                };
                //Checking Logger Name Schema 
                LoggerDao.CheckLoggerName(NameJson).then(checkName => {
                    if (checkName == null) {
                        //console.log('insert flag = ', NameFlag);
                        LoggerDao.InsertLoggerName(NameJson).then(NameResult => {
                            //Setting Logger Main Info 
                            fileName.LoggerMain.LoggerName = NameResult._id;
                            //InsertDataJson.LoggerNameIndex = NameResult._id;
                            NameReturnJson = NameResult;
                            LoggerNameValue = NameResult;
                            //Update Logger Main Info add Logger Name
                            LoggerDao.updateNameInfo(fileName.LoggerMain).then(InfoUpdateResult => {
                                console.log('update User Info ::: ', InfoUpdateResult);
                            }).catch(err => {
                                return callback(err, null);
                            });
                        }).catch(err => {
                            return callback(err, null);
                        });
                    } else {
                        // Setting Logger Name Schema 
                        InsertDataJson.LoggerNameIndex = checkName._id;
                        NameReturnJson = checkName;
                        LoggerNameValue = checkName;

                    }
                }).catch(err => {
                    return callback(err, null);
                });
                //Insert Logger Data 
            } else {
                //console.log("Make Data ::: ", fileData);
                //console.log('logger name result ::: ', LoggerNameValue);
                var InsertDataJson = {
                    getFileName: fileName.File,
                    LoggerMainInfoIndex: fileName.LoggerMain._id,
                    fullValueData: fileData,
                    LoggerNameIndex: LoggerNameValue._id
                };
                //InsertDataJson.fullValueData = fileData;
                LoggerDao.CheckLoggerData(InsertDataJson.getFileName).then(CheckDataResult => {
                    if (CheckDataResult == null) {
                        console.log("insert Data Json ::: ", InsertDataJson);
                        if (!isEmpty(InsertDataJson.fullValueData)) {
                            console.log('insert logger data');
                            InsertDataList.push(InsertDataJson);
                        }
                    }
                }).catch(err => {
                    return callback(err, null);
                })
            }
            NameFlag++;
            await Delay();
        }
        //done check name schema and make file data Make json 
        if (InsertDataList.length != 0) {
            var ArrayData = new Array();
            LoggerDao.InsertLoggerDataArray(InsertDataList).then(DataResult => {
                //console.log('insert array _id ::: ', DataResult.ArrayObject);
                if (NameReturnJson.LoggerData.length == 0) {
                    //NameReturnJson.LoggerData = (DataResult.ArrayObject);
                    ArrayData = DataResult.ArrayObject;

                } else {
                    ArrayData = NameReturnJson.LoggerData.concat(DataResult.ArrayObject);


                    //NameReturnJson.LoggerData.concat(DataResult.ArrayObject);
                }
                NameReturnJson.LoggerData = ArrayData;
                //console.log('get logger data array ::: ', ArrayData);
                //console.log('Checking Name Logger Data ::: ', NameReturnJson.LoggerData);
                //console.log('NameReturnJson ::: ', NameReturnJson);

                LoggerDao.updateDataInfo(LoggerInfoReturnJson, ArrayData).then(InfoResult => {
                    //console.log('update Logger Info Update ::: ', InfoResult);
                    LoggerDao.updateDateName(NameReturnJson, ArrayData).then(updateNameResult => {
                        //console.log('update Data Name In Data :::: ', updateNameResult);
                    }).catch(err => {
                        return callback(err, null);
                    });

                }).catch(err => {
                    return callback(err, null);
                });

            }).catch(err => {
                return callback(err, null);
            });
        }
        await Delay();
    }
    console.log('done');
    return callback(null, 'done');
};

module.exports = {
    CheckLoggerInfoArray,
    GetFileList,
    GetAllText,
    InsertDataLogger,

};