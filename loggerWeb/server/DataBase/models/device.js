'use strict';
module.exports = (sequelize, DataTypes) => {
    const device = sequelize.define('device', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        PlotIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'plot',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        Latitude: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Longitude: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        DeviceType: {
            type: DataTypes.ENUM,
            values: ['null', 'DataTracker', 'ecolog', 'HikVision'],
            defaultValue: 'null',
            allowNull: false
        }
    }, {});
    device.associate = function(models) {
        // associations can be defined here
        /** Plot have many Device */
        device.belongsTo(models.plot, {
            foreignKeyConstraint: true,
            foreignKey: 'UserEmail',
            allowNull: false,
            onDelete: 'CASCADE'
        });
    };
    return device;
};