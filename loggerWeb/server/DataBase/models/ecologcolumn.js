'use strict';
module.exports = (sequelize, DataTypes) => {
  const ecologColumn = sequelize.define('ecologColumn', {
    ecologIdx: DataTypes.INTEGER
  }, {});
  ecologColumn.associate = function(models) {
    // associations can be defined here
  };
  return ecologColumn;
};