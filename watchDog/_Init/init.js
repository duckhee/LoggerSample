const dw = require('dir_watchdog');
/** All Config file */
const _config = require('../config/config.json');
/** Dir config */
const WatchDogConfig = _config.WatchDog;

/** File */
const GetFile = require('../File/file.ctrl');

/** SEQUELIZE DAO */
const _SDao = require('../DataBase/sequelize/Dao/index.dao');
const SDao = _SDao();

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
                        DatabaseDirs[i].Insert = "" + files[j];
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

/** Insert DataBase */
const _Insert = (_Data) => {
    console.log("Insert DataBase");
    return new Promise((resolve, reject) => {
        if (_Data.length > 0) {
            for (let i = 0; i < _Data.length; i++) {
                //TODO Make Json Type
                if (_Data[i].DeviceType == "DataTracker") {

                } else if (_Data[i].DeviceType == "ecolog") {

                } else if (_Data[i].DeviceType == "HikVision") {

                } else {
                    return reject("Not Support Device Type(_Insert Function)");
                }
            }
        } else {
            return reject("Not Have Data (_Insert Function)");
        }
    });
};

/** Database Check and Insert */
const _SInsertDB = (_Insert) => {
    console.log("INSERT DB FUNCTION", _Insert.length);
    let _NameCheck = SDao.CheckNameColumns();
    /*console.log("NAME CHECK : ", _NameCheck);
    console.log("_Insert Data : ", _Insert);*/
    return new Promise((resolve, reject) => {
        if (_Insert.length > 0) {
            for (let i = 0; i < _Insert.length; i++) {
                //console.log("DEVICE TYPE : ", _Insert[i].DeviceType);
                /** Insert DB DataTracker */
                if (_Insert[i].DeviceType == "DataTracker") {
                    let _CheckDevice = SDao.CheckDeviceType();
                    //console.log("LENGTH : " + _Insert.length + ', _Insert[' + i + '].DeviceType', _Insert[i].DeviceType);
                    /**DataTracker Check  Get Id */
                    _CheckDevice[_Insert[i].DeviceType](_Insert).then(CheckDevice => {
                        console.log("Check Device : ", CheckDevice);
                        _Insert.DataTrackerId = CheckDevice[0].id;
                        _NameCheck[_Insert[i].DeviceType](_Insert).then(_NameCheckResult => {
                            console.log("NAME CHECK RESULT : ", _NameCheckResult);
                            /** HAVE NAME COLUMNS */
                            if (_NameCheckResult.length > 0) {
                                /** INSERT DATA COLUMNS */
                                let _DataInsert = SDao.InsertDataColumns();
                                _DataInsert[_Insert[i].DeviceType](_Insert).then(_InsertResult => {
                                    console.log("SUCCESS : ", _InsertResult);
                                    return resolve(_InsertResult);
                                }).catch(err => {
                                    return reject(err);
                                });
                            }
                            /** NOT HAVE NAME COLUMNS */
                            if (_NameCheckResult.length == 0) {
                                /** INSERT NAME COLUMN AND DATA COLUMNS */
                                let _NameInsert = SDao.InsertNameColumns();
                                //console.log('NAME INSERT DATA : ', _Insert);
                                _NameInsert[_Insert[i].DeviceType](_Insert).then(_InsertNameResult => {
                                    let _DataInsert = SDao.InsertDataColumns();
                                    _DataInsert[_Insert[i].DeviceType](_Insert).then(_InsertResult => {
                                        //console.log("SUCCESS : ", _InsertResult);
                                        return resolve(_InsertResult);
                                    }).catch(err => {
                                        return reject(err);
                                    });
                                }).catch(err => {
                                    console.log("_NameInsert ERROR ", err);
                                    return reject(err);
                                });
                            }
                            return reject("_SInsertDB");
                        }).catch(err => {
                            return reject(err);
                        });
                    });
                    /** Insert DB Hikvision */
                } else if (_Insert[i].DeviceType == "HikVision") {
                    //console.log("IMAGE");
                    //console.log("INSERT DATA : ", _Insert);
                    /** Insert DB Ecolg */
                } else if (_Insert[i].DeviceType == "ecolog") {
                    console.log("Insert Data : ", i);
                    /** Insert Data Get Function */
                    let _DataInsert = SDao.InsertDataColumns();
                    let _DeviceType = SDao.CheckDeviceType();
                    _DeviceType[_Insert[i].DeviceType](_Insert).then(ecologResult => {
                        console.log("device value Check : ", ecologResult[0].id);
                        _Insert.ecologId = ecologResult[0].id;
                        _DataInsert[_Insert[i].DeviceType](_Insert).then(_InsertResult => {
                            console.log("SUCCESS : ");
                            return resolve(_InsertResult);
                        }).catch(err => {
                            return reject(err);
                        });
                        return reject("_SInsertDB");
                    }).catch(err => {
                        console.log('Error ::: ', err);
                        return reject("_SInsertDB");
                    });
                }
            }
        } else {
            return reject("_SInsertDB");
        }
    });
};

/** Read File And Insert */
const _ReadInsert = (_Insert) => {
    let _Return = [];
    return new Promise((resolve, reject) => {
        console.log("_INSERT : ", _Insert[0].DeviceType);

        if (_Insert.length > 0) {

            for (let i = 0; i < _Insert.length; i++) {
                console.log('Insert ReadInsert Value : ', _Insert[i]);
                let format = GetFile.GetFormat(_Insert[i].Insert);
                let names = GetFile.Raw(_Insert[i].Insert, "name", format);
                _Insert.nameColumns = names;
                let data = GetFile.Raw(_Insert[i].Insert, "data", format);
                _Insert.dataColumns = data;
                //console.log('test : ', _Insert.dataColumns);
                _SInsertDB(_Insert).then(_InsertResult => {
                    console.log(" INSERT DB : ", _InsertResult);
                    return resolve(_InsertResult);
                }).catch(err => {
                    console.log("INSERT DB ERROR UP : ", err);
                    return reject(err);
                });

            }

            if (_Return.length > 0) {
                console.log('ERROR');
                return resolve(_Return);
            }
            //return resolve(_Return);
            //console.log("RETURN VALUE : ", _Return);
            //return reject("_ReadInsert");
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
            /** DEVICE CHECK SIZE, TYPE, INSERT  */
            _SizeCheck(ret, files, dirs).then(_ConfirmFiles => {
                console.log('Size and extend Check Array : ', _ConfirmFiles);
                /** USE SEQUELIZE */
                /** Check Device have return Device Database Value */
                SDao.CheckDevice().then(_DeviceResult => {
                    /** DIR CHECK */
                    /** Check Dir Path Right or False in Database */
                    console.log('get Device FTP Folder : ', _DeviceResult);
                    _DirsCheck(ret, files, _DeviceResult).then(_DirResult => {
                        //console.log("DIR RESULT : ", _DirResult.length);
                        _ReadInsert(_DirResult).then(_ReadResult => {
                            console.log("READ INSERT RESULT : ", _ReadResult);
                        }).catch(err => {
                            console.log("READ INSERT ERROR : ", err);
                        })
                    }).catch(err => {
                        console.log("DIR CHECK ERROR : ", err);
                    });
                }).catch(err => {
                    console.log("DEVICE CHECK ERROR : ", err);
                });


            }).catch(err => {
                console.log("ERROR :: ", err);
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

    return dw.watchdog(WatchDogConfig, (ret, files, dirs) => {
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