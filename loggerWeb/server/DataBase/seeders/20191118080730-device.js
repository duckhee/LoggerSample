'use strict';

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
        let DumpData = [];
        let DumpTime = new Date();
        for (let i = 0; i < 100; i++) {
            let obj = {
                name: 'TestingDataLogger' + 0,
                PlotIdx: 1,
                Latitude: 0,
                Longitude: 0,
                DeviceType: 'DataTracker',
                createdAt: DumpTime,
                updatedAt: DumpTime
            };
            DumpData.push(obj);
        }
        return queryInterface.bulkInsert('devices', DumpData, {});
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