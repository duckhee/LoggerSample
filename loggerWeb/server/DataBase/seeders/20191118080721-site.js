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
        let dumpData = [];
        let dumpTime = new Date();
        for (let i = 0; i < 100; i++) {
            let site = {
                Owner: 'admin@co.kr',
                name: 'testing' + i,
                createdAt: dumpTime,
                updatedAt: dumpTime
            };
            dumpData.push(site);
        }
        return queryInterface.bulkInsert('sites', dumpData, {});
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