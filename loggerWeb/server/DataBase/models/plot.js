'use strict';
module.exports = (sequelize, DataTypes) => {
  const plot = sequelize.define('plot', {
    name: DataTypes.STRING
  }, {});
  plot.associate = function(models) {
    // associations can be defined here
  };
  return plot;
};