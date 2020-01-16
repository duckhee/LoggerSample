/** Device Dao */
const Dao = require('../../../dao/admin/Device/index.dao');
const AdminDeviceDao = Dao();

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
        console.log("Name Split Length : ", NamesSplit.length);
        for (let i in NamesSplit) {
            let dataJson = {};
            dataJson.name = NamesSplit[i];
            dataJson.data = [];
            if (Number(i) !== 0) {
                console.log('data json ', dataArray.length);
                dataArray.push(dataJson);
            }

        }
        console.log("Name Input Array : ", dataArray);
        console.log('data is : ', result.DeviceColumnData.length);
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

}

module.exports = {
    ListAllData,
    ListAllDeviceLangLat,
    UserAllDeviceLangLat,
    _SampleCapture
};