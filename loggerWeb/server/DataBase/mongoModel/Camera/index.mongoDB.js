const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection('mongodb://localhost/nodejs');
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;

/** Camera Schema */
const Cameras = new Schema({
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
Cameras.pre('update', (next) => {
    var camera = this;
    camera.updatedAt = Date.now();
    return next();
});


module.exports = mongoose.model('Camera', Cameras);