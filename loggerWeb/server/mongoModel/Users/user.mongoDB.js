const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const bcrypt = require('bcrypt-nodejs');
const connection = mongoose.createConnection('mongodb://localhost/nodejs');
/** Make MongoDB Connection */
autoIncrement.initialize(connection);
/** MongoDB Schema */
const Schema = mongoose.Schema;

const Users = new Schema({
    UserId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    UserPw: {
        type: String,
        required: true
    },
    UserName: {
        type: String,
        required: true
    },
    UserLevel: {
        type: Number,
        required: true,
        default: 5
    },
    DeviceInfo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: ''
    }],
    CameraInfo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: ''
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    }
});

/** bcrypt password before Registe */
Users.pre('save', (next) => {
    console.log("password bcrypt");
    var user = this;
    if (!user.isModified('userPw')) {
        return next();
    }
    user.UserPw = bcrypt.hashSync(user.userPw);
    user.updatedAt = Date.now();
    return next();
});

/** User Update */
Users.pre('update', (next) => {
    console.log('update User Info');
    var user = this;
    user.updatedAt = Date.now();
    return next();
});

/** generateHash */
Users.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/** Check Password */
Users.methods.comparePassword = (UserPw) => {
    return bcrypt.compareSync(UserPw, this.UserPassword);
};

/** Export User Schema */
module.exports = mongoose.model('User', User);