const fs = require('fs');


/** Get File Data */
const FileRaw = (file) => {
    try {
        let _ReadFile = fs.readFileSync(file, { encoding: 'utf-8' });
        let ReadFile = _ReadFile.split('\r\n');
        return ReadFile;
    } catch (err) {
        console.log('file Read Error code ::: ', err.code);
        console.log('file Read Error ::: ', err);
        return null;
    }
}

module.exports = {

};