'use strict';
module.exports = (sequelize, DataTypes) => {
  const device = sequelize.define('device', {
    name: DataTypes.STRING
  }, {});
  device.associate = function(models) {
    // associations can be defined here
  };
  return device;
};