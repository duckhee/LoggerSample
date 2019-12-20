const dw = require('dir_watchdog');
/** Dir config */
const config = require('../config/config.json').WatchDog;

/** File */
const GetFile = require('../File/file.ctrl');
/** Dao */
const _Dao = require('../DataBase/index.dao');
const Dao = _Dao();

/** Check File Size and Check File Type(Format)  */
const _SizeCheck = (ret, files, dirs) => {
    let _Return = [];
    console.log('file array length : ', files);
    return new Promise((resolve, reject) => {
        if (ret == "create") {
            if (files.length > 0) {
                for (let i in files) {
                    let size = GetFile.FileStat(files[i]).size;
                    if (size == 0) {
                        console.log('file Not');
                    } else {
                        let Format = GetFile.GetFormat(files[i]);
                        if (GetFile.CheckType(Format))
                            _Return.push(files[i]);
                    }
                }
                if (_Return.length > 0)
                    return resolve(_Return);
                return reject("_SizeCheck");
            }
        }
        if (ret == "change") {
            let Cfiles = files.cur;
            if (Cfiles.length > 0) {
                for (let i in Cfiles) {
                    let size = GetFile.FileStat(Cfiles[i]).size;
                    if (size == 0) {
                        console.log('file Not');
                    } else {
                        let Format = GetFile.GetFormat(Cfiles[i]);
                        if (GetFile.CheckType(Format))
                            _Return.push(Cfiles[i]);
                    }
                }
                if (_Return.length > 0)
                    return resolve(_Return);
                return reject("_SizeCheck");
            }
        }
        return reject("_SizeCheck");
    });
};

/** Check Dirs Last Path */
const _DirsCheck = (ret, files, DatabaseDirs) => {
    let _Return = [];
    return new Promise((resolve, reject) => {
        if (ret == "create") {
            for (let i = 0; i < DatabaseDirs.length; i++) {
                for (let j = 0; j < files.length; j++) {
                    console.log("Last Dir : " + GetFile.LastFileDirs(files[j]) + ", Database Check : " + DatabaseDirs[i].FTPFolder)
                    if (GetFile.PathCheck(GetFile.LastFileDirs(files[j]), DatabaseDirs[i].FTPFolder)) {
                        DatabaseDirs[i].Insert = files[j];
                        _Return.push(DatabaseDirs[i]);
                    }
                }
            }
            if (_Return.length > 0) {
                return resolve(_Return);
            }
            return reject("_DirsCheck");
        }
        if (ret == "change") {
            let _files = files.cur;
            for (let i = 0; i < DatabaseDirs.length; i++) {
                for (let j = 0; j < _files.length; j++) {
                    console.log('Data : ', GetFile.LastFileDirs(_files[j]) + 'DB : ' + DatabaseDirs[i].FTPFolder);
                    if (GetFile.PathCheck(GetFile.LastFileDirs(_files[j]), DatabaseDirs[i].FTPFolder)) {
                        DatabaseDirs[i].Insert = _files[j];
                        _Return.push(DatabaseDirs[i]);
                    }
                }
            }
            if (_Return.length > 0) {
                return resolve(_Return);
            }
            return reject("_DirsCheck");
        }
        return reject("_DirsCheck");
    });
};

/** Database check and Insert  */
const _InsertDB = (_Insert) => {
    console.log("INSERT DB FUNCTION", _Insert.length);
    let CheckDao = Dao.CheckNameDB();
    return new Promise((resolve, reject) => {
        if (_Insert.length > 0) {
            for (let i = 0; i < _Insert.length; i++) {

                if (_Insert[i].DeviceType) {
                    console.log("LANGTH : " + _Insert.length + ', _Insert[' + i + '].DeviceType', _Insert[i].DeviceType);
                    CheckDao[_Insert[i].DeviceType](_Insert[i].id).then(result => {
                        /** HAVE NAME COLUMNS */
                        if (result.length > 0) {
                            /** Get Database Insert data device Type */
                            let _DB = Dao.RawInsert("data", _Insert[i].DeviceType);
                            _DB(_Insert).then(result => {
                                console.log("INSERT RESULT : ", result);
                                return resolve(true);
                            }).catch(err => {
                                console.log("ERROR INSERT DB");
                                return reject(err);
                            });
                        }
                        /** NOT HAVE NAME COLUMNS */
                        if (result.length == 0) {

                        }
                        return reject("_InsertDB");
                    }).catch(err => {
                        console.log(err);
                        return reject("_InsertDB");
                    });
                } else {
                    console.log('NOT TYPE : ', _Insert[i].DeviceType);
                }
            }
        } else {

            return reject("_InsertDB");
        }
    });
};

/** Read File And Insert */
const _ReadInsert = (_Insert) => {
    let _Return = [];
    return new Promise((resolve, reject) => {
        if (_Insert.length > 0) {
            for (let i = 0; i < _Insert.length; i++) {
                let format = GetFile.GetFormat(_Insert[i].Insert);
                let names = GetFile.Raw(_Insert[i].Insert, "name", format);
                _Insert.nameColumns = names;
                let data = GetFile.Raw(_Insert[i].Insert, "data", format);
                _Insert.dataColumns = data;
                console.log('test : ', _Insert.length);
                _InsertDB(_Insert).then(_InsertResult => {
                    console.log(" INSERT DB : ", _InsertResult);
                }).catch(err => {
                    console.log("INSERT DB ERROR UP");
                    return reject(err);
                });
            }
            if (_Return.length > 0) {
                console.log('ERROR');
                return resolve(_Return);
            }
            console.log("RETURN VALUE : ", _Return);
            return reject("_ReadInsert");
        }
        return reject("_ReadInsert");
    });
};

/** Select watchdog file type */
const _SelectCase = (ret, files, dirs) => {
    switch (ret) {
        case "init":
            break;
            /** Only need create, change case */
        case "create":

            //break;
        case "change":
            ShowLog(ret, files, dirs);
            _SizeCheck(ret, files, dirs).then(_ConfirmFiles => {
                console.log('Size and extend Check Array : ', _ConfirmFiles);
                Dao.InitCheck().then(_result => {
                    console.log(_result);
                    _DirsCheck(ret, files, _result).then(_PathCheck => {
                        console.log('Path Check : ', _PathCheck);
                        console.log('Path Check : ', _PathCheck.length);
                        _ReadInsert(_PathCheck).then(result => {
                            console.log(result);

                        }).catch(err => {
                            console.log(err);
                            console.log("INSERT ERROR");
                        });
                    }).catch(err => {
                        console.log('NOT MATCH DATABASE AND FILE PATH');
                    });
                }).catch(err => {
                    console.log('DATABASE ERROR');
                });
            }).catch(err => {
                console.log('NOT HAVE FILE SIZE OR RIGHT FILE TYPE');
            });
            break;
        case "delete":
            break;
        default:
            break;
    }
};
/** Start Function */
const _Init = () => {
    return dw.watchdog(config, (ret, files, dirs) => {
        _SelectCase(ret, files, dirs);
    });
};


/** Show File Or Dir check  */
const ShowLog = (ret, files, dirs) => {
    let tmp = `case is ${ret} ! ${ dirs.length > 0 ? "\r\n - dirs:"+dirs: "" } ${files.length > 0 ? "\r\n - files : "+files : ""}`;
    console.log(tmp);
};

/** Export Module */
module.exports = _Init;