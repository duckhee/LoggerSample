const fs = require('fs');


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

/** Get File Data Name */
const RawName = (file) => {
    let Data = FileRaw(file);
    if (Data) {
        return Data[0];
    }
    return null;
};

/** Get File Data */
const RawData = (file) => {
    let Data = FileRaw(file);
    if (Data) {
        return Data.splice(0, 1);
    }
    return null;
};




const GetRawName = (file) => {
    return {

    };
};

const GetRawValue = (file) => {
    return {

    };
};

module.exports = {
    FileRaw,
    FileStat,
    RawName,
    RawData

};