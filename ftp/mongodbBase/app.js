const fs = require('fs');
const mongoose = require('mongoose');
const dbConnection = mongoose.connect('mongodb://localhost/my_database');
const User = require('./MongooseModel/User.model');


function test() {

    User.findOne({
        userId: 'admin'
    }, (err, res) => {
        if (err) {
            console.log('error ', err);
            return;
        }
        console.log(res);
        console.log('Testing', mongoose.Schema.Types.ObjectId);

    });
};

test();