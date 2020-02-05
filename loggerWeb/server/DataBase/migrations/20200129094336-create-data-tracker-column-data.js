'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('DataTrackerColumnData', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            DataTrackerIdx: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'DataTrackers',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            dataColumn: {
                type: Sequelize.TEXT
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
        return queryInterface.dropTable('DataTrackerColumnData');
    }
};