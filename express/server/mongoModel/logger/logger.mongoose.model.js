const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection('mongodb://localhost/my_database');
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;


const LoggerSchema = new Schema({

});

/**
 * auto increment id
 */
LoggerMainInfo.plugin(autoIncrement.plugin, {
    model: 'LoggerSchema',
    filed: 'index'
});


module.exports = mongoose.model('LoggerSchema', LoggerSchema);