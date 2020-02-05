/** get Support Device */
const ConfigFile = require('../../../../../../../config/config.json');
/** Sequelize Model */
const models = require('../../../../../../DataBase/models/index');
/** Device Model */
const device = require('../../../../../../DataBase/models/device');
/** DataTracker Model */
const DataTracker = require('../../../../../../DataBase/models/datatracker');
/** DataTracker Name Column Model */
const DataTrackerColumnName = require('../../../../../../DataBase/models/datatrackercolumnname');
/** DataTracker Data Column Model */
const DataTrackerColumnData = require('../../../../../../DataBase/models/datatrackercolumndata');

/** Make DataTracker Column split comma Data */
const MakeDataTrackerChart = (data) => {
    return new Promise((resolve, reject) => {
        if (data.DataTrackerColumnName.length == 0) {
            return reject(null);
        }
        let Names = data.DeviceColumns[0].dataValues.nameColumn;
        let NameSplit = NameS.split(",");
        let DataOrigin = data.DataTrackerColumnData;
        let dataArray = [];
        for (let i in NameSplit) {
            let dataJson = {};
            dataJson.name = NameSplit[i];
            dataJson.data = [];
            if (Number(i))
        }
    });
};

/** DataTracker Graph */
const Graph = (no) => {
    return new Promise((resolve, reject) => {
        models.DataTracker.findOne({
            where: {
                DeviceIdx: no
            },
            attributes: ['DataTrackerIP', 'DataTrackerId'],
            include: [{
                    model: models.DataTrackerColumnName
                },
                {
                    model: models.DataTrackerColumnData
                }
            ]
        }).then(result => {
            console.log('result DataTracker : ', result.DataTrackerColumnName.nameColumn);
            /**  */
            if (result.DataTrackerColumnName.length == 0) {
                return res.json(null);
            }
            let Names = result.DataTrackerColumnName.nameColumn;
            let NamesSplit = Names.split(',');
            let dataOrigin = result.DataTrackerColumnData;
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
            console.log('data is : ', result.DataTrackerColumnData.length);
            for (let i = 0; i < dataOrigin.length; i++) {
                //console.log('data origin : ', dataOrigin[i].dataValues.columnValue.split(','));
                let splitData = dataOrigin[i].dataValues.DataColumn.split(',');
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
            /**  */
            return resolve(dataArray);
        }).catch(err => {
            console.log("Dao Graph DataTracker Error code ::: ", err.code);
            console.log("Dao Graph DataTracker Error ::: ", err);
            return reject(err);
        });
    });
};

/** Export Module */
module.exports = {
    Graph
};