const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_database');
const LoggerInfoDao = require('./dao/mongoose/logger/logger.dao');
const LoggerCtrl = require('./ctrl/logger.ctrl');
const LoggerSampleCtrl = require('./ctrl/logger.ctrl.sample');
const FileUtil = require('./util/get.file.type');
const mainFTPFolder = process.cwd() + '/../sampleData';

SampleTest = () => {
    let getFolderName = FileUtil.GetFolderInfo(mainFTPFolder);
    LoggerSampleCtrl.CheckLoggerInfoArray(getFolderName).then(result => {

        let checkArray = new Array();
        for (var checkList of result) {
            let FileJson = {
                FileName: checkList.FolderName
            };
            if (checkList.resultValue != 0) {
                FileJson.Path = mainFTPFolder + '/' + checkList.FolderName;
                FileJson.LoggerMain = checkList.resultValue;
                checkArray.push(FileJson);
            }
        }
        LoggerSampleCtrl.GetFileList(checkArray).then(FileListArrayResult => {
            //console.log(FileListArrayResult);
            LoggerSampleCtrl.GetAllText(FileListArrayResult).then(DataResult => {
                LoggerSampleCtrl.InsertDataLogger(DataResult, (err, result) => {
                    if (result)
                        process.exit(1);

                    if (err)
                        console.log('Insert Logic error :::: ', err);
                });
                //checking file name have or not data logger
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    });
};


SampleTest();



//process.exit(1);