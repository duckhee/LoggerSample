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
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {});
    DeviceColumnData.associate = function(models) {
        // associations can be defined here
        /** Device has many Device Name Columns */
        DeviceColumnData.belongsTo(models.device, {
            foreignKeyConstraint: true,
            foreignKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });
    };
    return DeviceColumnData;
};