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
    }, {
        /**
         * getter and setter method function make here.
         * getter this.colum
         * setter this.setDataValue('colum', setvalue)
         * getterMethods: {
         * fullName() {
         *   return this.email + ' ' + this.nickname + " " + this.userlevel + " " + this.apikey;
         * }
         * if do you want to make hook
         * hooks:{
         * beforeValidate:function(){
         * },
         * afterValidate:function(){
         * }
         * }
         */
        getterMethods: {
            //Write methods here
            /** Getter Method */
            GetPlotName() {
                return this.PlotName;
            },
            GetOwner() {
                return this.Owner;
            },
            GetSiteIdx() {
                return this.SiteIdx;
            }
        },
        setterMethods: {
            //Write methods here
            /** Setter Method */
            SetPlotName(name) {
                this.setDataValue('PlotName', name);
            },
            SetOwner(owner) {
                this.setDataValue('Owner', owner);
            },
            SetSiteIdx(idx) {
                this.setDataValue('SiteIdx', idx);
            }
        },
        hooks: {
            beforeCreate: function(plot, options) {

            },
            afterCreate: function(plot, options) {

            }
        }
    });
    plot.associate = function(models) {
        // associations can be defined here
        /** User have Plot Many */
        plot.belongsTo(models.user, {
            foreignKeyConstraint: true,
            foreignKey: 'Owner',
            targetKey: 'UserEmail',
            allowNull: false,
            onDelete: 'CASCADE'
        });
        /** Site have Plot Many */
        plot.belongsTo(models.site, {
            foreignKeyConstraint: true,
            foreignKey: 'SiteIdx',
            targetKey: 'id',
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