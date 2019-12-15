'use strict';
module.exports = (sequelize, DataTypes) => {
    const DataTrackerColumns = sequelize.define('DataTrackerColumns', {
        columns: {
            type: DataTypes.TEXT
        },
        dataTrackerIdx: {
            type: DataTypes.INTEGER,
            references: {
                model: 'DataTracker',
                key: 'id'
            }
        }
    }, {});
    DataTrackerColumns.associate = function(models) {
        // associations can be defined here
        /** DataTracker Has one Columns */
        DataTrackerColumns.belongsTo(models.dataTracker, {

        });
    };
    return DataTrackerColumns;
};