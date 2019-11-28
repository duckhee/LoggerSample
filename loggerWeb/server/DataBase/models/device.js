'use strict';
module.exports = (sequelize, DataTypes) => {
    const device = sequelize.define('device', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        PlotIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'plot',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        Latitude: {
            type: DataTypes.STRING,
            defaultValue: '0',
            allowNull: false,
        },
        Longitude: {
            type: DataTypes.STRING,
            defaultValue: '0',
            allowNull: false,
        },
        DeviceType: {
            type: DataTypes.ENUM,
            values: ['null', 'DataTracker', 'ecolog', 'HikVision'],
            defaultValue: 'null',
            allowNull: false
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
        },
        setterMethods: {

        },
        hooks: {
            beforeCreate: function(device, options) {

            },
            afterCreate: function(device, options) {

            }
        }
    });
    device.associate = function(models) {
        // associations can be defined here
        /** Plot have many Device */
        device.belongsTo(models.plot, {
            foreignKeyConstraint: true,
            foreignKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });
    };
    return device;
};