'use strict';
module.exports = (sequelize, DataTypes) => {
    const ecolog = sequelize.define('ecolog', {
        DeviceIdx: {
            type: DataTypes.INTEGER,
            references: {
                model: 'device',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        FileFormat: {
            type: DataTypes.STRING,
            unique: true
        },
    }, {});
    ecolog.associate = function(models) {
        // associations can be defined here

        /** Device has One ecolog */
        ecolog.belongsTo(models.device, {
            foreignKeyConstraint: true,
            foreignKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });
        /** ecolog has Many EcoLog Columns */
        ecolog.hasMany(models.ecologColumn, {
            foreignKey: 'ecologIdx',
            targetKey: 'id'
        });
    };
    return ecolog;
};