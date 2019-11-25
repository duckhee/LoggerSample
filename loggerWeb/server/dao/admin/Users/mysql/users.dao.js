const models = require('../../../../DataBase/models/index');
const user = require('../../../../DataBase/models/user');
/** Password Make */
var bcrypt = require('bcrypt-nodejs');

/** Registe User */
const RegisteUser = (UserInfo) => {

};
/** List User */
const ListUser = (UserInfo) => {

};
/** Paging user */
const PagingUser = (UserInfo) => {
    let offsetting = 0;
    return new Promise((resolve, reject) => {
        /** Count All User first */
        CountUser().then(result => {
            let AllMemberNumber = result;
            let PagingNum = ListInfo.pages;
            let offsetting = 1;
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
                //console.log('result value : ', result);
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

/** Login User */
const LoginUser = (UserInfo) => {
    console.log('User Info : ', UserInfo);
    return new Promise((resolve, reject) => {
        models.user.findOne({
            where: {
                UserEmail: UserInfo.email
            }
        }).then(result => {
            if (!bcrypt.compareSync(UserInfo.password, result.dataValues.UserPassword)) {
                console.log('compare password not match : ');
                return resolve(false);
            } else {
                console.log('password match : ');
                return resolve(result.dataValues);
            }

        }).catch(err => {
            console.log('Dao Login User Error code ::: ', err.code);
            console.log('Dao Login User Error ::: ', err);
            return reject(err);
        });
    });
};

/** Logout User */
const LogoutUser = (UserInfo) => {

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
    LoginUser,
    LogoutUser,
    EmailCheckUser,
};