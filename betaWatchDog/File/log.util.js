const fs = require('fs');
/** Root Log File Folder */
const _rootPath = "";


/** Make Log File Folder */
const RootMakeLogFolder = () => {
    try {
        fs.mkdirSync();
    } catch (err) {
        fs.existsSync();
    }
};

/** Log Folder Date */
const MakeLogFolder = () => {

};

/** Create Log File */
const Log = (_err) => {
    let defaultTemp = ``;
};


module.exports = {

};