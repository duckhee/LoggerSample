'use strict';
module.exports = (sequelize, DataTypes) => {
    const ecolog = sequelize.define('ecolog', {
        FTPFolder: {
            type: DataTypes.STRING
        },
        DeviceIdx: {
            type: DataTypes.INTEGER,
            references: {
                model: 'device',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        FileFormat: {
            type: DataTypes.STRING
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
    };
    return ecolog;
};