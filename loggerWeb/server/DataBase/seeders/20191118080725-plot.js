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
            let plot = {
                PlotName: 'testing' + i,
                Owner: 'admin@co.kr',
                SiteIdx: 1,
                createdAt: DumpTime,
                updatedAt: DumpTime
            };
            DumpData.push(plot);
        }
        return queryInterface.bulkInsert('plots', DumpData, {});
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