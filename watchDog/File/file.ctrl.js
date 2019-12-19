const fs = require('fs');
const path = require('path');
const _Type = require('../config/config.json').FileType;


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
    if (_Type[type]) {
        return true;
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

/** Check FTP Path and Fil Path
 *  Return True False
 */
const PathCheck = (_path, _cPath) => {
    return _path.include(_cPath);
};

/** Get File Format */
const GetFormat = (_path) => {
    let _format = path.extname(_path);
    console.log('length : ', _format.length);
    if (_format.length == 0) {
        return null;
    }
    return _format;
};

/** Get File Data */
const FileRaw = (file) => {
    try {
        let _ReadFile = fs.readFileSync(file, { encoding: 'utf-8' });
        let ReadFile = _ReadFile.split('\r\n');
        console.log(ReadFile);
        return ReadFile;
    } catch (err) {
        console.log('file Read Error code ::: ', err.code);
        console.log('file Read Error ::: ', err);
        return null;
    }
};

const RawNameCSV = () => {

};

const RawValueCSV = () => {

};

const RawNameMIS = () => {

};

const RawValueMIS = () => {

};

const RawName = () => {

};

const RawValue = () => {

};

module.exports = {
    FileStat,
    CheckType,
    FileName,
    FileDirs,
    PathCheck,
    GetFormat
};