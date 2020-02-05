//TODO Change Stream All
/** Device Dao */
//TODO Change
const Dao = require('../../../dao/admin/Device/index.dao');
const AdminDeviceDao = Dao();
/** Graph Dao */
const _Dao = require('../../../dao/admin/Device/mysql/graph/graph.interface.dao');


/** Insert Data */
const InsertData = (req, res, next) => {

};

/** File Insert Data */
const InsertFileData = (req, res, next) => {

};

/** Select Last Ten Data */
const ListTenData = (req, res, next) => {
    let no = req.param.no || req.params.no || req.query.no || "";
    if (no === "") {
        return res.json(0);
    }
    return res.json(1);
};

//TODO
/** Select All Data */
const ListAllData = (req, res, next) => {
    let no = req.param.no || req.params.no || req.query.no || "";
    //console.log('Testing Json Data : ', no);
    if (no === "") {
        return res.json(0);
    }
    AdminDeviceDao.DetailGraphDevice(no).then(result => {
        //console.log('data is : ', result);
        //console.log('detail data json end ');
        //console.log('Name Array : ', result.DeviceColumns[0].dataValues.columns);
        if (result.DeviceColumns.length == 0) {
            return res.json(null);
        }
        let Names = result.DeviceColumns[0].dataValues.columns;
        let NamesSplit = Names.split(',');
        let dataOrigin = result.DeviceColumnData;
        let dataArray = [];
        //console.log("Name Split Length : ", NamesSplit.length);
        for (let i in NamesSplit) {
            let dataJson = {};
            dataJson.name = NamesSplit[i];
            dataJson.data = [];
            if (Number(i) !== 0) {
                //console.log('data json ', dataArray.length);
                dataArray.push(dataJson);
            }

        }
        //console.log("Name Input Array : ", dataArray);
        //console.log('data is : ', result.DeviceColumnData.length);
        for (let i = 0; i < dataOrigin.length; i++) {
            //console.log('data origin : ', dataOrigin[i].dataValues.columnValue.split(','));
            let splitData = dataOrigin[i].dataValues.columnValue.split(',');
            let DataTime;
            for (let i2 in splitData) {
                if (i2 == 0) {
                    //console.log('get Time : ', splitData[i2]);

                    DataTime = new Date(splitData[i2]); //.getTime();
                } else {
                    let chartData = splitData[i2];
                    let InsertData = parseFloat(chartData);
                    if (isNaN(InsertData)) {
                        InsertData = null;
                    }
                    //console.log("Data Check : ", Array.isArray(dataArray[i2 - 1].data));
                    //TODO
                    try {
                        dataArray[i2 - 1].data.push([DataTime, InsertData]);
                    } catch (err) {
                        //console.log("Array Data Check : ", dataArray[i2 - 1]);
                        //console.log(i2 - 1);
                        console.log("data Array Number : " + (i2 - 1) + "," + err);
                    }

                }
            }

        }
        //console.log('JSON data Array : ', dataArray);

        return res.json(dataArray);
    }).catch(err => {
        console.log('get Device Data Json Error code ::: ', err.code);
        console.log('get Device Data Json Error ::: ', err);
        return res.json(0);
    });
};


/** select Device LangLat */
const ListAllDeviceLangLat = (req, res, next) => {
    const email = req.query.email || req.body.email || "";
    return res.json(email);
};
/** select Device LangLat */
const UserAllDeviceLangLat = (req, res, next) => {
    const email = req.query.email || req.body.email || "";
    return res.json(email);
};



//TODO
/** Camera Direct View Test */
const request = require('request');
let HUrl = "http://223.171.44.131:8888/ISAPI/Streaming/channels/1/picture";
const _SampleCapture = (req, res, next) => {
    const Id = req.query.id || req.body.id || req.param.id || req.params.id || "";
    const Pass = req.query.password || req.body.password || req.param.password || req.params.password || "";
    if (Id == "") {
        return res.json(null);
    }
    if (Pass == "") {
        return res.json(null);
    }
    request.get(HUrl, { auth: { 'user': Id, password: Pass }, encoding: 'binary' }, function(error, response, body) {
        if (error) {
            return res.json(error);
        }
        res.writeHead(200, { 'Content-Type': 'image/jpg' });

        res.end(body, 'binary');
    });

};

