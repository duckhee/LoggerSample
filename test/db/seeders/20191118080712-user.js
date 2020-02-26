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
        for (let i = 0; i < 100; i++) {
            let obj = {
                UserEmail: 'testing' + i + '@co.kr',
                UserName: 'tester' + i,
                UserPassword: '1234',
                UserLevel: 5,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            dumpData.push(obj);
        }
        return queryInterface.bulkInsert('users', dumpData, {});
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