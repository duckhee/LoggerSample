const models = require('../loggerWeb/server/DataBase/models/index');
const DeviceColumns = require('../loggerWeb/server/DataBase/models/devicecolumndata');
const DeviceColumnData = require('../loggerWeb/server/DataBase/models/devicecolumndata');

const fs = require('fs');
const RootPath = process.cwd() + "/SampleData" + '/DataTrackerSample';
let fileList = fs.readdirSync(RootPath);

console.log(fileList);

let DumpDataTracker = [];
let DumpDataTrackerName = [];
let DumpDataTrackerValue = [];
let DumpTime = new Date();
/**
 * Testing Device Id : 201
 * 
 */

fileList.forEach(items => {
    try {
        let dataList = RootPath + "/" + items;
        console.log(dataList);
        let fileData = fs.readFileSync(dataList, 'utf-8');
        let DataValues = fileData.split('\r\n');
        let DataName = DataValues[0];
        let AllData = DataValues.splice(1, DataValues.length);
        let AllDataNumber = DataValues.length;
        console.log(fileData);
        console.log('Data Value Line : ', AllDataNumber);
        console.log("Value Name : ", AllData);
        let DumpName = {
            deviceIdx: 201,
            columns: DataName,
            createdAt: DumpTime,
            updatedAt: DumpTime
        };
        AllData.forEach(values => {
            let DumpValue = {
                deviceIdx: 201,
                columnValue: values,
                createdAt: DumpTime,
                updatedAt: DumpTime
            };
            DumpDataTrackerValue.push(DumpValue);
        });
        DumpDataTrackerName.push(DumpName);

        //break;
    } catch (err) {
        console.log('Error ::: ', err);
    }
});

models.DeviceColumns.bulkCreate(DumpDataTrackerName).then(result => {
    console.log('name Success ::: ', result);
    models.DeviceColumnData.bulkCreate(DumpDataTrackerValue).then(result => {
        console.log('value Success ::: ', result);
        process.exit(1);
    }).catch(err => {
        throw err;
    });
}).catch(err => {
    throw err;
});