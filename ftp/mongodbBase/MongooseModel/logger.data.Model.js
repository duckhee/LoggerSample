const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
//const connection = mongoose.createConnection('mongodb://localhost/my_database');
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;

const LoggerData = new Schema({
    getFileName: {
        type: String,
        required: true
    },
    fullValueData: {
        type: String,
        require: true,
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

LoggerData.pre('save', (next) => {
    var LoggerData = this;
    //console.log('logger data insert check ::: ', LoggerData);
    return next();
});

LoggerData.pre('update', (next) => {
    var LoggerUpdateTime = this;
    LoggerUpdateTime.updatedAt = Date().now();
    return next();
});



LoggerData.post('insertMany', (result) => {

    let objectValue = new Array();
    //console.log('post result ::: ', result);
    for (var i in result) {
        objectValue.push(result[i]._id);
    }
    result.ArrayObject = objectValue;

    return result;
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