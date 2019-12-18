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
                key: 'UserEmail'
            }
        },


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
            GetName() {
                return this.name;
            },
            GetOwner() {
                return this.Owner;
            },
            GetModelToString() {
                return this.name + ', ' + this.Owner;
            }
        },
        setterMethods: {
            //Write methods here
            /** Setter Method */
            SetName(name) {
                this.setDataValue('name', name);
            },
            SetOwner(owner) {
                this.setDataValue('Owner', owner);
            }
        },
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
            targetKey: 'UserEmail',
            foreignKey: 'Owner',
            allowNull: false,
            onDelete: 'CASCADE'
        });
        /** site have Plot Many */
        site.hasMany(models.plot, {
            foreignKey: 'SiteIdx',
            targetKey: 'id',
        });

    };
    /**
     * hook create
     * user.addHook('afterCreate', function(user, options){return sequelize.Promise.reject()})
     * User.beforeCreate(function(user, options) {
     * return hashPassword(user.password).then(function (hashedPw) {
     * user.password = hashedPw;
     *  });
     * 
     */
    return site;
};