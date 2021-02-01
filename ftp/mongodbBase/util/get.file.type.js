const SplitType = require("./split.file");

const fs = require('fs');
const fileType = ["MIS", "csv"];

const GetFolderInfo = (MainFolderPath) => {
    let mainFolder = MainFolderPath;
    let checkFolderExist = fs.existsSync(mainFolder);

    if (checkFolderExist) {
        let readFolder = fs.readdirSync(mainFolder);
        console.log('Get Main Folder : ', readFolder);
        return readFolder;
    }
    return null;
}

/**
 * get file list get
 */
const GetFileList = (FolderNamePath) => {
    let LoggerFolder = FolderNamePath;

    if (fs.existsSync(LoggerFolder)) {
        let GetFileList = fs.readdirSync(LoggerFolder);

        return GetFileList;
    }
    return null;

};


const GetFileText = (FilePath) => {
    let readFilePath = FilePath;
    let fileData;
    let checkMine = readFilePath.split('.');
    let mineType = checkMine[checkMine.length - 1];
    if (fs.existsSync(readFilePath)) {
        let GetFile = fs.readFileSync(readFilePath, {
            encoding: 'utf-8'
        });
        if (mineType == 'csv') {
            fileData = SplitType.GetDataCSV(GetFile);
        } else if (mineType == 'MIS') {
            //fileData = GetFile.split('\r\n');
            return GetFile;
        }
        return fileData;
    }
    return null;
};


module.exports = {
    GetFileList,
    GetFolderInfo,
    GetFileText,

};