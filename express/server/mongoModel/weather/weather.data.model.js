const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection('mongodb://localhost/my_database');
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;

const WeatherData = new Schema({

});

/*
WeatherData.plugin(autoIncrement.plugin, {
    model: '',
    //field:'index'
});
*/

//module.exports = mongoose.model('');