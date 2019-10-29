const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection('mongodb://localhost/nodejs');
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;

/** Device Schema */
const Devices = new Schema({
    UserObjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ''
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
Devices.pre('update', (next) => {
    var device = this;
    device.updatedAt = Date.now();
    return next();
});


module.exports = mongoose.model('Device', Devices);