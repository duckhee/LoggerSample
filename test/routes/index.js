var express = require('express');
var router = express.Router();
const models = require('../db/models/index');
const ecolog = require('../db/models/ecolog');
const ecologColumn = require('../db/models/ecologcolumn');

const fs = require('fs');
const Excel = require('exceljs');


const test = () => {
    return new Promise((resolve, reject) => {
        models.ecolog.findOne({
            where: {
                DeviceIdx: 2
            },
            attributes: ['id'],
            include: [{
                model: models.ecologColumn,
                attributes: ['ecologName', 'ecologData', 'createdAt'],

            }]
        }).then(result => {
            return resolve(result);
        }).catch(err => {
            return reject(err);
        });
    });
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/test', (req, res, next) => {

    test().then(result => {
        let test = fs.createWriteStream('test.txt');

        test.write(JSON.stringify(result));
        test.close(() => {

            //res.writeHead(200, { 'Content-disposition': 'attachment; filename=package.json"}' }); //here you can


            let tests = fs.createReadStream("./test.txt");

            res.attachment("test.csv"); //download file name 
            tests.pipe(res);
            //return res.download("test.txt");
            return fs.unlinkSync("test.txt");

        });
    }).catch(err => {

        return res.json(err);
    });
});

router.get('/test2', (req, res, next) => {
    let workbook = new Excel.Workbook();

    var worksheet = workbook.addWorksheet('My Sheet');

    worksheet.columns = [
        { header: '"센서 날짜(년-월-일)"', key: '1' },
        { header: '센서 시간(시:분)', key: '2' },
        { header: '수위(M)', key: '3' },
        { header: '온도(℃)', key: '4' },
        { header: 'EC(ms/cm)', key: '5' },
        { header: '염분', key: '6' },
        { header: 'TDS(mg/L)', key: '7' },
        { header: '', key: '8' },
        { header: '전원 날짜(년-월-일)', key: '9' },
        { header: '전원 시간(시:분)', key: '10' },
        { header: '전원(V)', key: '11' },
    ];
    //worksheet.addRow({ id: "oceanfog", name: '경록', contact: "010-3588-6265" });
    //worksheet.addRow({ id: "oceanfog2", name: '경록2', contact: "010-3588-6265" });
    worksheet.getCell(2, 3).value = 3;


    workbook.csv.writeFile("hello.csv").then(function() {
        // done
        console.log("success");
        res.attachment();
        return res.download("hello.csv");
    }).catch(err => {
        console.log("err : ", err);
    })
});

router.get('/test3', (req, res) => {
    let workbook = new Excel.Workbook();
    //  let workbook = new Excel.stream.xlsx.WorkbookWriter({ stream: res, useStyles: false, userSharedStrings: false });
    let sheets = workbook.addWorksheet("test");
    sheets.columns = [
        { header: '"센서 날짜(년-월-일)"', key: '1' },
        { header: '센서 시간(시:분)', key: '2' },
        { header: '수위(M)', key: '3' },
        { header: '온도(℃)', key: '4' },
        { header: 'EC(ms/cm)', key: '5' },
        { header: '염분', key: '6' },
        { header: 'TDS(mg/L)', key: '7' },
        { header: '', key: '8' },
        { header: '전원 날짜(년-월-일)', key: '9' },
        { header: '전원 시간(시:분)', key: '10' },
        { header: '전원(V)', key: '11' },
    ];
    let temp0 = 0,
        temp1 = 0,
        temp2 = 0,
        temp3 = 0,
        temp4 = 0,
        temp5 = 0,
        temp6 = 0;
    test().then(result => {
        let counts = 0;
        let test = [];
        result.dataValues.ecologColumns.forEach(items => {
            test.push(new Promise(function(resolve, reject) {
                if (items.ecologName == "0001") {
                    let dates = new Date(items.createdAt);
                    sheets.getCell(2 + temp0, 1).value = String(dates.getFullYear()) + "-" + String(dates.getMonth() + 1) + "-" + String(dates.getDate());
                    sheets.getCell(2 + temp0, 2).value = String(dates.getHours()) + ":" + String(dates.getMinutes());
                    sheets.getCell(2 + temp0, 3).value = items.ecologData;
                    temp0++;
                } else if (items.ecologName == "0002") {

                    sheets.getCell(2 + temp1, 4).value = items.ecologData;
                    temp1++;
                } else if (items.ecologName == "0003") {
                    sheets.getCell(2 + temp2, 5).value = items.ecologData;
                    temp2++;
                } else if (items.ecologName == "0004") {
                    sheets.getCell(2 + temp3, 6).value = items.ecologData;
                    temp3++;
                } else if (items.ecologName == "0005") {
                    sheets.getCell(2 + temp4, 7).value = items.ecologData;
                    temp4++;
                } else if (items.ecologName == "0006") {
                    let dates = new Date(items.createdAt);
                    sheets.getCell(2 + temp5, 9).value = String(dates.getFullYear()) + "-" + String(dates.getMonth() + 1) + "-" + String(dates.getDate());
                    sheets.getCell(2 + temp5, 10).value = String(dates.getHours()) + ":" + String(dates.getMinutes());
                    sheets.getCell(2 + temp5, 11).value = items.ecologData;
                    temp5++;
                }
                counts++;
                // console.log("temp0 : " + temp0 + ", temp1 : " + temp1 +
                //     ", temp2 : " + temp2 + ", temp3 : " + temp3 +
                //     ", temp4 : " + temp4 + ", temp5 : " + temp5);
                resolve();
            }));
        });
        //
        Promise.all(test).then(() => {
            workbook.csv.writeFile("hello.csv").then(function() {
                //     // done
                res.attachment();
                console.log("success");
                return res.download("hello.csv");
                //fs.unlinkSync("hello.csv");
            })
        }).catch(err => {
            console.log("err : ", err);
            return res.json(err);
        });
    }).catch(err => {
        console.log("Error : ", err);
        return res.json(err);
    });

});

module.exports = router;