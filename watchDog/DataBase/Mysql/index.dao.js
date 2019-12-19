const mysql = require('mysql2');
const config = require('../../config/config.json');

/** Make Pool Connection */
const pool = mysql.createPool(config.DataBase);

/** Get Check Data Path, Device Type, Idx */
const InitCheck = () => {
    return new Promise((resolve, reject) => {
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

const DataTrackerNameDB = (_Insert) => {

};

const EcoLogNameDB = (_Insert) => {

};


/** Insert Name Column */
const InsertNameDB = (_Insert) => {
    let ReturnJson = {
        "DataTracker": DataTrackerNameDB(_Insert),
        "ecolog": EcoLogNameDB(_Insert)
    };
    return ReturnJson;
};

const DataTrackerValueDB = (_Insert) => {

};

const EcoLogValueDB = (_Insert) => {

};


/** Insert Value Column */
const InsertValueDB = (_Insert) => {
    let ReturnJson = {
        "DataTracker": DataTrackerValueDB(_Insert),
        "ecolog": EcoLogValueDB(_Insert)
    };
    return ReturnJson;
};

module.exports = {
    InitCheck,
    InsertNameDB,
    InsertValueDB
};