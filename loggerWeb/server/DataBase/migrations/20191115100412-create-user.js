'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            UserEmail: {
                unique: true,
                type: Sequelize.STRING
            },
            UserName: {
                type: Sequelize.STRING
            },
            UserPw: {
                type: Sequelize.STRING
            },
            UserLevel: {
                type: Sequelize.INTEGER,
                allowNUll: false,
                defaultValue: 5
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('users');
    }
};