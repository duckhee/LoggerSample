'use strict';
module.exports = (sequelize, DataTypes) => {
    const plot = sequelize.define('plot', {
        PlotName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Owner: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'user',
                key: 'UserEmail'
            }
        },
        SiteIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'site',
                key: 'id'
            }
        }
    }, {});
    plot.associate = function(models) {
        // associations can be defined here
        /** User have Plot Many */
        plot.belongsTo(models.user, {
            foreignKeyConstraint: true,
            foreignKey: 'UserEmail',
            allowNull: false,
            onDelete: 'CASCADE'
        });
        /** Site have Plot Many */
        plot.belongsTo(models.site, {
            foreignKeyConstraint: true,
            foreignKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });
        /** Plot have Many Device */
        plot.hasMany(models.device, {
            foreignKey: 'PlotIdx',
            targetKey: 'id'
        });
    };
    return plot;
};