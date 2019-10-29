const mongoose = require("mongoose");
const dbConnection = mongoose.connect('mongodb://localhost/my_database');

/** MongoDB Connection Check */
const mod = (() => {
    const privateFoo = () => {
        console.log('test');
    };
    const privateBar = [];
    const exported = () => {
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Connection error ::: '));
        db.once('open', () => {
            console.log('connected successfully');
        });
    };
    return exported;
});

module.exports = mod;