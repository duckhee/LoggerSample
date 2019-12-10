'use strict';
module.exports = (sequelize, DataTypes) => {
  const DataTrackerDataColumns = sequelize.define('DataTrackerDataColumns', {
    columnsData: DataTypes.TEXT,
    dataTrackerIdx: DataTypes.INTEGER
  }, {});
  DataTrackerDataColumns.associate = function(models) {
    // associations can be defined here
  };
  return DataTrackerDataColumns;
};