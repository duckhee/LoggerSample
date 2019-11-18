'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('devices', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            PlotIdx: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'plots',
                    key: 'id',
                },
                onDelete: 'CASCADE'
            },
            DeviceType: {
                type: Sequelize.ENUM('null', 'DataTracker', 'ecolog'),
                defaultValue: 'null',
                allowNull: false,
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
        return queryInterface.dropTable('devices');
    }
};