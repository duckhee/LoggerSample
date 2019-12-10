'use strict';
module.exports = (sequelize, DataTypes) => {
  const DataTrackerColumns = sequelize.define('DataTrackerColumns', {
    columns: DataTypes.TEXT,
    dataTrackerIdx: DataTypes.INTEGER
  }, {});
  DataTrackerColumns.associate = function(models) {
    // associations can be defined here
  };
  return DataTrackerColumns;
};