const bcrypt = require('bcrypt-nodejs');
const User = require('../../../../mongoModel/user/user.mongoose.model');

/**
 * 
 * @param {*} UserInfo 
 * user info = 
 * {
 *  userId:
 *  userPw:
 *  userName:
 * }
 */
const InsertUser = (UserInfo) => {
    return new Promise((resolve, reject) => {
        
        var newUser = new User(UserInfo);
        newUser.save((err, item) => {
            if (err) {
                console.log('insert user mongoose error code :::: ' + err.code);
                console.log('insert user mongoose error :::: ' + err);
                reject(err);
                return;
            } else if (item) {
                resolve(item);
                return;
            }
        });
    });
};

const FindUserCountById = (UserInfo) => {
    return new Promise((resolve, reject) => {
        User.count({
            userId: UserInfo.userId
        }, (err, res) => {
            if (err) {
                console.log('count user id check error code :::: ' + err.code);
                console.log('count user id check error :::: ' + err);
                reject(err);
                return;
            } else {
                console.log('Testing ::: ' + res);
                resolve(res);
                return;
            }
        });
    });
};

const FindUserInfoById = (insertId)=>{
    return new Promise((resolve, reject)=>{
        User.findOne({userId:insertId}, (err, result)=>{
            if(err){
                console.log('user id get find info error code ::: ', err.code);
                console.log('user id get find info error ::: ', err);
                reject(err);
                return;
            }
            resolve(result);
            return;
        });
    });
};

const FindUserInfoAll = (insertId)=>{
return new Promise((resolve, reject)=>{
    User.findOne({index:insertId}).populate('loggerInfos').exec(function(err, result){
        if(err){
            console.log('find user into all and logger info error code :::: ', err.code);
            console.log('find user into all and logger info error :::: ', err);
            reject(err);
            return;
        }
        console.log('result data ::: ', result);
        resolve(result);
        return;
    });
})
};

const LoginDo = (UserInfo) => {
    console.log(UserInfo);
    return new Promise((resolve, reject) => {

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
            var checking = users.comparePassword(UserInfo.userPw);
            if (checking) {
                //login success match`
            } else {
                //login failed password not match
            }
            resolve(users);
            return;

        });
    });
};

const FindUserByIndex = (userIndex)=>{
    return new Promise((resolve, reject)=>{
        User.findOne({_id:userIndex}, (err, user)=>{
            if(err){
                console.log('User find by index error code ::: ', err.code);
                console.log('User find by index error :::: ', err);
                reject(err);
                return;
            }
            resolve(user);
            return;
        });
    });
};

const ListUser = ()=>{
    return new Promise((resolve, reject)=>{
        User.find({}, (err, users)=>{
            if(err){
                console.log('List User error code :::: '+err.code);
                console.log('List User error :::: '+err);
                reject(err);
                return;
            }else{
                resolve(users);
                return;
            }
        });
    });
};

const DeleteUser = (UserInfo) => {
    return new Promise((resolve, reject) => {

    });
};

const UpdateUser = (UserInfo) => {

};

const UserCount = ()=>{
    return new Promise((resolve, reject)=>{
        User.count({}, (err, userCount)=>{
            if(err){
                console.log('user count error code ::: ', err.code);
                console.log('user count error :::: ', err.code);
                reject(err);
                return;
            }
            console.log('user count number ::: ', userCount);
            resolve(userCount);
            return;
        });
    });
};

const PagingSearch = (PageInfo)=>{
    //let pageNum = 1;
    return new Promise((resolve, reject)=>{
        console.log('Dao insert info ::: ',PageInfo);
        if(PageInfo.page == null || PageInfo.page == 0){
            PageInfo.page = 1;
        }
        var skipSize = (PageInfo.page - 1)*10;
        var limitSize = 10;
        User.count({}, (err, totalCount)=>{
            if(err){
                console.log('user paging get total error code ::: ', err.code);
                console.log('user paging get total error ::: ', err);
                reject(err);
                return;
            }
            console.log('total count ::: ', totalCount);
            PageInfo.pageNum = Math.ceil(totalCount/limitSize);
            //pageNum = Math.ceil(totalCount/limitSize);
            console.log('Page Number ::: ',PageInfo.pageNum);
            if((PageInfo.keyword == null) || PageInfo.keyword == ''){
                User.find({}).sort({data:-1}).skip(skipSize).limit(limitSize).exec(function(err, pageCounts){
                    if(err){
                        console.log('user paging error code ::::', err.code);
                        console.log('user paging error ::::', err);
                        reject(err);
                        return;
                    }
                    var ResultInfo = {
                        result:pageCounts,
                        pageNum:PageInfo.pageNum,
                        page:PageInfo.page
                    };
                    resolve(ResultInfo);
                    return;
                });
            }else{
                User.find({$or:[{userId:PageInfo.keyword}, {userName:PageInfo.keyword}]}).sort({data:-1}).skip(skipSize).limit(limitSize).exec(function(err, pageCounts){
                    if(err){
                        console.log('user paging error code ::::', err.code);
                        console.log('user paging error ::::', err);
                        reject(err);
                        return;
                    }
                    var ResultInfo = {
                        result:pageCounts,
                        pageNum:PageInfo.pageNum,
                        page:PageInfo.page
                    };
                    console.log('search result ::: ', pageCounts);
                    resolve(ResultInfo);
                    return;
                });
            }
        });
    });
};

const UserUpdateLogger = (UserInfo)=>{
    console.log('admin logger update dao');
    return new Promise((resolve, reject)=>{
        User.update({
            _id:UserInfo._id
        },{$set:UserInfo}, function(err, output){
            if(err){
                console.log('User insert logger error code :::: ', err.code);
                console.log('User insert logger error :::: ', err);
                reject(err);
                return;
            }
            console.log('update output ::: ', output);
            resolve(output);
            return;
        });
    });
};

module.exports = {
    InsertUser,
    FindUserCountById,
    FindUserByIndex,
    FindUserInfoAll,
    FindUserInfoById,
    LoginDo,
    ListUser,
    UserCount,
    PagingSearch,
    UserUpdateLogger
};