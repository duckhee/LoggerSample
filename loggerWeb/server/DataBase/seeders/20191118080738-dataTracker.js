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
        let DumpTime = new Date();
        let Dump = [];
        let DataTracker = {
            DeviceIdx: 1,
            DataTrackerIP: '127.0.0.1',
            DataTrackerId: 'test',
            DataTrackerPw: 'test',
            FTPFolder: 'DataTrackerTest',
            createdAt: DumpTime,
            updatedAt: DumpTime
        };
        Dump.push(DataTracker);
        queryInterface.bulkInsert('DataTracker', Dump);
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