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
        ModelName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        DataTrackerId: {
            type: DataTypes.STRING,
        },
        DataTrackerPw: {
            type: DataTypes.STRING
        },
        FTPFolder: {
            type: DataTypes.STRING,
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
    };
    return DataTracker;
};