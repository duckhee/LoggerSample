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
        this.RootPath = process.cwd() + '/loggerWebLog';
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

    /** Checking Root Log Folder */
    InitCheck() {
        if (!fs.existsSync(RootPath)) {
            try {
                fs.mkdirSync(RootPath);
                return true;
            } catch (e) {
                console.log('make Root Log Path Error code ::: ', err.code);
                console.log('make Root Log Path Error ::: ', err);
                return false;
            }
        }
    }


    /** Save Log Message */
    SaveLog(message) {
        let LogTime = new Date();
        let MsgTemplate = `${LogTime.getFullYear()}-${LogTime.getMonth()+1}-${LogTime.getDate()} ${LogTime.getHours()}:${LogTime.getMinutes}:${LogTime.getSeconds()}  ${name} ${message} \r\n`;
        let FileName = LogTime.getFullYear() + "-" + (LogTime.getMonth() + 1) + '-' + LogTime.getDate() + '_' + LogTime.getHours() + ":" + LogTime.getMinutes();
        if (this.InitCheck()) {
            try {
                fs.writeFileSync(this.RootPath + '/' + FileName, 755, MsgTemplate);
            } catch (err) {
                console.log('make Log File Error ', FileName);
                return false;
            }
            return true;
        } else {
            console.log('Not Save ', MsgTemplate);
            return false;
        }

    }

    /** Logging Start */
    StartLogging(message) {
        if (this.SaveLog(message)) {
            console.log('Make LogFile');
        }
    }
}

module.exports = LoggingError;