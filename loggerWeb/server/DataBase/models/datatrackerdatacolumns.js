'use strict';
module.exports = (sequelize, DataTypes) => {
    const DataTrackerDataColumns = sequelize.define('DataTrackerDataColumns', {
        columnsData: {
            type: DataTypes.TEXT
        },
        dataTrackerIdx: {
            type: DataTypes.INTEGER,
            references: {
                model: 'DataTracker',
                key: 'id'
            },
            onDelete: 'CASCADE',
            allowNull: false
        }
    }, {});
    DataTrackerDataColumns.associate = function(models) {
        // associations can be defined here
        /** DataTracker Has Many Columns*/
        DataTrackerDataColumns.belongsTo(models.DataTracker, {
            foreignKeyConstraint: true,
            foreignKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });

    };
    return DataTrackerDataColumns;
};