const mysql = require('mysql2');
const config = require('../../config/config.json');

/** Make Pool Connection */
const pool = mysql.createPool(config.DataBase);

/** Get Check Data Path, Device Type, Idx */
const InitCheck = () => {
    return new Promise((resolve, reject) => {
        console.log('Init Check');
        pool.getConnection((err, con) => {
            if (err) {
                if (con) {
                    con.release();
                }
                console.log("Dao Get Init Data Error code ::: ", err.code);
                console.log("Dao Get Init Data Error ::: ", err);
                return reject(err);
            }
            con.query('select id, DeviceType, FTPFolder from devices', (err, result, fields) => {
                if (err) {
                    con.release();
                    console.log('Dao Get Init Data Query Error code ::: ', err.code);
                    console.log('Dao Get Init Data Query Error ::: ', err);
                    return reject(err);
                }
                con.release();
                return resolve(result);
            });
        });
    });
};

const CheckDataTrackerNameDB = (_Insert) => {
    let stmt = "SELECT id FROM DeviceColumns WHERE deviceIdx=?";
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                if (con) {
                    con.release();
                }
                console.log("Dao Get DataTracker Name Check Error code ::: ", err.code);
                console.log("Dao Get DataTracker Name Check Error ::: ", err);
                return reject(err);
            }
            con.query(stmt, _Insert, (err, result, fields) => {
                if (err) {
                    con.release();
                    console.log("Dao Get DataTracker Name Check Query Error code ::: ", err.code);
                    console.log("Dao Get DataTracker Name Check Query Error ::: ", err);
                    return reject(err);
                }
                con.release();
                return resolve(result);
            });
        });
    });
};

/** Device Name Column Check */
const CheckNameDB = () => {
    let _return = {
        "DataTracker": CheckDataTrackerNameDB
    };
    return _return;
};

/** Data Tracker Name Insert */
const DataTrackerNameDB = (_Insert) => {
    let stmt = "INSERT INTO () VALUES()";
    console.log("INSERT NAME COLUMNS");
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                if (con) {
                    con.release();
                }
                console.log("Dao DataTracker Name Insert Error code ::: ", err.code);
                console.log("Dao DataTracker Name Insert Error ::: ", err);
                return reject(err);
            }
            con.query(stmt, [_Insert.id, _Insert.nameColumns], (err, result, fields) => {
                if (err) {
                    con.release();
                    console.log("Dao DataTracker Name Insert Query Error code ::: ", err.code);
                    console.log("Dao DataTracker Name Insert Query Error ::: ", err);
                    return reject(err);
                }
                con.release();
                return resolve(result);
            });

        });
    });
};

const EcoLogNameDB = (_Insert) => {
    let stmt = "INSERT INTO () VALUES()";
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                if (con) {
                    con.release();
                }
                console.log("Dao EcoLog Name Insert Error code ::: ", err.code);
                console.log("Dao EcoLog Name Insert Error ::: ", err);
                return reject(err);
            }
            con.query(stmt, (err, result, fields) => {
                if (err) {
                    con.release();
                    console.log("Dao EcoLog Name Insert Query Error code ::: ", err.code);
                    console.log("Dao EcoLog Name Insert Query Error ::: ", err);
                    return reject(err);
                }
                con.release();
                return resolve(result);
            });
        });
    });
};


/** Insert Name Column */
const InsertNameDB = (_Insert) => {
    let ReturnJson = {
        "DataTracker": DataTrackerNameDB(_Insert),
        "ecolog": EcoLogNameDB(_Insert)
    };
    return ReturnJson;
};

/** INsert Data Array */
const _MakeData = (_Insert) => {
    return new Promise((resolve, reject) => {

    });
};

const DataTrackerValueDB = (_Insert) => {
    let stmt = "INSERT INTO DeviceColumnData(deviceIdx, columnValue) VALUES(?,?)";
    console.log("INSERT DATA COLUMNS");
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                if (con) {
                    con.release();
                }
                console.log("Dao DataTracker Value Insert Error code ::: ", err.code);
                console.log("Dao DataTracker Value Insert Error ::: ", err);
                return reject(err);
            }
            con.query(stmt, [_Insert.id, _Insert.dataColumns], (err, result, fields) => {
                if (err) {
                    con.release();
                    console.log("Dao DataTracker Value Insert Query Error code ::: ", err.code);
                    console.log("Dao DataTracker Value Insert Query Error ::: ", err);
                    return reject(err);
                }
                con.release();
                return resolve(result);
            });
        });
    });
};

const EcoLogValueDB = (_Insert) => {
    let stmt = "INSERT INTO () VALUES()";
    return new Promise((resolve, reject) => {
        pool.getConnection((err, con) => {
            if (err) {
                if (con) {
                    con.release();
                }
                console.log("Dao EcoLog Value Insert Error code ::: ", err.code);
                console.log("Dao EcoLog Value Insert Error ::: ", err);
                return reject(err);
            }
            con.query(stmt, (err, result, fields) => {
                if (err) {
                    con.release();
                    console.log("Dao EcoLog Value Insert Query Error code ::: ", err.code);
                    console.log("Dao EcoLog Value Insert Query Error ::: ", err);
                    return reject(err);
                }
                con.release();
                return resolve(result);
            });
        });
    });
};


/** Insert Value Column */
const InsertValueDB = (_Insert) => {
    let ReturnJson = {
        "DataTracker": DataTrackerValueDB(_Insert),
        "ecolog": EcoLogValueDB(_Insert)
    };
    return ReturnJson;
};

/** Insert */
const RawInsert = (_type, DeviceType) => {
    if (_type == "name") {
        if (DeviceType == "DataTracker") {
            return DataTrackerNameDB;
        }
        if (DeviceType === "ecolog") {
            return EcoLogNameDB;
        }

        return null;
    }
    if (_type == "data") {

        if (DeviceType === "DataTracker") {
            return DataTrackerValueDB;
        }
        if (DeviceType === "ecolog") {
            return EcoLogValueDB;
        }
        return null;
    }
    return null;


};

module.exports = {
    InitCheck,
    CheckNameDB,
    InsertNameDB,
    InsertValueDB,
    RawInsert
};