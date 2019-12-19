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
        }
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