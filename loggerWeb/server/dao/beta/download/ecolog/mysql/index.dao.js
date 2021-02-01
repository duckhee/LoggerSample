/** Index Model */
const models = require('../../../../../DataBase/models/index');
/** Device Model */
const device = require('../../../../../DataBase/models/device');
/** Ecolog Model */
const ecolog = require('../../../../../DataBase/models/ecolog');
/** Ecolog Column Model */
const ecologColumn = require('../../../../../DataBase/models/ecologcolumn');
/** Excel Module */
const excel = require('excel4node');

/** Style Setting */
const DefaultSheetStyle = {
    alignment: {
        horizontal: ['center'],
        vertical: ['center']
    },
    font: {
        size: 10,
        bold: false,
    },
    border: {
        left: {
            style: 'thin',
            color: '#000000'
        },
        right: {
            style: 'thin',
            color: '#000000'
        },
        top: {
            style: 'thin',
            color: '#000000'
        },
        bottom: {
            style: 'thin',
            color: '#000000'
        }
    }
};
/** ApexChart Data Type Make */
const ApexChartData = (data) => {
    //console.log("Make Ecolog Chart Data : ", data);
    return new Promise((resolve, reject) => {
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
        console.log("value 1 : " + _returnValue1.data.length);
        console.log("value 2 : " + _returnValue2.data.length);
        console.log("value 3 : " + _returnValue3.data.length);
        console.log("value 4 : " + _returnValue4.data.length);
        console.log("value 5 : " + _returnValue5.data.length);
        console.log("value 6 : " + _returnValue6.data.length);
        if (_returnValue1.data.length !== 0) {
            _return.push(_returnValue1);
        }
        if (_returnValue2.data.length !== 0) {
            _return.push(_returnValue2);
        }
        if (_returnValue3.data.length !== 0) {
            _return.push(_returnValue3);
        }
        if (_returnValue4.data.length !== 0) {
            _return.push(_returnValue4);
        }
        if (_returnValue5.data.length !== 0) {
            _return.push(_returnValue5);
        }
        if (_returnValue6.data.length !== 0) {
            _return.push(_returnValue6);
        }

        return resolve(_return);
    });
};

