const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection('mongodb://localhost/my_database');
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;

const LoggerData = new Schema({
    fullValueData: {
        type: String,
        require: true
    },
    LoggerMainInfoIndex: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoggerMainInfo',
        required: true
    },
    LoggerNameIndex: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoggerName',
        required: true
    },
    createdAt: {
        type: Date,
        require: true,
        default: Date.now(),
    },
    updatedAt: {
        type: Date
    }
});

/**
 * auto increment id
 */
/*
LoggerData.plugin(autoIncrement.plugin, {
    model: 'LoggerData',
    field: 'index'
});
*/

module.exports = mongoose.model('LoggerData', LoggerData);