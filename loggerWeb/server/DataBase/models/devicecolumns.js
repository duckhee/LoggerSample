'use strict';
module.exports = (sequelize, DataTypes) => {
    const DeviceColumns = sequelize.define('DeviceColumns', {
        deviceIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'device',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        columns: {
            type: DataTypes.STRING
        }
    }, {});
    DeviceColumns.associate = function(models) {
        // associations can be defined here
    };
    return DeviceColumns;
};