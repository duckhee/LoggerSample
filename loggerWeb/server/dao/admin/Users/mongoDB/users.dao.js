const UserModel = require('../../../../mongoModel/Users/user.mongoDB');

/** Admin Login */
const LoginDo = (LoginInfo) => {
    console.log('Admin Login Dao');

    UserModel.findOne({LoginInfo.UserId},(err, users)=>{
        if(err){
            console.log('Login User Dao Error Code : ', err.code);
            console.log('Login User Dao Error : ', err);
            return err;
        }else{
            const checking = users.comparePassword(UserInfo.userPw);
            var ReturnValue = '';
            if(checking && users.level === 1)
            {
                /** Check password and user level Success */

            }else{
                /** Check password and user level Failed */

            }

            return ReturnValue;
        }
    });
};


module.exports = {
    LoginDo
};