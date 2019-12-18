/**
 * File 생성 확인 프로그램
 * 
 * Root Path 설정
 * 폴더의 depth 설정
 * 파일 확장자 거르기
 * Database Insert
 */

const dw = require('dir_watchdog');
/** File module */
const fs = require('fs');
const path = require('path');
/** Get Database */
const Dao = require('./database/mysql/db');
/** File Function */
const GetFile = require('./file/file');

/** FTP Root Path */
//const RootFTP = process.cwd() + "../Cloud";
//const RootFTP =  "./Cloud";
const RootFTP = process.cwd() + "/test/";

/** Log File Path */
const LogFile = process.cwd() + '.log.txt';


/** WatchDog Options */
const option = new Object();
option.rootpath = "./test";
option.timer = 1000;

let fData = GetFile.FileRaw(process.cwd() + '/test/111');
console.log("File Data : ", fData + ", length : " + fData.length);

/** Watch Dog Program */
dw.watchdog(option, function(ret, files, dirs) {
    B: switch (ret) {
        case "init":
            showlog(ret, files, dirs);
            break;




            /** Create file or Dir Check */
        case "create":
            for (let i in files) {
                let getSize = GetFile.FileStat(files[i]).size;
                if (getSize == 0) {
                    console.log('File Size 0');
                    break B;
                }
            }

            console.log('root : ', RootFTP);
            console.log('file Type : ', files.length);
            let FileNameStart = files[0].lastIndexOf('/');
            let FileName = files[0].substring(FileNameStart + 1, files[0].length);
            let lastFilepath = files[0].substring(RootFTP.length, FileNameStart);
            console.log("Last Path : " + lastFilepath + ", " + FileName);


            //TODO
            /** File Type Not Setting */
            /*
                        if (files.length != 1) {
                            for (let i in files) {
                                if (!ConfirmFormat(files[i])) {
                                    console.log('not file');
                                    break;
                                }
                            }
                        } else {
                            if (!ConfirmFormat(files[0])) {
                                console.log('not file');
                                break;
                            }
                        }
            */
            //TODO
            /** Get Device FTP Path and Type */
            Dao.FTPPath().then(result => {
                if (files.length == 1) {
                    PathConfirm(lastFilepath, result).then(result => {
                        if (result) {
                            console.log(files);

                            console.log('right device Info : ', result);
                        } else {
                            console.log('not Match');
                        }
                    });
                } else {
                    for (let i = 0; i < files.length; i++) {
                        //TODO
                        /** Get File Last Path */
                        lastFilepath = files[i].substring(RootFTP.length, FileNameStart);
                        /** Path Check watchdog file and database FTP Path */
                        PathConfirm(lastFilepath, result).then(result => {
                            if (result) {
                                console.log('file : ', files[i]);
                                console.log('right device Info : ', result);
                            } else {
                                console.log('not Match');
                            }
                        });
                    }
                }
            }).catch(err => {
                console.log('err');
            });
            showlog(ret, files, dirs);
            break;



            /** Delete file or Dir  */
        case "delete":
            showlog(ret, files, dirs);
            break;
            /** Chang file Or Dir */
        case "change":
            showlog(ret, files, dirs);
            break;
        default:
            break;
    }
});

/** Function Get File Path Check */
function PathConfirm(filePath, result) {
    return new Promise((resolve, reject) => {
        if (result.length != 1) {
            for (let i = 0; i < result.length; i++) {
                if (filePath == result[i].FTPFolder) {
                    return resolve(result[i]);
                } else {
                    return resolve(null);
                }
            }
        } else {
            return resolve(null);
        }
    });
}

function showlog(ret, files, dirs) {
    console.log(ret);
    console.log("=====files=====");
    console.log(files);
    console.log("=====directories=====");
    console.log(dirs);
}

/** Make Log file */
function log(command, ret, files, dirs, device) {
    /** Log Template */
    let LogTemplate = `[${command}]-${LogTime} : ${FileName}`;

}

/** Data Check */
function ConfirmFormat(files) {
    let _FileType = files.lastIndexOf('.');

    if (_FileType != -1) {
        let FileType = files.substring(_FileType, files.length);
        return FileType;
    }
    return null;

}

/** DataBase Inert */
function InsertDB(files, result) {

}