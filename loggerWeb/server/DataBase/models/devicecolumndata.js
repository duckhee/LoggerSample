'use strict';
module.exports = (sequelize, DataTypes) => {
    const DeviceColumnData = sequelize.define('DeviceColumnData', {
        deviceIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'device',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        columnValue: {
            type: DataTypes.STRING
        }
    }, {});
    DeviceColumnData.associate = function(models) {
        // associations can be defined here

    };
    return DeviceColumnData;
};