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


test = () => {

    let getFolderName = FileUtil.GetFolderInfo(mainFTPFolder);
    console.log('get ftp device num ::::', getFolderName.length);
    //device check and for need to for 
    let getFileList = FileUtil.GetFileList(mainFTPFolder + '/' + getFolderName[0]);
    var i = 0;
    //get file list for
    const text = `get getFolderName[${i}] ::: ${getFileList[i]}`;
    console.log(text);
    console.log(getFileList);
    console.log('testing start');

    //let GetFilePath = mainFTPFolder + '/' + getFolderName[0] + '/' + getFileList[0];
    getFileList.forEach((element) => {
        console.log('Testing ForEach :::${element}', element);
    });
    for (var k of getFileList) {
        console.log('for of ', k);
    }
    //start testing code 
    //get insert data for
    for (var k of getFileList) {
        let fileName = k;
        console.log('get file list array set :::: ', k);
        let GetFilePath = mainFTPFolder + '/' + getFolderName[0] + '/' + k;
        let getTestData = FileUtil.GetFileText(GetFilePath);
        //console.log('get read file :::: ', getTestData);

        console.log('get database testing folder name ::: ', getFolderName[0]);
        //get folder name and get registe or not database check logic start
        LoggerCtrl.checkDataBaseRegiste(getFolderName[0]).then(result => {
            //console.log('check Data Base Registe ::: ', result);
            let getTestData = FileUtil.GetFileText(GetFilePath);
            let InsertInfo = {
                LoggerInfoIndex: result._id,
                TestData: getTestData,
                LoggerInfoValue: result,
                LoggerFolder: getFolderName[0]
            };
            InsertInfo.getFileName = fileName;

            // result.LoggerName.push();
            //console.log(getTestData);
            console.log('testing insert data logger before ::: ', InsertInfo.getFileName);
            LoggerCtrl.InsertDataLogger(InsertInfo).then(result => {
                console.log('testing123 + ', k);
                console.log(getFileList[getFileList.length - 1]);
                //process.exit(1);
                if (k == getFileList[getFileList.length - 1]) {
                    console.log('done', result);
                    process.exit(1);
                }
            }).catch(err => {


                if (err.code == -5) {
                    console.log('not match logger data make do');
                    //process.exit(1);
                } else {
                    console.log('inset data logger error ::: ', err);
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

};

SampleTest();

//test();


//process.exit(1);