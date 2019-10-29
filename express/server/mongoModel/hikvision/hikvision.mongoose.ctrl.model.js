const mongoose = require('mongoose');
const autoincrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection('mongodb://localhost/my_database');
autoincrement.initialize(connection);

const Schema = mongoose.Schema;

const HikvisionCtrl = new Schema({
    CameraInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hikvision',
        required: true
    },
    active: {
        type: Boolean,
    },
    history: [{
        type: Date
    }],
    createdAt: {
        type: Date,
        require: true,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    }

});

HikvisionCtrl.pre('save', (next) => {
    console.log('save hikvision camera ctrl main save');
    var hikvisionCtrl = this;
    hikvisionCtrl.updatedAt = Date.now();
    return next();
});

HikvisionCtrl.pre('update', (next) => {
    console.log('update hikvision ctrl');
    var getTime = Date.now();
    HikvisionCtrl.history = getTime;
    HikvisionCtrl.updatedAt = getTime;
    return next();
});

module.exports = mongoose.model('HikvisionCtrl', HikvisionCtrl);