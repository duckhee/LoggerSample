/** Device Dao */
const Dao = require('../../../dao/admin/Device/index.dao');
const AdminDeviceDao = Dao();

/** Select Last Ten Data */
const ListTenData = (req, res, next) => {
    let no = req.param.no || req.params.no || req.query.no || "";
    if (no === "") {
        return res.json(0);
    }
    return res.json(1);
};

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
        let Names = result.DeviceColumns[0].dataValues.columns;
        let NamesSplit = Names.split(',');
        let dataOrigin = result.DeviceColumnData;
        let dataArray = [];
        for (let i in NamesSplit) {
            let dataJson = {};
            dataJson.name = NamesSplit[i];
            dataJson.data = [];
            if (Number(i) !== 0)
                dataArray.push(dataJson);

        }
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
                    dataArray[i2 - 1].data.push([DataTime, InsertData]);
                    //console.log(chartData);
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

module.exports = {
    ListAllData
};