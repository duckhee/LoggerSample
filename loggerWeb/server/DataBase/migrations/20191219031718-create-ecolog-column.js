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
            ecologName: {
                type: Sequelize.STRING,
            },
            ecologData: {
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