'use strict';
/** Password Bcrypt */
const bcrypt = require('bcrypt-nodejs');
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        UserEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,

            validate: {
                /** Check Email Format */
                isEmail: true
            }
        },
        UserName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        UserPassword: {
            type: DataTypes.STRING,
            allowNull: false,
            //TODO Checking
            instanceMethods: {
                generateHash(password) {
                    return bcrypt.hash(passwrod, bcrypt.genSaltSync(8));
                },
                validPassword(passowrd) {
                    return bcrypt.compare(password, this.password);
                }
            }
        },
        UserLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5
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
            beforeCreate: function(user, options) {
                console.log('before create user hook!');
            },
            afterCreate: function(user, options) {
                console.log('after create user hook !');
                //console.log('user email ::: ' + user.UserEmail + ", user password ::: " + user.UserPassword + ", user name ::: " + user.UserName + ", user level ::: " + user.UserLevel);
            }
        }
    });
    /**
     * source model is user
     * target model is tbl_board
     * 1:N connection hasMany
     * N:M connection belongsToMany
     * 1:1 connection hasOne, belongsTo
     * hasOne is target make foreignKey
     * belongsTo is source make foreignKey
     */
    user.associate = function(models) {
        // associations can be defined here
        /** User have Site Many */
        user.hasMany(models.site, {
            foreignKey: 'Owner',
            targetKey: 'UserEmail'
        });
        /** User have Plot Many */
        user.hasMany(models.site, {
            foreignKey: 'Owner',
            targetKey: 'UserEmail'
        });
    };
    //TODO checking?
    user.Login = function(models) {
        console.log('Testing : ', models);
        this.findOne({
            where: models.UserEmail
        }).then((result => {
            return result;
        })).catch(err => {
            throw err;
        });
    };

    return user;


};