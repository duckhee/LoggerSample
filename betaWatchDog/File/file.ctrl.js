const fs = require('fs');
const path = require('path');
const _Type = require('../config/config.json').FileType;

/** Log File Path */
const _LogRoot = process.cwd() + '/log/';

/** Get File Stat */
const FileStat = (file) => {
    try {
        let _stat = fs.statSync(file);
        console.log("File Stats : ", _stat);
        return _stat;
    } catch (err) {
        console.log('file Stat Check Error code ::: ', err.code);
        console.log('file Stat Check Error ::: ', err);
        return null;
    }
};

/** Check File Type */
const CheckType = (type) => {
    //console.log('Type : ' + _Type + ", Get : " + type);
    if (_Type[type]) {
        return _Type[type];
    }
    if (type == "BIN")
        return null;
};

/** Get File Name */
const FileName = (_path) => {
    return path.basename(_path);
};

/** Get File Full Dirs */
const FileDirs = (_path) => {
    //console.log('del : ', path.sep);
    return path.dirname(_path);
};

//TODO Check
/** Get File Last Dirs */
const LastFileDirs = (_path) => {
    let _Fpath = path.dirname(_path);
    /** Get os path delimiter */
    let _del = path.sep;
    let _Return;
    let _LIdx = _Fpath.lastIndexOf(_del);
    let _sub = _Fpath.slice(0, _LIdx);
    console.log("Get Sub File Path : ", _sub);
    _Return = _Fpath.slice(_LIdx + 1, _Fpath.length);

    return _Return;
};

//TODO
/** Check FTP Path and Fil Path
 *  Return True False
 */
const PathCheck = (_path, _cPath) => {
    console.log("Path Get : " + _path + "DB Path : " + _cPath);
    let _flag = String(_path).includes(String(_cPath));
    if (_flag == true) {
        return true;
    } else {
        return null;
    }
    //return _path.includes(_cPath);
};

/** Get File Format */
const GetFormat = (_path) => {
    if (!_path) {
        return null;
    }
    let _format = path.extname(String(_path));
    if (_format.length == 0) {
        return null;
    }
    return _format.replace('.', '');
};

/** Get File Data */
const FileRead = (file) => {
    try {
        let read = fs.readFileSync(String(file), { encoding: 'utf-8' });
        return read;
    } catch (err) {
        console.log("File Read Error Code ::: ", err.code);
        console.log("File Read Error Code ::: ", err.code);
        return err;
    }
};

/** Get File Data */
const FileRaw = (file) => {
    try {
        let _ReadFile = fs.readFileSync(String(file), { encoding: 'utf-8' });
        let ReadFile = String(_ReadFile).split('\r\n');
        return ReadFile;
    } catch (err) {
        console.log('file Read Error code ::: ', err.code);
        console.log('file Read Error ::: ', err);
        return null;
    }
};

const RawNameCSV = (file) => {
    let _raw = FileRaw(file);
    return _raw[0];
};

const RawValueCSV = (file) => {
    let _raw = FileRaw(file);
    return _raw.splice(0, 1);
};

const RawCSV = (file, value) => {
    let _raw = FileRaw(file);
    if (value === "name") {
        return _raw[0];
    }
    if (value === "data") {
        _raw.splice(0, 1);
        return _raw;
    }
};

const _MISFileRaw = (file) => {
    try {
        let _ReadFile = fs.readFileSync(String(file), { encoding: 'utf-8' });

    } catch (err) {
        console.log("MIS File Read Error code ::: ", err.code);
        console.log("MIS File Read Error ::: ", err);
        return null;
    }
};



const RowMIS = (file) => {
    try {
        let _ReadFile = fs.readFileSync(String(file), { encoding: 'utf-8' });
        return _ReadFile;
    } catch (err) {
        console.log("File Read Error code ::: ", err.code);
        console.log("File Read Error ::: ", err);
        return null;
    }
};

//TODO 
/** Make EcoLog File DataBase and Parser */
const RawMIS = (file) => {
    /** Read File */
    let _raw = RowMIS(file);
    if (_raw == null) {
        return null;
    } else {
        return _raw;
    }

};


const Raw = (file, value, _type) => {
    if (_type == "csv") {
        return RawCSV(file, value);
    }
    if (_type == "MIS") {
        //console.log("ecolog Type : ", file);
        return RawMIS(file);
    }
    if (_type = "jpg") {
        return file;
    }
    return null;
};

/** Log File Save */
const Log = (err) => {
    /** Save Log Text */
    let LogTemplate = `\r\nCapture Error ${new Date.now()} - FTP Server Error : ${err.code}\r\n ${err}\r\n`;
    try {
        if (!fs.existsSync(_LogRoot + 'log/')) {
            fs.mkdirSync(_LogRoot + 'log/', 755);
        }
        try {
            let _LogName = _LogRoot + new Date.now() + '.txt';
            fs.writeFileSync(_LogName, LogTemplate, { encoding: 'utf-8' });
        } catch (e) {
            throw new Error("Couldn't Making Log File");
        }
    } catch (e) {
        throw new Error("Couldn't Create Log Folder");
    }
};

module.exports = {
    Log,
    FileStat,
    CheckType,
    FileName,
    FileDirs,
    LastFileDirs,
    PathCheck,
    GetFormat,
    Raw,
    FileRead
};