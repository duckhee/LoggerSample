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
            try {
                let RealPath = DataTrackerSamplePath + '/' + items;
                let FileData = fs.readFileSync(DataList, 'utf-8');
                let SplitData = FileData.split('\r\n');
                let AllDataNumber = SplitData.length;
                let NameColumns = SplitData[0];
                let DataTrackerSample = {
                    deviceIdx: 1,
                    columns: NameColumns,
                    createdAt: DumpDataTime,
                    updatedAt: DumpDataTime
                };
                DumpDataTracker.push(DataTrackerSample);
            } catch (err) {
                console.log("Data Get Error :: ", err);
                throw err;
            }
        });
        return queryInterface.bulkInsert('DeviceColumns', DumpDataTracker);
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