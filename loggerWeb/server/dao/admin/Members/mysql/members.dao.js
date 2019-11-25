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
/** Count User */
const CountUser = () => {
    return new Promise((resolve, reject) => {
        models.user.count().then(result => {
            console.log('user Counter : ', result);
            return resolve(result);
        }).catch(err => {
            console.log('Dao Counter User Error code ::: ', err.code);
            console.log('Dao Counter User Error code ::: ', err.code);
            return reject(err);
        });
    });
};

/** List User */
const ListUser = (UserInfo) => {
    return new Promise((resolve, reject) => {
        models.user.findAll().then(result => {
            return resolve(result);
        }).catch(err => {
            return reject(err);
        });
    });
};
/** Paging user */
const PagingUser = (ListInfo) => {
    let offsetting = 0;
    return new Promise((resolve, reject) => {
        /** Count All User first */
        CountUser().then(result => {
            let AllMemberNumber = result;
            let PagingNum = ListInfo.pages;
            let offsetting = 0;
            let MaxPages = parseInt(AllMemberNumber / 10 + 1);
            console.log('user count ::: ', AllMemberNumber);
            console.log('Page Info : ', ListInfo);
            if (PagingNum > 1) {
                offsetting = 10 * (PagingNum - 1);
            }
            console.log('offset : ', offsetting);
            /** Search Options */
            let SearchOptions = {};
            if (ListInfo.SearchesByName !== "") {
                SearchOptions.UserName = ListInfo.SearchesByName;
            }
            if (ListInfo.SearchesById !== "") {
                SearchOptions.UserEmail = ListInfo.SearchesById;
            }
            if (ListInfo.SearchesByLevel !== "") {
                SearchOptions.UserLevel = ListInfo.SearchesByLevel;
            }
            /** paging Logic */
            models.user.findAll({
                where: SearchOptions,
                limit: 10,
                offset: offsetting
            }).then(result => {
                console.log('result value : ', result);
                /** return value */
                let returnValue = {
                    offset: offsetting,
                    value: result,
                    pageNumber: MaxPages
                };
                return resolve(returnValue);
            }).catch(err => {
                console.log('Dao Paging User Error code ::: ', err.code);
                console.log('Dao Paging User Error ::: ', err);
                return reject(err);
            });

        });

    });

};

/** Delete User */
const DeleteUser = (UserInfo) => {

    return new Promise((resolve, reject) => {
        if (UserInfo.id === "") {
            return resolve(false);
        }
        models.user.destroy({
            where: {
                id: UserInfo.id
            }
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            console.log('Dao Delete User Error code ::: ', err.code);
            console.log('Dao Delete User Error ::: ', err);
            return reject(err);
        });
    });
};


/** User Email Check */
const EmailCheckUser = (Email) => {
    return new Promise((resolve, reject) => {
        models.user.count({
            where: {
                UserEmail: Email
            }
        }).then(result => {
            resolve(result);
        }).catch(err => {
            console.log('check Email Dao Error code ::: ', err.code);
            console.log('check Email Dao Error ::: ', err);
            reject(err);
        });
    });
};

module.exports = {
    RegisteUser,
    ListUser,
    PagingUser,
    DeleteUser,
    EmailCheckUser,
};