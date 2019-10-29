const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection('mongodb://localhost/my_database');
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;

const WeatherInfo = new Schema({
    UserInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    WeatherFolderName: {
        type: String,
        required: true,
        unique: true
    },
    WeatherName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WeatherName',
    },
    LoggerData: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WeatherData'
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

/*
WeatherData.plugin(autoIncrement.plugin, {
    model: '',
    //field:'index'
});
*/

//module.exports = mongoose.model('');

module.exports = mongoose.model('WeatherInfo', WeatherInfo);