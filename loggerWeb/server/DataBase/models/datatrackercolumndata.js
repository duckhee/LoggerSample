'use strict';
module.exports = (sequelize, DataTypes) => {
    const DataTrackerColumnData = sequelize.define('DataTrackerColumnData', {
        DataTrackerIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'DataTracker',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        DataColumn: {
            type: DataTypes.TEXT
        }
    }, {});
    DataTrackerColumnData.associate = function(models) {
        // associations can be defined here
        /** DataTracker has Many DataTrackerColumnData */
        DataTrackerColumnData.belongsTo(models.DataTracker, {
            foreignKeyConstraint: true,
            foreignKey: 'DataTrackerIdx',
            targetKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });

    };
    return DataTrackerColumnData;
};