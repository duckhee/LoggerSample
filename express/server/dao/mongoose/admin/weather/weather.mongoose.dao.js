const Weather = require('../../../../mongoModel/weather/weather.info.model');
const WeatherColumns = require('../../../../mongoModel/weather/weather.name.model');
const WeatherData = require('../../../../mongoModel/weather/weather.data.model');

const InsertInfoWeather = (WeatherInfo) => {
    return new Promise((resolve, reject) => {
        let WeatherModel = new Weather(WeatherInfo);
        WeatherModel.save((err, result) => {
            if (err) {
                console.log('insert weather info error code :::: ', err.code);
                console.log('insert weather info error :::: ', err);
                reject(err);
                return;
            }
            resolve(result);
            return;
        });
    });
};

const WeatherNameCheck = (WeatherName) => {
    return new Promise((resolve, reject) => {

    });
};

module.exports = {
    InsertInfoWeather
};