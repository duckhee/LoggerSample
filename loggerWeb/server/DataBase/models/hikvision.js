'use strict';
module.exports = (sequelize, DataTypes) => {
    const hikvision = sequelize.define('hikvision', {
        CameraIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'camera',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        modelName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        HikVisionId: {
            type: DataTypes.STRING,
        },
        HikVisionPw: {
            type: DataTypes.STRING
        }
    }, {

    });
    hikvision.associate = function(models) {
        // associations can be defined here
        hikvision.belongsTo(models.camera, {
            foreignKeyConstraint: true,
            foreignKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });
    };
    return hikvision;
};