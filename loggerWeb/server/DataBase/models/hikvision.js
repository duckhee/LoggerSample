'use strict';
module.exports = (sequelize, DataTypes) => {
    const hikvision = sequelize.define('hikvision', {
        /*
        CameraIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'camera',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        
        modelName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        */
        HikVisionIp: {
            type: DataTypes.STRING,
            allowNull: false
        },
        HikVisionId: {
            type: DataTypes.STRING,
        },
        HikVisionPw: {
            type: DataTypes.STRING
        },
        FTPFolder: {
            type: DataTypes.STRING,
            unique: true
        },
        DeviceIdx: {
            type: DataTypes.INTEGER,
            references: {
                model: 'device',
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
            GetCameraIdx() {
                return this.CameraIdx;
            },
            GetModelName() {
                return this.modelName;
            },
            GetHikVisionId() {
                return this.HikVisionId;
            },
            GetHikVisionPw() {
                return this.HikVisionPw;
            }
        },
        setterMethods: {
            //Write methods here
            /** Getter Method */
            SetCameraIdx(idx) {
                this.setDataValue('CameraIdx', idx);
            },
            SetModelName(name) {
                this.setDataValue('modelName', name);
            },
            SetHikVisionId(id) {
                this.setDataValue('HikVisionId', id);
            },
            SetHikVisionPw(pw) {
                this.setDataValue('HikVisionPw', pw);
            }
        },
        hooks: {
            beforeCreate: function(hikvision, options) {

            },
            afterCreate: function(hikvision, options) {

            }
        }
    });
    hikvision.associate = function(models) {
        // associations can be defined here
        /** Device has One HikVision */
        hikvision.belongsTo(models.device, {
            foreignKeyConstraint: true,
            foreignKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });
        /** HikVision has Many HikVision Path */
        hikvision.hasMany(models.HikVisionPath, {
            HikVisionIdx: 'deviceIdx',
            targetKey: 'id',
            sourceKey: 'id'
        });
    };
    return hikvision;
};