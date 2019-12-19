/**
 * Database Code
 * 
 * 디바이스 FTP 경로 확인
 * data Insert
 */

const mysql = require('mysql');
const mysql2 = require('mysql2');

/** Database Config */
const config = require('./config.json');
/** Make Pool */
const pool = mysql2.createPool(config);
/** Module check function */
const DBCheck = () => {
    pool.getConnection(function(err, con) {
        if (err) {
            console.log('error : ', err.code);
            if (con) {
                con.release();
            }
            return null;
        }
        con.query('select * from devices', function(err, res, fields) {
            if (err) {
                console.log('error : ', err.code);
                con.release();
                return null;
            }
            console.log("result : ", res[0]);
            con.release();

            return res;
        });
    });
};

const FTPPath = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                if (con) {
                    con.release();
                }
                console.log('Database Get FTP path Error code ::: ', err.code);
                console.log('Database Get FTP path Error ::: ', err);
                return reject(err);
            }
            con.query('select id, DeviceType, FTPFolder from devices', (err, result, fileds) => {
                if (err) {
                    con.release();
                    console.log("Database Get FTP Path Query Error code ::: ", err.code);
                    console.log("Database Get FTP Path Query Error ::: ", err);
                    return reject(err);
                }
                con.release();
                return resolve(result);
            });
        });
    });
};

/** Check Name Column */
const ConfirmNameDB = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                if (con) {
                    con.release();
                }
                console.log("Confirm ")
            }
        });
    });
};

/** Insert Data Names */
const InsertNameDB = (Insert) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                if (con) {
                    con.release();
                }
                console.log("Database Insert Device Name Error code ::: ", err.code);
                console.log("Database Insert Device Name Error ::: ", err);
                return reject(err);
            }
            con.query('insert into DeviceColumns(deviceIdx, columns) values(?, ?)', Insert.id, Insert.data, (err, result, fields) => {
                if (err) {
                    con.release();
                    console.log("Database Insert Device Name Query Error code ::: ", err.code);
                    console.log("Database Insert Device Name Query Error ::: ", err);
                    return reject(err);
                }
                con.release();
                return resolve(result);
            });
        });
    });
};

/** Insert Data Values */
const InsertDataDB = (Insert) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                if (con) {
                    con.release();
                }
                console.log("Database Insert Device Value Error code ::: ", err.code);
                console.log("Database Insert Device Value Error code ::: ", err.code);
                return reject(err);
            }
            con.query('insert into DeviceColumnData(deviceIdx, columnValue) values(?, ?', Insert.id, Insert.data, (err, result, fields) => {
                if (err) {
                    con.release();
                    console.log("Database Insert Device Value Query Error code ::: ", err.code);
                    console.log("Database Insert Device Value Query Error code ::: ", err.code);
                    return reject(err);
                }
                con.release();
                return resolve(result);
            });
        });
    });
};

/** Insert DataLogger */
const InsertLoggerDB = (Insert) => {
    return new Promise((resolve, reject) => {

    });
};

/** Insert Ecolog */
const InsertEcologDB = (Insert) => {
    return new Promise((resolve, reject) => {

    });
};

/** Insert HikVision */
const InsertHikVisionDB = (Insert) => {
    return new Promise((resolve, reject) => {

    });
};

/** Insert Data */
const InsertDataRaw = (Insert) => {
    let ReturnJson = {
        "DataTracker": InsertLoggerDB(Insert),
        "ecolog": InsertEcologDB(Insert),
        "HikVision": InsertHikVisionDB(Insert)
    };
    return ReturnJson;
};

const InsertNameLoggerDB = (Insert) => {
    return new Promise((resolve, reject) => {

    });
};

const InsertNameEcologDB = (Insert) => {
    return new Promise((resolve, reject) => {

    });
};

const InsertNameHikVisionDB = (Insert) => {
    return new Promise((resolve, reject) => {

    });
};


/** Insert Name */
const InsertNameRaw = (Insert) => {
    let ReturnJson = {
        "DataTracker": InsertNameLoggerDB(Insert),
        "ecolog": InsertNameEcologDB(Insert),
        //"HikVision": InsertNameHikVisionDB(Insert)
    };
    return ReturnJson;
};

module.exports = {
    DBCheck,
    FTPPath,
    InsertDataDB,
    InsertDataRaw
};