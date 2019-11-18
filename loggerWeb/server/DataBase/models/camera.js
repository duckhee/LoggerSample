'use strict';
module.exports = (sequelize, DataTypes) => {
    const camera = sequelize.define('camera', {
        name: {
            type: DataTypes.STRING
        },
        ModelName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        PlotIdx: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'plot',
                key: 'id'
            },
            onDelete: 'CASCADE'
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

        }
    });
    camera.associate = function(models) {
        // associations can be defined here

        /** Camera belong to plot */
        camera.belongsTo(models.plot, {
            foreignKeyConstraint: true,
            foreignKey: 'id',
            allowNull: false,
            onDelete: 'CASCADE'
        });

        /** camera have Many Hikvision */
        camera.hasMany(models.hikvision, {
            foreignKey: 'CameraIdx',
            targetKey: 'id'
        });
    };
    return camera;
};