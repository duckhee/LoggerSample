const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection('mongodb://localhost/my_database');
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;

const LoggerNameModel = new Schema({
    fullNameData: {
        type: String,
        require: true
    },
    LoggerMainInfoIndex: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'LoggerMainInfo',
        required: true
    },
    LoggerDataIndex:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'LoggerData'
    }],
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
LoggerNameModel.plugin(autoIncrement.plugin, {
    model: 'LoggerName',
    field: 'index'
});


module.exports = mongoose.model('LoggerName', LoggerNameModel);