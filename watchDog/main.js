const dw = require('dir_watchdog');
/** Dir config */
const config = require('./config/config.json').WatchDog;

/** File */
const GetFile = require('./File/file.ctrl');
/** Dao */
const _Dao = require('./DataBase/index.dao');
const Dao = _Dao();

/** Size Check */
const _ArraySizeCheck = (files) => {
    console.log('size files : ', files);

    let _rArray = [];
    _rArray = files;
    for (let i = 0; i < files.length; i++) {
        let size = GetFile.FileStat(files[i]).size;
        if (size == 0) {
            console.log('file size 0 Name : ', files[i]);
            let _dIdx = files.indexOf(files[i]);
            _rArray.splice(_dIdx, 1);
        }
    }
    if (_rArray.length <= 0) {
        return null;
    }
    return _rArray;
};

/** Insert Data */
const InsertData = (files, result) => {
    check = _ArraySizeCheck(files);
    if (check) {
        let Format = GetFile.GetFormat(files).replace(".", "");
        let Types = GetFile.CheckType(Format);
        /** File Format Check and File Type */
        if (Types) {
            for (let i in result) {
                /**  */
                if (GetFile.PathCheck(GetFile.LastFileDirs(String(files)), result[i].FTPFolder)) {
                    let Names = GetFile.Raw(files, "name", String(Format));
                    console.log('name : ', Names + ", ID : ", result[i]);
                    /*
                    Dao.CheckNameDB(result[i].id, result[i].DeviceType).then(result => {
                        console.log(result);
                        if (result.length == 0) {
                            Dao.RawInsert(Names, "name", result[i].DeviceType).then(result => {
                                Dao.RawInsert(Names, "data", result[i].DeviceType).then(result => {

                                }).catch(err => {

                                });
                            }).catch(err => {

                            });
                        } else {
                            console.log('Have Name Columns');
                            Dao.RawInsert(Names, "data", result[i].DeviceType).then(result => {

                            }).catch(err => {

                            });
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                    */
                }
                /** */
            }
        }
    }
};

/** Array Data */
const _GetArray = (ret, files, dirs) => {
    Dao.InitCheck().then(result => {
        let check;
        console.log(result);
        switch (ret) {
            case "create":
                check = _ArraySizeCheck(files);
                if (check) {

                }
                break;
            case "change":
                check = _ArraySizeCheck(files);
                if (check) {

                }
                break;
        }
    }).catch(err => {
        console.log('Capture DataBase Error : ', err);
    });
};

/** One Data */
const _Get = (ret, files, dirs) => {
    Dao.InitCheck().then(result => {
        let check;
        console.log('_Get DataBase : ', result + ", file : " + files);
        console.log('files Type : ', typeof(files));
        switch (ret) {
            case "create":
                InsertData(files, result);
                break;
            case "change":
                InsertData(files, result);
                break;
        }
    }).catch(err => {
        console.log('Capture DataBase Error : ', err);
    });
};

/**
 * 
 * @param {*} ret ['init', 'create', 'change', 'delete']
 * @param {*} files Array values
 * @param {*} dirs Array values
 */
const _InitDo = (ret, files, dirs) => {
    console.log('files Length : ', files.length);
    if (files.length === undefined) {
        console.log('file is change');
        if (files.cur.length > 1) {
            return _GetArray(ret, files.cur, dirs);
        } else {
            return _Get(ret, files.cur, dirs);
        }
    }
    if (files.length > 1) {
        return _GetArray(ret, files, dirs);
    } else {
        return _Get(ret, files, dirs);
    }

};


/** Start Function */
const Init = () => {
    dw.watchdog(config, (ret, files, dirs) => {
        switch (ret) {
            case "init":
                break;
            case "create":
                /** HikVision Create Do */
                /** Ecolog Create Do */
                _InitDo(ret, files, dirs);
                break;
            case "change":
                /** DataTracker Create Do (Use FileZilla FTP) */
                _InitDo(ret, files, dirs);
                break;
            case "delete":
                break;
            default:
                break;
        }
    });
};

Init();