const models = require('../../../../DataBase/models/index');
const user = require('../../../../DataBase/models/user');

/** Password security module */
const bcrypt = require('bcrypt-nodejs');

/** Registe User */
const RegisteUser = (UserInfo, callback) => {
    /** User Model Make */
    const UserPassword = UserInfo.password;
    const EncodingPassword = bcrypt.hashSync(UserPassword, bcrypt.genSaltSync(5));
    const UserEmail = UserInfo.email;
    const UserName = UserInfo.name;
    /** find and create user raw */
    models.user.findOrCreate({
        where: {
            UserEmail: UserEmail
        },
        defaults: {
            UserEmail: UserEmail,
            UserName: UserName,
            UserPassword: EncodingPassword
        }
    }).spread((user, created) => {
        if (created) {
            /**
             * make new user
             */
            return callback(null, null, created);
        } else {
            /**
             * already have user
             */
            return callback(null, user.dataValues, null);
        }
    }).catch((err) => {
        console.log('created user dao error code :::: ', err.code);
        console.log('created user dao error :::: ', err);
        return callback(err, null, null);
    });
};
/** List User */
const ListUser = (UserInfo) => {

};
/** Paging user */
const PagingUser = (UserInfo) => {
    let offsetting = 0;
    if (UserInfo.Pages > 1) {
        offsetting = 10 * (UserInfo.Pages - 1);
    }
    models.user.findAll({
        where: '',
        limit: 10,
        offset: offsetting
    }).then(result => {

    }).catch(err => {

    });
};

/** Login User */
const LoginUser = (UserInfo) => {
    models.user.findOne({
        where: {
            UserEmail: UserInfo.email
        }
    }).then(result => {
        if (!bcrypt.compareSync(UserInfo.password, result.password)) {
            /** this is not match user */

        } else {
            /** match user */
        }
    }).catch(err => {
        /** Error do */
    });

};

/** User Email Check */
const EmailCheckUser = (UserInfo) => {
    models.user.count({
        where: UserInfo.Email
    }).then(result => {

    }).catch(err => {

    });
};

module.exports = {
    RegisteUser,
    ListUser,
    PagingUser,
    LoginUser,
    EmailCheckUser,
};