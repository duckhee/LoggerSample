const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
//const connection = mongoose.createConnection('mongodb://localhost/my_database');
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;

var LoggerMainInfo = new Schema({
    UserInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    LoggerFolderName: {
        type: String,
        required: true,
        unique: true
    },
    LoggerKind: {
        type: String,
        required: true
    },

    LoggerName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoggerName'
    },
    LoggerData: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoggerData'
    }],

    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    }
});

LoggerMainInfo.pre('save', function (next) {
    console.log('save logger main');
    var logger = this;
    if (!logger.isModified('UserInfo')) {
        console.log('testing');
        return next();
    }

    return next();
});

LoggerMainInfo.pre('update', (next) => {
    console.log('update logger info');
    var logger = this;
    logger.updatedAt = Date.now();
    return next();
});

/**
 * auto increment id
 */
LoggerMainInfo.plugin(autoIncrement.plugin, {
    model: 'LoggerMainInfo',
    field: 'index'
});

module.exports = mongoose.model('LoggerMainInfo', LoggerMainInfo);