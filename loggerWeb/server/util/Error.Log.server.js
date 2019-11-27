/**
 * 
 * Server Error Show Message
 * @class LoggingError
 */
class LoggingError {
    constructor(name, flag) {
        this.name = name;
        this.flag = flag;
    }

    /** Log Show */
    Logging(message) {
        if (this.flag) {
            console.log(`[${name}] ${message}`);
        }
    }
}

module.exports = LoggingError;