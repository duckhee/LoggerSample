'use strict';
/** File Reader Module */
const fs = require('fs');
const DataTrackerSamplePath = process.cwd() + '/SampleData/DataTrackerSample';

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkInsert('People', [{
            name: 'John Doe',
            isBetaMember: false
          }], {});
        */
        /** Sample Folder Data Insert (DataTracker) */
        let DumpDataTracker = [];
        let DumpDataTime = new Date();
        let EcoLogSample = {};
        let DataTrackerFileList = fs.readdirSync(DataTrackerSamplePath);
        DataTrackerFileList.forEach(items => {
            let DataList = DataTrackerSamplePath + '/' + items;
            console.log('File Data List : ' + DataList);
            let RealPath = DataTrackerSamplePath + '/' + items;
            try {
                let FileData = fs.readFileSync(DataList, 'utf-8');
                let SplitData = FileData.split('\r\n');
                let AllDataNumber = SplitData.length;
                let ValueColumns = SplitData.splice(1, AllDataNumber);
                console.log('get Data : ', ValueColumns);
                ValueColumns.forEach(itemValues => {
                    let DataTrackerSample = {
                        deviceIdx: 1,
                        columnValue: itemValues,
                        createdAt: DumpDataTime,
                        updatedAt: DumpDataTime
                    };
                    console.log('data : ', DataTrackerSample);
                    DumpDataTracker.push(DataTrackerSample);
                });
            } catch (err) {
                console.log("Data Get Error :: ", err);
                throw err;
            }
        });
        return queryInterface.bulkInsert('DeviceColumnData', DumpDataTracker);
        /** Sample Folder Data Insert (EcoLog MIS File) */
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
    }
};