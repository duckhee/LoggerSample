const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection('mongodb://localhost/my_database');
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;

const Hikvision = new Schema({
    UserInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Id: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
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

Hikvision.pre('save', (next) => {
    console.log('save hikvision camera main');
    var hikvision = this;
    hikvision.updatedAt = Date.now();
    return next();
});

Hikvision.pre('update', (next) => {
    console.log('update hikvision info');
    Hikvision.updatedAt = Date.now();
    return next();
});


module.exports = mongoose.model('HikVision', Hikvision);