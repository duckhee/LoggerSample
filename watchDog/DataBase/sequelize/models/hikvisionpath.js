'use strict';
module.exports = (sequelize, DataTypes) => {
  const HikVisionPath = sequelize.define('HikVisionPath', {
    path: DataTypes.STRING,
    HikVisionIdx: DataTypes.INTEGER
  }, {});
  HikVisionPath.associate = function(models) {
    // associations can be defined here
  };
  return HikVisionPath;
};