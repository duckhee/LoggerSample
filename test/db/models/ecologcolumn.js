'use strict';
module.exports = (sequelize, DataTypes) => {
    const ecologColumn = sequelize.define('ecologColumn', {
        ecologIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ecolog',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        ecologName: {
            type: DataTypes.STRING,
        },
        ecologData: {
            type: DataTypes.STRING,
        },
    }, {});
    ecologColumn.associate = function(models) {
        // associations can be defined here
        ecologColumn.belongsTo(models.ecolog, {
            foreignKeyConstraint: true,
            foreignKey: 'ecologIdx',
            targetKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });
    };
    return ecologColumn;
};