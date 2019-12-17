const models = require('../../../../DataBase/models/index');
const user = require('../../../../DataBase/models/user');
/** Password Make */
const bcrypt = require('bcrypt-nodejs');

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

/** Login User */
const LoginUser = (UserInfo) => {
    console.log('User Info : ', UserInfo);
    return new Promise((resolve, reject) => {
        models.user.findOne({
            where: {
                UserEmail: UserInfo.email
            }
        }).then(LoginUser => {
            if (!bcrypt.compareSync(UserInfo.password, LoginUser.dataValues.UserPassword)) {
                console.log('compare password not match : ');
                return resolve(false);
            } else {
                /** Last Login Update (now value is updatedAt need to change columns?) */
                LastLogin(LoginUser.dataValues.UserEmail).then(result => {
                    return resolve(LoginUser.dataValues);
                }).catch(err => {
                    return reject(err);
                });
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

/** User Device LanLat */
const UserAllDeviceLatLan = (Email) => {
    return new Promise((resolve, reject) => {
        models.user.findOne({
            where: Email,
            include: {
                model: models.site,
                attributes: ['name'],
                include: {
                    model: models.plot,
                    attributes: ['PlotName'],
                    include: {
                        model: models.device,
                        attributes: ['Latitude', 'Longitude']
                    }
                }
            }
        }).then(result => {
            console.log('device gps : ', result);
            return resolve(result);
        }).catch(err => {
            console.log('Device Lan Lat Get Use Email Error code ::: ', err.code);
            console.log('Device Lan Lat Get Use Email Error ::: ', err);
            return reject(err);
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
    UserAllDeviceLatLan
};