const Logger = require('../../../../mongoModel/logger/logger.info.mongoose.model');
const LoggerColumns = require('../../../../mongoModel/logger/logger.data.name.mongoose.model');
const LoggerData = require('../../../../mongoModel/logger/logger.data.mongoose.model');
const InsertInfoLogger = (LoggerInfo) => {
    return new Promise((resolve, reject) => {
        let LoggerModel = new Logger(LoggerInfo);
        LoggerModel.save((err, result) => {
            if (err) {
                console.log('insert logger info error code :::: ', err.code);
                console.log('insert logger info error :::: ', err);
                reject(err);
                return;
            }
            resolve(result);
            return;
        });
    });
};


const LoggerNameCheck = (LoggerName) => {
    return new Promise((resolve, reject) => {
        Logger.count({
            LoggerFolderName: LoggerName
        }, (err, result) => {
            if (err) {
                console.log('logger name check findOne error code ::: ', err.code);
                console.log('logger name check findOne error code ::: ', err.code);
                reject(err);
                return;
            }
            resolve(result);
        });
    });
};

const PagingSearchInfoLogger = (PageInfo) => {
    return new Promise((resolve, reject) => {
        Logger.count({}, (err, totalCounts) => {
            console.log('Dao insert info ::: ', PageInfo);
            if (PageInfo.page == null || PageInfo.page == 0) {
                PageInfo.page = 1;
            }
            var skipSize = (PageInfo.page - 1) * 10;
            var limitSize = 10;
            if (err) {
                console.log('logger info paging count error code ::: ', err.code);
                console.log('logger info paging count error ::: ', err);
                reject(err);
                return;
            }
            console.log('logger info total count number ::: ', totalCounts);
            PageInfo.pageNum = Math.ceil(totalCounts / limitSize);
            console.log('Page Number ::: ', PageInfo.pageNum);
            if ((PageInfo.keyword == null) || (keyword == '')) {
                Logger.find({}).populate('UserInfo').sort({
                    data: -1
                }).skip(skipSize).limit(limitSize).exec(function (err, pageCounts) {
                    if (err) {
                        console.log('logger info paging error code :::: ', err.code);
                        console.log('logger info paging error :::: ', err);
                        reject(err);
                        return;
                    }
                    var ResultInfo = {
                        result: pageCounts,
                        pageNum: PageInfo.pageNum,
                        page: PageInfo.page
                    };
                    resolve(ResultInfo);
                    return;
                });
            } else {
                //Logger.find({$or:[{}, {}]})
            }
        })
    });
};

const DeleteInfoLogger = (LoggerInfo) => {
    return new Promise((resolve, reject) => {

    });
};

const UpdateInfoLogger = (LoggerInfo) => {
    return new Promise((resolve, reject) => {

    });
};

const DetailInfoLogger = (LoggerInfo) => {
    return new Promise((resolve, reject) => {

    });
}

const ListByTestLoggerData = () => {
    return new Promise((resolve, reject) => {
        Logger.findOne({
            index: 0
        }).populate({
            path: 'UserInfo',
            select: 'userId'
        }).populate({
            path: 'LoggerData',
            select: 'fullValueData'
        }).populate({
            path: 'LoggerName',
            select: 'fullNameData',
        }).exec((err, res) => {
            if (err) {
                return reject(err);
            }
            //console.log('Logger Info ::::: ', res);

            return resolve(res);
        });
    });
};

module.exports = {
    InsertInfoLogger,
    LoggerNameCheck,
    PagingSearchInfoLogger,
    DeleteInfoLogger,
    UpdateInfoLogger,
    DetailInfoLogger,
    //Testing code
    ListByTestLoggerData
};