/** Make Error Log File Save  */
const fs = require('fs');

/**
 * 
 * Server Error Show Message
 * @class LoggingError
 */
class LoggingError {
    constructor(name, flag) {
        this.name = name;
        this.flag = flag;
        this.LogFolder = false;
        this.LogFilePath = process.cwd() + '/Log';
        if (!fs.existsSync(process.cwd() + '/Log')) {
            console.log('Not Log Folder Have Create Log Folder');
            fs.mkdirSync(process.cwd() + '/Log');
            this.LogFolder = true;
        } else {
            console.log('Have Log Folder');
            this.LogFolder = true;
        }
    }

    /** Log Show */
    Logging(message) {
        if (this.flag) {
            console.log(`[${name}] ${message}`);
        }
    }

    /** Save Log Message */
    SaveLog(message) {
        let LogTime = new Date();
        let MsgTemplate = `${LogTime.getFullYear()}-${LogTime.getMonth()+1}-${LogTime.getDate()} ${LogTime.getHours()}:${LogTime.getMinutes}:${LogTime.getSeconds()}  ${name} ${message} \r\n`;
        let FileName = LogTime.getFullYear() + "-" + (LogTime.getMonth() + 1) + '-' + LogTime.getDate() + '_' + LogTime.getHours() + ":" + LogTime.getMinutes();

    }
}

module.exports = LoggingError;