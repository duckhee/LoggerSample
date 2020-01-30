'use strict';
module.exports = (sequelize, DataTypes) => {
    const DataTracker = sequelize.define('DataTracker', {
        DeviceIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'device',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        /*
        ModelName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        */
        DataTrackerIP: {
            type: DataTypes.STRING,
            allowNull: false
        },
        DataTrackerId: {
            type: DataTypes.STRING,
        },
        DataTrackerPw: {
            type: DataTypes.STRING
        },
        FTPFolder: {
            type: DataTypes.STRING,
            unique: true
        },


    }, {});
    DataTracker.associate = function(models) {
        // associations can be defined here

        /** Device has One DataTracker */
        DataTracker.belongsTo(models.device, {
            foreignKeyConstraint: true,
            foreignKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });
        /** DataTracker has Many DataTracker columns(data) */
        DataTracker.hasMany(models.DataTrackerColumnData, {
            foreignKey: 'DataTrackerIdx',
            targetKey: 'id',
            sourceKey: 'id'
        });
        /** DataTracker has One DataTracker columns(name) */
        DataTracker.hasOne(models.DataTrackerColumnName, {
            foreignKey: 'DataTrackerIdx',
            targetKey: 'id',
            sourceKey: 'id'
        });
    };
    return DataTracker;
};