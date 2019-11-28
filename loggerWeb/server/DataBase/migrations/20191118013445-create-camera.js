'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('cameras', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            PlotIdx: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'plots',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            Latitude: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            Longitude: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            CameraType: {
                type: Sequelize.ENUM('null', 'hikvision'),
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
        return queryInterface.dropTable('cameras');
    }
};