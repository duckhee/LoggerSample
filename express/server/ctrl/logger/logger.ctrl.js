const AdminLoggerDao = require('../../dao/mongoose/admin/logger/logger.admin.mongoose.dao');


const TestingChart = (req, res, next) => {
    console.log('Get Make Chart');
    const LoggerNo = req.param('no');
    AdminLoggerDao.ListByTestLoggerData().then(result => {
        console.log('list result ::: ', result);
        res.render('test', {
            login: req.session.userInfo
        });
    }).catch(err => {
        res.json(err);
    });
};

const GetLoggerData = (req, res, next) => {
    console.log('get Logger Data All');
    const LoggerNo = req.param('no');
    AdminLoggerDao.ListByTestLoggerData().then(result => {
        //console.log("result change value ::: ", ReturnValue);
        //res.json(ReturnValue);
        res.json(result);
    }).catch(err => {
        res.json(err);
    });
};

const GetTestingLogger = (req, res, next) => {
    let NameMake = (result) => {
        let newReturnValue = new Array();
        let returnValue = result.split(',');
        for (let i in returnValue) {
            if (i != 0) {
                newReturnValue.push(returnValue[i]);
            }
        }
        return newReturnValue;
    };
    let MakeDataSeries = (InsertData, NameSeries) => {
        let DataArrayResult = new Array();
        for (let i = 0; i < NameSeries.length; i++) {
            DataArrayResult[i] = new Array();
            for (let k = 0; k < InsertData.length; k++) {
                DataArrayResult[i][k] = new Array();
            }
        }
        let flag;
        for (let i in NameSeries) {
            for (let k in InsertData) {
                if (InsertData[k].fullValueData != undefined) {
                    let GetData = InsertData[k].fullValueData.split(',');
                    flag = 0;
                    let x;
                    for (var k2 in GetData) {
                        if (k2 == 0) {
                            x = new Date(GetData[k2]).getTime();
                        } else {
                            let y = GetData[k2];
                            //DataArrayResult[flag][k] = ([x, y]);
                            const re = /[a-z]|[A-Z]/g;
                            if (y.match(re)) {
                                y = "-99999";
                            }
                            DataArrayResult[flag][k] = ([x, y]);
                            flag++;
                        }
                    }
                }
            }
        }
        return DataArrayResult;
    };

    const LoggerNo = req.param('no');
    if (LoggerNo == undefined || LoggerNo == null) {
        console.log("Not Logger Get");
        res.json(null);
    } else {
        console.log("Get Logger Num ::: ", LoggerNo);
        AdminLoggerDao.ListByTestLoggerData(LoggerNo).then(DataResult => {
            let Names = NameMake(DataResult.LoggerName.fullNameData);
            let DataSeries = MakeDataSeries(DataResult.LoggerData, Names);
            let ReturnValueJson = {
                NameValue: Names,
                DataValue: DataSeries
            }
            res.json(ReturnValueJson);
        });
    }

};

module.exports = {
    GetLoggerData,
    GetTestingLogger
};