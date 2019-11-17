'use strict';
module.exports = (sequelize, DataTypes) => {
    const plot = sequelize.define('plot', {
        name: {
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
        SiteName: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'site',
                key: 'name'
            }
        }
    }, {});
    plot.associate = function(models) {
        // associations can be defined here
        /** User have Plot Many */
        plot.belongsTo(models.user, {
            foreignKeyConstraint: true,
            foreignKey: 'userEmail',
            allowNull: false,
            onDelete: 'CASCADE'
        });
        /** Site have Plot Many */
        plot.belongsTo(models.site, {
            foreignKeyConstraint: true,
            foreignKey: 'name',
            allowNull: false,
            onDelete: 'CASCADE'
        });
    };
    return plot;
};