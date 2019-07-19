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
        unique: true
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
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    }
});



User.post('findOne', function () {
    console.log('find one query');
    var user = this;
    console.log('Schema type objectid :::: ', Schema.Types.ObjectId);

});

/**
 * bcrypt password
 */
User.pre("save", function (next) {
    console.log('user bcrypt');
    var user = this;
    if (!user.isModified("userPw")) {
        return next();
    }
    user.userPw = bcrypt.hashSync(user.userPw);
    return next();
});

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

/**
 * auto increment id
 */
User.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'index'
});



module.exports = mongoose.model('User', User);