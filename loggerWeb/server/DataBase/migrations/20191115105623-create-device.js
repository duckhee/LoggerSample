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
            Latitude: {
                type: Sequelize.STRING,
                defaultValue: '0',
                allowNull: false,
            },
            Longitude: {
                type: Sequelize.STRING,
                defaultValue: '0',
                allowNull: false,
            },
            DeviceType: {
                type: Sequelize.ENUM('null', 'DataTracker', 'ecolog', 'HikVision'),
                defaultValue: 'null',
                allowNull: false,
            },
            FTPFolder: {
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
        return queryInterface.dropTable('devices');
    }
};