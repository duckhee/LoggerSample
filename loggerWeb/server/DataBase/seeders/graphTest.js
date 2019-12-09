const fs = require('fs');
const RootPath = process.cwd() + "/../SampleData" + '/DataTrackerSample';
let fileList = fs.readdirSync(RootPath);

console.log(fileList);

let DumpDataTracker = [];
let DumpDataTrackerName = [];
let DumpDataTrackerValue = [];


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


        //break;
    } catch (err) {
        console.log('Error ::: ', err);
    }
});