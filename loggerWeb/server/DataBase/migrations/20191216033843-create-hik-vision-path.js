'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('HikVisionPaths', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            path: {
                type: Sequelize.STRING
            },
            HikVisionIdx: {
                type: Sequelize.INTEGER,
                references: {
                    model: "hikvisions",
                    key: 'id'
                },
                allowNull: false,
                onDelete: 'CASCADE',
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
        return queryInterface.dropTable('HikVisionPaths');
    }
};