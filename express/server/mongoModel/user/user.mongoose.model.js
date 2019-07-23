const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const bcrypt = require('bcrypt-nodejs');
const connection = mongoose.createConnection('mongodb://localhost/my_database');
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;

const User = new Schema({

    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userPw: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userLevel: {
        type: Number,
        default: 5
    },
    loggerInfos: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'LoggerMainInfo'
    }], 
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

/**
 * bcrypt password
 */
User.pre("save", function (next) {
    console.log('user bcrypt');
    var user = this;
    console.log('user.updatedAt :::'+user.updatedAt);
    if (!user.isModified("userPw")) {
        return next();
    }
    user.userPw = bcrypt.hashSync(user.userPw);
    return next();
});

/**
 * update time and update
 */
 User.pre("update", function(next){
     console.log('update pre function');
     var user = this;
     user.updatedAt = Date.now();
     return next();

 })

User.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/**
 * get password compare
 * findOne에서 사용 가능
 */
User.methods.comparePassword = function (userPassword) {
    console.log('compare');
    return bcrypt.compareSync(userPassword, this.userPw);
};

User.methods.addLogger = function(loggerId){
    console.log('logger user info');
    var user = this;
    //user.loggerInfo.push(loggerId);
    return next();
};

/**
 * auto increment id
 */
User.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'index'
});



module.exports = mongoose.model('User', User);