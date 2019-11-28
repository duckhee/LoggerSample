'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('hikvisions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            CameraIdx: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'cameras',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            ModelName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            HikVisionId: {
                type: Sequelize.STRING
            },
            HikVisionPw: {
                type: Sequelize.STRING
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
        return queryInterface.dropTable('hikvisions');
    }
};