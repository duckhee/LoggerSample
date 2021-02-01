const models = require('../../../../DataBase/models/index');
const user = require('../../../../DataBase/models/user');

/** Password Make */
const bcrypt = require('bcrypt-nodejs');
const SampleDao = (Email) => {
    return new Promise((resolve, reject) => {
        models.user.findOne({
            where: { UserEmail: Email },
            attributes: ['UserEmail', 'UserName'],
            include: {
                model: models.site,
                attributes: ['name'],
                include: {
                    model: models.plot,
                    attributes: ['PlotName'],
                    include: {
                        model: models.device,
                    }
                }
            }
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            return reject(err);
        });
    });
};

const LoginDao = (UserVO) => {
    return new Promise((resolve, reject) => {
        console.log("get Login User Beta Users...");
        models.user.findOne({
            where: {
                UserEmail: UserVO.Email
            }
        }).then(result => {
            console.log('result User Login : ', result);
            if (!bcrypt.compareSync(UserVO.password, result.dataValues.UserPassword)) {
                console.log("Not Match Beta User Password...");
                return resolve(null);
            } else {
                return resolve(result);
            }
        }).catch(err => {
            console.log("Beta User Login Error code ::: ", err.code);
            console.log("Beta User Login Error ::: ", err);
            return reject(err);
        });
    });
};

module.exports = {
    SampleDao,
    LoginDao
};