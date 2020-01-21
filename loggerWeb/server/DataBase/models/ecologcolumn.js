'use strict';
module.exports = (sequelize, DataTypes) => {
    const ecologColumn = sequelize.define('ecologColumn', {
        ecologIdx: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'ecolog',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        ecologValue1: {
            type: DataTypes.STRING,
        },
        ecologValue2: {
            type: DataTypes.STRING,
        },
        ecologValue3: {
            type: DataTypes.STRING,
        },
        ecologValue4: {
            type: DataTypes.STRING,
        },
        ecologValue5: {
            type: DataTypes.STRING,
        },
        ecologValue6: {
            type: DataTypes.STRING,
        },
    }, {});
    ecologColumn.associate = function(models) {
        // associations can be defined here
        ecologColumn.belongsTo(models.ecolog, {
            foreignKeyConstraint: true,
            foreignKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });
    };
    return ecologColumn;
};