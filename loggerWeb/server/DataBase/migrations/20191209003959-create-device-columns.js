'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('DeviceColumns', {
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
            columns: {
                type: Sequelize.STRING
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
        return queryInterface.dropTable('DeviceColumns');
    }
};