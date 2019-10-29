const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection('mongodb://localhost/nodejs');
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;

/** DataTracker Schema */
const DataTrackers = new Schema({
    FTPPath: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    }
});

/** Update Time update pre */
DataTrackers.pre('update', (next) => {
    var DataTracker = this;
    DataTracker.updatedAt = Date.now();
    return next();
});

module.exports = mongoose.model('DataTracker', DataTrackers);