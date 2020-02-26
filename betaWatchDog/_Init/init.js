/** File Status Check Module */
const dw = require('dir_watchdog');
/** All Config File */
const _config = require('../config/config.json');
/** Dir Config Setting */
const WatchDogConfig = _config.WatchDog;
/** File Controller */
const GetFile = require('../File/file.ctrl');
/** Get Database Function */
const _Dao = require('../DataBase/Dao/index.dao');
const Dao = _Dao();


/** File Size Check */
const SizeCheck = (stat, files, dirs) => {
    let _ReturnValue = [];
    let _files = [];
    return new Promise((resolve, reject) => {
        if (stat == "create") {
            _files = files;
        } else if (stat == "change") {
            _files = files.cur;
        } else {
            let err = new Error("Not Support File Event");
            return reject(err);
        }
        console.log('get files : ', _files);
        for (let i in _files) {
            let size = GetFile.FileStat(_files[i]).size;
            //TODO wait time and 
            if (size === 0) {
                let err = new Error("File Size Zero");
                return reject(err);
            } else {
                let FileFormat = GetFile.GetFormat(_files[i]);
                if (GetFile.CheckType(FileFormat)) {
                    _ReturnValue.push(_files[i]);
                }
            }
        }
        console.log("Return value length : ", _ReturnValue.length);
        return resolve(_ReturnValue);
    });
};

//TODO
/** Check Dirs Path */
const DirPathCheck = (stat, files, dirs) => {
    let _files = [];
    let _return = [];
    return new Promise((resolve, reject) => {
        if (stat == "create") {
            _files = files;
        } else if (stat == "change") {
            _files = files.cur;
        } else {
            let err = new Error("Not Support File Event");
            return reject(err);
        }
        /** Right Set File Check Log Console */
        console.log('file Check : ', _files);
        //TODO Change not good Logic
        for (let i = 0; i < dirs.length; i++) {
            for (let j = 0; j < _files.length; j++) {
                console.log("Get File Paths  For : " + _files[j] + ", FTP Path For : " + dirs[i].FTPFolder);
                if ((GetFile.LastFileDirs(String(_files[j])) === String(dirs[i].FTPFolder))) {
                    console.log('get File Path : ', _files[j] + ", FTP Path : " + String(dirs[i].FTPFolder));
                    dirs[i].Insert = _files[j];
                    console.log('Check files : ', _files[j]);
                    _return.push(dirs[i]);
                }
            }
        }
        if (_return.length > 0) {
            console.log("get path Check : ", _return);
            return resolve(_return);
        }
        return reject("not math");
    });
};

/** Insert Database */
const InsertDB = (_InsertData) => {
    let checkFlag = 0;
    return new Promise((resolve, reject) => {
        if (_InsertData.length <= 0) {
            let err = new Error("Not Insert Data");
            return reject(err);
        }
        for (let i = 0; i < _InsertData.length; i++) {
            let InsertColumns = Dao._Insert();
            /** Interface Make One */
            if (_InsertData[i].DeviceType == "DataTracker") {
                console.log("Device Type : " + _InsertData[i].DeviceType + ", File Number : " + i);
                console.log("Insert Read : " + _InsertData[i].Insert);
            } else if (_InsertData[i].DeviceType == "ecolog") {
                console.log("Device Type : " + _InsertData[i].DeviceType + ", File Number : " + i);
                console.log("Insert Read : " + _InsertData[i].Insert);
            } else if (_InsertData[i].DeviceType == "hikVision") {
                console.log("Device Type : " + _InsertData[i].DeviceType + ", File Number : " + i);
                console.log("Insert Read : " + _InsertData[i].Insert);
            } else {
                let err = new Error("Not Match Support Type");
                return reject(err);
            }

            _InsertData[i].filesRaw = GetFile.FileRead(_InsertData[i].Insert);
            InsertColumns[_InsertData[i].DeviceType](_InsertData[i]).then(result => {
                console.log("Check For : ", checkFlag);
                console.log("Insert DB Check : ", result);
                checkFlag++;
            }).catch(err => {
                return reject(err);
            });
        }
    });
};

/** Read File And Insert */
const ReadFile = (files) => {
    return new Promise((resolve, reject) => {
        if (files.length > 0) {
            //TODO Read File Insert Data
            InsertDB(files).then(result => {
                return resolve(result);
            }).catch(err => {
                return reject(err);
            });
        } else {
            let err = new Error("Not Input File");
            return reject(err);
        }
    });
};

/** Select WatchDog File Event */
const _SelectCase = (stat, files, dirs) => {
    switch (stat) {
        case "init":
            console.log("Data Collector Program Start - " + Date.now().toString());
            break;
        case "create":
        case "change":

            /** Do Insert DataBase Logic Here. */
            FileEventLog(stat, files, dirs);
            /** File Size Check */
            SizeCheck(stat, files, dirs).then(SizeCheckValue => {
                /** Device Check FTP Folder */
                console.log("Get File Size Check Done Value Number : ", SizeCheckValue.length);
                //TODO how to Tunning Database ?
                /** Get DataBase All Registe Device  */
                Dao.GetDeviceType().then(RegisteAllDevice => {
                    //console.log("Get All Registe Device : ", RegisteAllDevice);
                    //TODO how to Tunning Database ?
                    /** Check Directory Registe */
                    DirPathCheck(stat, files, RegisteAllDevice).then(_DirResult => {
                        /** Read File  */
                        console.log("Dir Check : ", _DirResult);
                        ReadFile(_DirResult).then(ReadFiles => {
                            console.log("Selection Done : " + ReadFiles);
                        }).catch(err => {
                            console.log("Read File Function Error Code ::: ", err.code);
                            console.log("Read File Function Error ::: ", err);
                        });
                    }).catch(err => {
                        console.log("Device FTP Path Check Error Code ::: ", err.code);
                        console.log("Device FTP Path Check Error ::: ", err);
                    });
                }).catch(err => {
                    console.log('All Registe Device Get Error Code ::: ', err.code);
                    console.log('All Registe Device Get Error ::: ', err);
                });
            }).catch(err => {
                console.log('Selection Error Code ::: ', err.code);
                console.log('Selection Error ::: ', err);
            });
            break;
        case "delete":
            FileEventLog(stat, files, dirs);
            break;
        default:
            break;
    }
}

/** Init Do */
const _Init = () => {
    return dw.watchdog(WatchDogConfig, (ret, files, dirs) => {
        _SelectCase(ret, files, dirs);

    });
};

/** Log Folder Make */


/** Log File Event Make Function */
const FileEventLog = (ret, files, dirs) => {
    let tmp = `case is ${ret}! ${dirs.length>0?"\r\n-dirs :"+dirs:""} ${files.length>0?"\r\n - files : " + files:""}`;
    console.log(tmp);
};

module.exports = _Init;