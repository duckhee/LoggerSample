const MongooseUserDao = require('../../dao/mongoose/user/user.mongoose.dao');

/**
 * Login page 
 */
const LoginPage = (req, res, next) => {
    console.log('login page show');
    res.render('user/login',{
        messages:req.flash('loginFail')
    });
};
/**
 * Login Do 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const LoginDo = (req, res, next) => {
    console.log('login post do ');
    const userId = req.body.userId;
    const userPw = req.body.userPw;
    var UserInfo = {
        userId: userId,
        userPw: userPw,
        req:req
    };
    MongooseUserDao.LoginDo(UserInfo).then(result => {
        if(result === false){
            console.log('not match password');
            req.flash('loginFail', 'Wohh! Wrong password.');
            res.redirect('/member/login');
        }else if(result == null || result == ""){
            console.log('not user');
            req.flash('loginFail', 'No user found.');
             res.redirect('/member/login');
        }else{
            req.session.userInfo = result;
            res.redirect('/');
        }
    }).catch(err => {
        console.log('login do error ctrl code :::: ', err.code);
        console.log('login do error ctrl :::: ', err);
    });
};

const LogoutDo = (req, res, next)=>{
    if(req.session.userInfo){
        req.session.destroy(function(){
            req.session;
            console.log('session destroy');
            res.clearCookie('secretekeywon');
            res.redirect('/');
        });
    }else{
        
    }
};

/**
 * user create page 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const UserCreatePage = (req, res, next) => {

};

/**
 * user create 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const UserCreateDo = (req, res, next) => {

};

module.exports = {
    LoginPage,
    LoginDo,
    LogoutDo,
    UserCreatePage,
    UserCreateDo
};