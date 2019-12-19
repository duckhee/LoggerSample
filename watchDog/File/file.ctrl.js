const fs = require('fs');
const path = require('path');
const _Type = require('../config/config.json').FileType;

/** Log File Path */
const _LogRoot = process.cwd() + '/log/';

/** Get File Stat */
const FileStat = (file) => {
    try {
        let _stat = fs.statSync(file);
        return _stat;
    } catch (err) {
        console.log('file Stat Check Error code ::: ', err.code);
        console.log('file Stat Check Error ::: ', err);
        return null;
    }
};

/** Check File Type */
const CheckType = (type) => {
    console.log('Type : ' + _Type + ", Get : " + type);
    if (_Type[type]) {
        return _Type[type];
    }
    return null;
};

/** Get File Name */
const FileName = (_path) => {
    return path.basename(_path);
};

/** Get File Full Dirs */
const FileDirs = (_path) => {
    return path.dirname(_path);
};

//TODO
/** Check FTP Path and Fil Path
 *  Return True False
 */
const PathCheck = (_path, _cPath) => {
    return String(_path).includes(_cPath);
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
    return _format.replace(',', '');
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

const RawNameMIS = (file) => {

};

const RawValueMIS = (file) => {

};

const RawMIS = (file, value) => {
    let _raw = FileRaw(file);
    if (value == "name") {
        return "NEED TO XML PARSER";
    }
    if (value == "data") {
        return "NEED TO XML PARSER";
    }
    return null;
};

const RawName = (file) => {

};

const RawValue = (file) => {

};

const Raw = (file, value, _type) => {
    if (_type == "csv") {
        return RawCSV(file, value);
    }
    if (_type == "MIS") {
        return RawMIS(file, value);
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
    PathCheck,
    GetFormat,
    Raw
};