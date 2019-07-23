const fs = require('fs');
const mongoose = require('mongoose');
const dbConnection = mongoose.connect('mongodb://localhost/my_database');
const User = require('./MongooseModel/User.model');
const LoggerSampleCtrl = require('./ctrl/logger.ctrl.sample');
const FileUtil = require('./util/get.file.type');
const MainFTPFolder = process.cwd() + '';
//window Sample Path
//let Path = 'c:\/Users\/Administrator\/Documents\/ftp\/test\/SINHEUNG';

SampleProgram = () => {
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

//set Time Val 
SampleProgram();