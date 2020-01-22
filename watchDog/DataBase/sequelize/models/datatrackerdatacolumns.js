'use strict';
module.exports = (sequelize, DataTypes) => {
    const DataTrackerDataColumns = sequelize.define('DataTrackerDataColumns', {
        columnsData: {
            type: DataTypes.TEXT
        },
        dataTrackerIdx: {
            type: DataTypes.INTEGER
        }
    }, {});
    DataTrackerDataColumns.associate = function(models) {
        // associations can be defined here/** DataTracker Has one Columns */
        DataTrackerDataColumns.belongsTo(models.DataTracker, {
            foreignKeyConstraint: true,
            foreignKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });
    };
    return DataTrackerDataColumns;
};