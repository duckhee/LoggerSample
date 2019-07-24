const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
//const connection = mongoose.createConnection('mongodb://localhost/my_database');
const connection = mongoose.createConnection('mongodb://192.168.3.7/my_database');
//const findOrCreate = require('mongoose-findorcreate');
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;

const LoggerNameModel = new Schema({
    folderName: {
        type: String,
        required: true,
        unique: true
    },
    fullNameData: {
        type: String,
        required: true
    },
    LoggerMainInfoIndex: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoggerMainInfo',
        required: true
    },
    LoggerData: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LoggerData'
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

LoggerNameModel.pre('save', function (next) {
    var LoggerName = this;
    //console.log("Logger Name Insert Check ::: ", LoggerName);
    return next();
});

LoggerNameModel.pre('update', (next) => {
    var LoggerName = this;
    LoggerName.updatedAt = Date.now();
    console.log('update set  ', LoggerName);
    return next();
});

LoggerNameModel.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
    const self = this;

    self.findOne({
        LoggerMainInfoIndex: condition.LoggerMainInfoIndex
    }).exec(function (err, result) {
        console.log('condition :::: ', condition);
        console.log('find one and create result find :::: ', result);
        if (result != null) {
            console.log('find or create ::: ', result);
            return callback(err, result);
        }
        console.log('checking result findOneOrCreate :::: ', result);
        return self.create(condition, (err, result));
        //return result ? callback(err, result) : self.create(condition, (err, result));
        //return callback(err, result);
    });
}


/**
 * findOrCreate
 */
//LoggerNameModel.plugin(findOrCreate);
/**
 * auto increment id
 */

LoggerNameModel.plugin(autoIncrement.plugin, {
    model: 'LoggerName',
    field: 'index'
});


module.exports = mongoose.model('LoggerName', LoggerNameModel);