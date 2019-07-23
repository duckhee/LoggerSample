const MongooseUserDao = require('../../../dao/mongoose/admin/user/user.admin.mongoose.dao');
const MongooseLoggerDao = require('../../../dao/mongoose/admin/logger/logger.admin.mongoose.dao');

const IndexPage = (req, res, next) => {
    console.log('logger index page');
    res.redirect('/admin/logger/list');
};

const InsertPage = (req, res, next) => {
    console.log('insert logger page');
    res.render('admin/logger/insertPage', {
        login: req.session.userInfo
    });
};

const InsertDo = (req, res, next) => {
    let loggerFolder = req.body.loggerFolder;
    let loggerType = req.body.getType;
    let loggerOwner = req.body.userId;
    let loggerLatitude = req.body.latitude;
    let loggerLongitude = req.body.longitude;
    console.log('insert logger do');
    console.log('get body ::: ' + loggerFolder + ', get type ::: ' + loggerType + ", get owner logger :::: " + loggerOwner + ', get loggerLatitude ::: ' + loggerLatitude + ', get loggerLongitude :::: ' + loggerLongitude);
    MongooseUserDao.FindUserInfoById(loggerOwner).then(getUser => {
        console.log('get user info ::: ', getUser);
        var LoggerInfo = {
            UserInfo: getUser._id,
            LoggerFolderName: loggerFolder,
            LoggerKind: loggerType,
            latitude: loggerLatitude,
            longitude: loggerLongitude
        };

        MongooseLoggerDao.InsertInfoLogger(LoggerInfo).then(result => {
            getUser.loggerInfos.push(result._id);
            console.log('get user Logger Info array', getUser);
            MongooseUserDao.UserUpdateLogger(getUser).then(done => {
                console.log('done update user ::: ', done);
                console.log('insert logger info success :: ', result);
                console.log('insert logger info success :: ', result._id);
                res.redirect('/admin/logger/list');
            }).catch(err => {
                console.log('insert logger info error code ::: ', err.code);
                console.log('insert logger info error ::: ', err);
                res.redirect('/admin/logger/create');
            });

        }).catch(err => {
            console.log('insert logger info error code ::: ', err.code);
            console.log('insert logger info error ::: ', err);
            res.redirect('/admin/logger/create');
        });
    }).catch(err => {
        console.log('isnert logger get user info error code ::: ', err.code);
        console.log('isnert logger get user info error ::: ', err);
        res.redirect('/admin/logger/create');
    });


};

const LoggerNameCheck = (req, res, next) => {
    console.log('check ftp folder name it is unique');
    let LoggerName = req.body.LoggerFolderName;
    console.log('logger name ::: ', LoggerName);
    MongooseLoggerDao.LoggerNameCheck(LoggerName).then(result => {
        res.json(result);
    }).catch(err => {
        console.log('logger name check error code ::: ', err.code);
        console.log('logger name check error ::: ', err);
        res.json('-1');
    });

};

const ListPage = (req, res, next) => {
    console.log('logger list page');
    let getPage = req.param('page');
    let getKeyword = req.param('logger');
    console.log('get page ::: ' + getPage + ", getKeyword ::: " + getKeyword);
    var pageNum = 1;
    var pageInfo = {
        page: getPage,
        pageNum: pageNum,
        keyword: getKeyword
    };
    console.log('pre info ::: ', pageInfo);
    MongooseLoggerDao.PagingSearchInfoLogger(pageInfo).then(result => {
        console.log('page info result ::: ', result);
        res.render('admin/logger/listPage', {
            login: req.session.userInfo,
            logger: result.result,
            page: result
        });
    }).catch(err => {
        console.log('paging and search paging logger ctrl error code :::: ', err.code);
        console.log('paging and search paging logger ctrl error :::: ', err);
        res.redirect('/admin/logger/list');
    });

};

const detailPage = (req, res, next) => {
    console.log('admin logger detail page show ');
    const loggerNo = req.param('no');
    console.log('logger no ::: ', loggerNo);
    res.render('admin/logger/detailPage', {
        login: req.session.userInfo
    });
};

const downloadDo = (req, res, next) => {
    console.log('get download data ');
    const LoggerNo = req.param('no');
    console.log(LoggerNo);
    res.json('test');
};

module.exports = {
    IndexPage,
    InsertPage,
    LoggerNameCheck,
    InsertDo,
    ListPage,
    detailPage,
    downloadDo
};