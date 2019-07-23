const User = require('../../../mongoModel/user/user.mongoose.model.js');

const LoginDo = (UserInfo) => {
    //console.log(UserInfo);
    return new Promise((resolve, reject) => {
        //console.log('request :::: '+UserInfo.req);
        User.findOne({
            userId: UserInfo.userId
        }, (err, users) => {
            if (err) {
                console.log('login user id find error code :::: ' + err.code);
                console.log('login user id find error :::: ' + err);
                reject(err);
                return;
            }
            console.log('result find :::: ' + users);
            if(users == null){
                console.log('not user');
                UserInfo.req.flash('loginFail', 'No user found.');
                resolve(null);
            }else{
                var checking = users.comparePassword(UserInfo.userPw);
                if (checking) {
                    //login success match        
                    resolve(users);
                    return;
                } else {
                    //login failed password not match
                    UserInfo.req.flash('loginFail', 'Wohh! Wrong password.');
                    resolve(false);
                    return;
                }
                //var checkValue = users.comparePassword(UserInfo.userPw);
                //console.log(checkValue);
            }
            
        });
    });
};


module.exports = {
    LoginDo
};