/** Graph data get Module */
const graph = (no, options) => {
    console.log("Search Options : ", options);
    var option = {};
    /** select Options */
    if (options.start) {
        if (options.end) {
            option = {
                createdAt: {
                    [models.Sequelize.Op.between]: [options.start, options.end]
                }
            };
        }
    }

    return new Promise((resolve, reject) => {
        models.ecolog.findOne({
            where: {
                DeviceIdx: no
            },
            attributes: ['id'],
            include: [{
                model: models.ecologColumn,
                attributes: ['ecologName', 'ecologData', 'createdAt'],
                where: option
            }]
        }).then(result => {
            if (!result) {
                return resolve(0);
            }
            ApexChartData(result.dataValues.ecologColumns).then(results => {
                return resolve(results);
            }).catch(err => {
                console.log('Beta Ecolog Graph Data Make Error Code ::: ', err.code);
                console.log('Beta Ecolog Graph Data Make Error ::: ', err);
                return reject(err);
            });
        }).catch(err => {
            console.log("Beta Ecolog Graph Get Data Error Code ::: ", err.code);
            console.log("Beta Ecolog Graph Get Data Error ::: ", err);
            return reject(err);
        });
    });
};
/** CSV File Download Setting */
const MakeCSV = (data) => {
    return new Promise((resolve, reject) => {
        let datas = data.dataValues.ecologColumns;
        console.log("Make CSV File Format");
        if (data.dataValues.ecologColumns.length <= 0) {
            return reject(null);
        }
        /** Make WorkBook */
        const _WorkBook = new excel.Workbook();
        const SheetStyle = _WorkBook.createStyle(DefaultSheetStyle);
        let Sheets = _WorkBook.addWorksheet("Sheets");
        Sheets.cell(1, 1).string("날짜(년-월-일)").style(SheetStyle);
        Sheets.cell(1, 2).string("시간(시:분)").style(SheetStyle);
        Sheets.cell(1, 3).string("수위(M)").style(SheetStyle);
        Sheets.cell(1, 4).string("온도(℃)").style(SheetStyle);
        Sheets.cell(1, 5).string("EC(ms/cm)").style(SheetStyle);
        Sheets.cell(1, 6).string("염분").style(SheetStyle);
        Sheets.cell(1, 7).string("TDS(mg/L)").style(SheetStyle);
        Sheets.cell(1, 8).string("전원(V)").style(SheetStyle);
        let count = 0;
        let temp0 = 0,
            temp1 = 0,
            temp2 = 0,
            temp3 = 0,
            temp4 = 0,
            temp5 = 0;
        for (let i = 0; i < datas.length; i++) {
            //console.log("Make Data : ", datas[i]);
            if (datas[i].ecologName == "0001") {

                Sheets.cell(temp0 + 2, 3).string("" + datas[i].ecologData).style(SheetStyle);
                Sheets.cell(temp0 + 2, 1).date(new Date(datas[i].createdAt)).style({ numberFormat: 'yyyy-mm-dd' });
                let Dates = new Date(datas[i].createdAt);
                let GetHour = Dates.getHours() + 9;
                Dates.setHours(GetHour);
                Sheets.cell(temp0 + 2, 2).date(Dates).style({ numberFormat: 'HH:MM' });
                temp0++;
                count++;
            } else if (datas[i].ecologName == "0002") {
                Sheets.cell(temp1 + 2, 4).string("" + datas[i].ecologData).style(SheetStyle);
                temp1++;
                //Sheets.cell(i + 2, 1).date(new Date(datas[i].createdAt)).style({ numberFormat: 'yyyy-mm-dd:HH:MM' });
                count++;
            } else if (datas[i].ecologName == "0003") {
                Sheets.cell(temp2 + 2, 5).string("" + datas[i].ecologData).style(SheetStyle);
                temp2++;
                //Sheets.cell(i + 2, 1).date(new Date(datas[i].createdAt)).style({ numberFormat: 'yyyy-mm-dd:HH:MM' });
                count++;
            } else if (datas[i].ecologName == "0004") {
                Sheets.cell(temp3 + 2, 6).string("" + datas[i].ecologData).style(SheetStyle);
                temp3++;
                //Sheets.cell(i + 2, 1).date(new Date(datas[i].createdAt)).style({ numberFormat: 'yyyy-mm-dd:HH:MM' });
                count++;
            } else if (datas[i].ecologName === "0005") {
                Sheets.cell(temp4 + 2, 7).string("" + datas[i].ecologData).style(SheetStyle);
                temp4++;
                //Sheets.cell(i + 2, 1).date(new Date(datas[i].createdAt)).style({ numberFormat: 'yyyy-mm-dd:HH:MM' });
                count++;
            } else if (datas[i].ecologName === "0006") {
                Sheets.cell(temp5 + 2, 8).string("" + datas[i].ecologData).style(SheetStyle);
                temp5++;
                //Sheets.cell(i + 2, 1).date(new Date(datas[i].createdAt)).style({ numberFormat: 'yyyy-mm-dd:HH:MM' });
                count++;
            }
        }
        if (datas.length === count) {
            return resolve(_WorkBook);
        } else {
            return reject(null);
        }

    });
};

//TODO Change Stream Data exceljs module
/** Download data get Module */
const download = (no, options) => {
    console.log("Download Controller");
    return new Promise((resolve, reject) => {
        models.ecolog.findOne({
            where: {
                DeviceIdx: no
            },
            attributes: ['id'],
            include: [{
                model: models.ecologColumn,
                attribute: ['ecologName', 'ecologData', 'createdAt'],
                where: options
            }, {
                model: models.device,
                attributes: ['id', 'name']
            }]
        }).then(result => {
            if (!result) {
                console.log("Have Data is Null");
                return resolve(null);
            }
            console.log("Download Get Data ::: ", result.device);
            MakeCSV(result).then(results => {
                return resolve(results);
            }).catch(err => {
                console.log("Make CSV Error : ", err);
                return reject(null);
            });
        }).catch(err => {
            console.log("Beta Ecolog Download Data Error Code ::: ", err.code);
            console.log("Beta Ecolog Download Data Error ::: ", err);
            return reject(err);
        });
    });
};

module.exports = {
    graph,
    download
};