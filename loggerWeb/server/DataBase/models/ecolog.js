'use strict';
module.exports = (sequelize, DataTypes) => {
    const ecolog = sequelize.define('ecolog', {
        FTPFolder: {
            type: DataTypes.STRING
        }
    }, {});
    ecolog.associate = function(models) {
        // associations can be defined here
    };
    return ecolog;
};