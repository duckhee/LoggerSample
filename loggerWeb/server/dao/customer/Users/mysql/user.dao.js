const models = require('../../../../DataBase/models/index');
const user = require('../../../../DataBase/models/user');

const bcrypt = require('bcrypt-nodejs');


/** User Last Login Update Time */
const LastLogin = (UserId) => {
    console.log("User ID ", UserId);
    return new Promise((resolve, reject) => {
        models.sequelize.query("update users set updatedAt=:update where UserEmail= :email", { replacements: { update: new Date(), email: UserId } }).then(result => {
            return resolve(result);
        }).catch(err => {
            console.log('LastLogin Update time Error code ::: ', err.code);
            console.log('LastLogin Update time Error ::: ', err);
            return reject(err);
        });
    });
};

const LoginUser = (UserInfo) => {
    return new Promise((resolve, reject) => {
        models.user.findOne({
            where: {
                UserEmail: UserInfo.email
            }
        }).then(LoginUsers => {
            console.log('result : ', LoginUsers);
            if (LoginUsers) {
                if (!bcrypt.compareSync(UserInfo.password, LoginUsers.dataValues.UserPassword)) {
                    console.log("Not Match User Password!");
                    return resolve(false);
                } else {
                    LastLogin(LoginUsers.dataValues.UserEmail).then(result => {
                        return resolve(LoginUsers);
                    }).catch(err => {
                        console.log("Customer User Login Dao Update Login Time Error code ::: ", err.code);
                        console.log("Customer User Login Update Login Time Error ::: ", err);
                        return reject(err);
                    });
                }
            } else {
                return resolve(false);
            }
        }).catch(err => {
            console.log('Customer User Login Dao Error code ::: ', err.code);
            console.log('Customer User Login Dao Error ::: ', err);
            return reject(err);
        });
    });
};


module.exports = {
    LoginUser
};