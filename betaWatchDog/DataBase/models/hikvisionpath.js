'use strict';
module.exports = (sequelize, DataTypes) => {
    const HikVisionPath = sequelize.define('HikVisionPath', {
        path: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        HikVisionIdx: {
            references: {
                model: 'HikVision',
                key: 'id'
            },
            type: DataTypes.INTEGER
        }
    }, {});
    HikVisionPath.associate = function(models) {
        // associations can be defined here
    };
    return HikVisionPath;
};