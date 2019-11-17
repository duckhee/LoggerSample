'use strict';
module.exports = (sequelize, DataTypes) => {
    const site = sequelize.define('site', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Owner: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'user',
                key: 'userEmail'
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
        hooks: {
            beforeCreate: function(site, options) {

            },
            afterCreate: function(site, options) {

            }
        }
    });
    site.associate = function(models) {
        // associations can be defined here
        /** User have Site Many */
        site.belongsTo(models.user, {
            foreignKeyConstraint: true,
            foreignKey: 'UserEmail',
            allowNull: false,
            onDelete: 'CASCADE'
        });
        /** site have Plot Many */
        site.hasMany(models.plot, {
            foreignKey: 'SiteName',
            targetKey: 'name'
        });

    };
    return site;
};