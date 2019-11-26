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
                isEmail: true,
                notNull: true
            }
        },
        UserName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true
            }
        },
        UserPassword: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: true
            },
            //TODO Checking
            instanceMethods: {
                generateHash(password) {
                    return bcrypt.hashSync(passwrod, bcrypt.genSaltSync(8));
                },
                validPassword(passowrd) {
                    return bcrypt.compareSync(password, this.password);
                }
            }
        },
        UserLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
            validate: {
                isInt: true,
                notNull: true
            },
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
            GetUserEmail() {
                return this.UserEmail;
            },
            GetUserName() {
                return this.UserName;
            },
            GetUserLevel() {
                return this.UserLevel;
            },
            GetModelToString() {
                return this.UserEmail + ', ' + this.UserPassword + ', ' + this.UserName + ', ' + this.UserLevel;
            }
        },
        setterMethods: {
            //Write methods here
            /** Setter Method */
            SetUserEmail(email) {
                this.setDataValue('UserEmail', email);
            },
            SetUserPassword(password) {
                this.setDataValue('UserPassword', password);
            },
            SetUserName(name) {
                this.setDataValue('UserName', name);
            },
            SetUserLevel(level) {
                this.setDataValue('UserLevel', level);
            },
            SetLastTime(date) {
                this.setDataValue('updatedAt', date);
            }
        },
        instanceMethods: {
            //Write methods here
        },
        classMethods: {
            //Write methods here
        },

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