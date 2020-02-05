'use strict';
module.exports = (sequelize, DataTypes) => {
    const DataTrackerColumnName = sequelize.define('DataTrackerColumnName', {
        DataTrackerIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'DataTracker',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        nameColumn: {
            type: DataTypes.TEXT
        }
    }, {});
    DataTrackerColumnName.associate = function(models) {
        // associations can be defined here
        /** DataTracker has One DataTrackerColumnData */
        DataTrackerColumnName.belongsTo(models.DataTracker, {
            foreignKeyConstraint: true,
            foreignKey: 'DataTrackerIdx',
            targetKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });
    };
    return DataTrackerColumnName;
};