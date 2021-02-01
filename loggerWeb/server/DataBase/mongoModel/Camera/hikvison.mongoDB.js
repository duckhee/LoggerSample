const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection('mongodb://localhost/nodejs');
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;

/** Hikvision Camera Schema */
const Hikvisions = new Schema({
    authType: {
        type: String,
        enum: ['none', 'basic', 'digest'],
        required: true,
        default: ''
    },
    authId: {
        type: String,
    },
    authPw: {
        type: String,
    },
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
Hikvisions.pre('update', (next) => {
    console.log('update hikvision camera ');
    var hikvision = this;
    hikvision.updatedAt = Date.now();
    return next();
});

module.exports = mongoose.model('Hikvison', Hikvisions);