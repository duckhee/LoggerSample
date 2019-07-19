const LoggerDao = require('../dao/mongoose/logger/logger.dao.sample');
const FileUtil = require('../util/get.file.type');
const Sync = require('sync');
const mainFTPFolder = process.cwd() + '/../sampleData';

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

const InsertDataLoggerSync = (ListJson) => {

};

const InsertDataLogger = (ListJson) => {

    let InsertCheckFlag;
    let Checking = 0;

    //Testing For Insert Class end
    return new Promise((resolve, reject) => {
        //console.log('total count ::: ', TestClass(ListJson));

        let Count = 0;
        for (var fileName of ListJson) {
            //console.log('Testing First Loop :::: ', fileName);
            console.time('ForSecond');
            for (var fileData of fileName.Text) {
                //console.log('Testing Second Loop :::: ', fileData);
                let NameFlag = 0;

                if (NameFlag == 0) {

                    let NameJson = {
                        folderName: fileName.Folder,
                        LoggerMain: fileName.LoggerMain,
                        fullNameData: fileData,
                        LoggerMainInfoIndex: fileName.LoggerMain._id
                    };
                    console.time('CheckLoggerName');
                    LoggerDao.CheckLoggerName(NameJson).then(CheckName => {
                        //console.log('check logger name find ::: ', CheckName);
                        if (CheckName == null) {
                            LoggerDao.InsertLoggerName(NameJson).then(result => {
                                InsertCheckFlag = true;
                                console.log('insert Logger Name result ::: ', result);
                            }).catch(err => {
                                return reject(err);
                            });
                        }
                    }).catch(err => {
                        return reject(err);
                    });
                    console.timeEnd('CheckLoggerName');
                } else {

                }
                /*
                LoggerDao.InsertLoggerData().then(DataResult => {
                    if (InsertCheckFlag == true) {
                        return resolve(DataResult);
                    }
                }).catch(err => {
                    return reject(err);
                });
                */
                NameFlag++;
                Count++;
                //console.log(InsertCheckFlag)
                //console.log("Count ::: ", Count);


            }
            console.timeEnd('ForSecond');
        }

    });

};

module.exports = {
    CheckLoggerInfoArray,
    GetFileList,
    GetAllText,
    InsertDataLogger,
    InsertDataLoggerSync
};