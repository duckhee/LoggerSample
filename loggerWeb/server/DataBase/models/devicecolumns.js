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
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {});
    DeviceColumns.associate = function(models) {
        // associations can be defined here

        /** Device has many Device Name Columns */
        DeviceColumns.belongsTo(models.device, {
            foreignKeyConstraint: true,
            foreignKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });
    };
    return DeviceColumns;
};