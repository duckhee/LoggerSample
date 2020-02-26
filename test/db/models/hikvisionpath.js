'use strict';
module.exports = (sequelize, DataTypes) => {
    const HikVisionPath = sequelize.define('HikVisionPath', {
        path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        HikVisionIdx: {
            type: DataTypes.INTEGER,
            references: {
                model: 'hikvision',
                key: 'id'
            }
        },

    }, {});
    HikVisionPath.associate = function(models) {
        // associations can be defined here
        /** HikVision has Many HikVisionPath */
        HikVisionPath.belongsTo(models.hikvision, {
            foreignKeyConstraint: true,
            foreignKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'

        });
    };
    return HikVisionPath;
};