//TODO Ecolog Make ApexChart
const MakeEcologChart = (data) => {
    //console.log("Make Ecolog Chart Data : ", data);
    return new Promise((resolve, reject) => {
        //console.log('test Ecolog Chart : ', data);
        let _return = [];
        if (data.length == 0) {
            console.log("Not Data");
            return reject(null);
        }
        let _returnValue1 = {};
        let _returnValue2 = {};
        let _returnValue3 = {};
        let _returnValue4 = {};
        let _returnValue5 = {};
        let _returnValue6 = {};
        let data1 = [];
        let data2 = [];
        let data3 = [];
        let data4 = [];
        let data5 = [];
        let data6 = [];

        for (var i = 0; i < data.length; i++) {
            //            _SetJson.data = [new Date(data[i].createdAt), data[i].ecologData];
            if (data[i].ecologName == "0001") {
                _returnValue1.name = "깊이(M)";
                //_returnValue1.data.push([new Date(data[i].createdAt), data[i].ecologData]);
                data1.push([new Date(data[i].createdAt), data[i].ecologData]);
            } else if (data[i].ecologName == "0002") {
                _returnValue2.name = "온도(℃)";
                data2.push([new Date(data[i].createdAt), data[i].ecologData]);
                //_returnValue2.data.push([new Date(data[i].createdAt), data[i].ecologData]);
            } else if (data[i].ecologName == "0003") {
                _returnValue3.name = "EC(ms/cm)";
                data3.push([new Date(data[i].createdAt), data[i].ecologData]);
                //_returnValue3.data.push([new Date(data[i].createdAt), data[i].ecologData]);
            } else if (data[i].ecologName == "0004") {
                _returnValue4.name = "염분";
                data4.push([new Date(data[i].createdAt), data[i].ecologData]);
                //_returnValue4.data.push([new Date(data[i].createdAt), data[i].ecologData]);
            } else if (data[i].ecologName == "0005") {
                _returnValue5.name = "TDS(mg/L)";
                data5.push([new Date(data[i].createdAt), data[i].ecologData]);
                //_returnValue5.data.push([new Date(data[i].createdAt), data[i].ecologData]);
            } else if (data[i].ecologName == "0006") {
                _returnValue6.name = "전원(V)";
                data6.push([new Date(data[i].createdAt), data[i].ecologData]);
                //_returnValue6.data.push([new Date(data[i].createdAt), data[i].ecologData]);
            }
            //console.log("SET JSON : ", _SetJson);
        }
        _returnValue1.data = data1;
        _returnValue2.data = data2;
        _returnValue3.data = data3;
        _returnValue4.data = data4;
        _returnValue5.data = data5;
        _returnValue6.data = data6;

        _return.push(_returnValue1);
        _return.push(_returnValue2);
        _return.push(_returnValue3);
        _return.push(_returnValue4);


        return resolve(_return);



    });
};

//TODO Graph Ecolog Only Need to All Device
const TestEcolog = (req, res, next) => {
    const no = req.query.no || req.body.no || req.param.no || req.params.no || "";
    console.log("Ecolog graph Test : ", no);
    console.log("DAO is ", _Dao);
    if (no === "") {
        return res.json(null);
    }
    AdminDeviceDao.GetDeviceType(no).then(results => {
        //console.log('get Device Type : ', results);
        _Dao.GraphSelect["ecolog"]().Graph(no).then(result => {
            //console.log("GET DATA : ", result.dataValues.ecolog.ecologColumns);
            MakeEcologChart(result.dataValues.ecolog.ecologColumns).then(_returnResult => {
                //return res.json(result.dataValues.ecolog.ecologColumns);
                return res.json(_returnResult);
            }).catch(err => {
                console.log("ERROR ", err);
                return res.json(null);
            });
        }).catch(err => {
            console.log("ERROR null ", err);
            return res.json(null);
        });
    }).catch(err => {
        return res.json(null);
    });
};


//TODo
/** Select Device Type */
const TestMode = (req, res, next) => {
    const no = req.query.no || req.body.no || req.param.no || req.params.no || "";
    console.log("Ecolog graph Test : ", no);
    console.log("DAO is ", _Dao);
    if (no === "") {
        return res.json(null);
    }
    AdminDeviceDao.GetDeviceType(no).then(results => {
        console.log('get Device Type : ', results.DeviceType);
        _Dao.GraphSelect[results.DeviceType]().Graph(no).then(result => {
            //console.log("GET DATA : ", result.dataValues.ecolog.ecologColumns);
            return res.json(result);
        }).catch(err => {
            console.log("ERROR null ", err);
            return res.json(null);
        });
    }).catch(err => {
        return res.json(null);
    });
};
module.exports = {
    ListAllData,
    ListAllDeviceLangLat,
    UserAllDeviceLangLat,
    _SampleCapture,
    //TODO Test Controller
    TestEcolog
};