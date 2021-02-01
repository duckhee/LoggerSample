const models = require('../../../../DataBase/models/index');
const user = require('../../../../DataBase/models/user');

/** Password security module */
const bcrypt = require('bcrypt-nodejs');

class UserDao {


    /** Registe User */
    RegisterUser(UserInfo, callback) {
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
    }

    /** Count User */
    CountUser() {
        models.user.count().then(result => {

        }).catch(err => {

        });
    }

    /** List User */
    ListUser(UserInfo) {

    }

    /** Paging user */
    PagingUser(UserInfo) {
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
    }

    /** Login User */
    LoginUser(UserInfo) {
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

    }

    /** User Email Check */
    EmailCheckUser(UserInfo) {
        return new Promise((resolve, reject) => {
            models.user.count({
                where: UserInfo.Email
            }).then(result => {
                resolve(result);
            }).catch(err => {
                console.log('check Email Dao Error code ::: ', err.code);
                console.log('check Email Dao Error ::: ', err);
                reject(err);
            });
        });
    }
};
module.exports = UserDao;