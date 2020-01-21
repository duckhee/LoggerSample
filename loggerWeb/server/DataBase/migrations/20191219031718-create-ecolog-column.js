'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ecologColumns', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            ecologIdx: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'ecologs',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            ecologValue1: {
                type: Sequelize.STRING,
            },
            ecologValue2: {
                type: Sequelize.STRING,
            },
            ecologValue3: {
                type: Sequelize.STRING,
            },
            ecologValue4: {
                type: Sequelize.STRING,
            },
            ecologValue5: {
                type: Sequelize.STRING,
            },
            ecologValue6: {
                type: Sequelize.STRING,
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
        return queryInterface.dropTable('ecologColumns');
    }
};