'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('DataTrackerColumns', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            columns: {
                type: Sequelize.TEXT
            },
            dataTrackerIdx: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'DataTrackers',
                    key: 'id'
                },
                allowNull: false,
                onDelete: 'CASCADE'
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
        return queryInterface.dropTable('DataTrackerColumns');
    }
};