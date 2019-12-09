'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('DeviceColumnData', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            deviceIdx: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'devices',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            columnValue: {
                type: Sequelize.TEXT,
                allowNull: false
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
        return queryInterface.dropTable('DeviceColumnData');
    }
};