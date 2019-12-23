'use strict';
module.exports = (sequelize, DataTypes) => {
    const DataTrackerColumns = sequelize.define('DataTrackerColumns', {
        columns: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        dataTrackerIdx: {
            type: DataTypes.INTEGER,
            references: {
                model: 'DataTracker',
                key: 'id'
            },
            onDelete: 'CASCADE'
        }
    }, {});
    DataTrackerColumns.associate = function(models) {
        // associations can be defined here
        /** DataTracker Has one Columns */
        DataTrackerColumns.belongsTo(models.DataTracker, {
            foreignKeyConstraint: true,
            foreignKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });
    };
    return DataTrackerColumns;
};