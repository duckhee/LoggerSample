const Excel = require('excel4node');
const fs = require('fs');

class MakeCSV {
    constructor() {
        this.WorkBook = new Excel.Workbook();
        this.SheetStyle = this.WorkBook.createStyle({
            font: {
                color: "#0000",
                size: 12,
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -',
        });
    }

    /** Make CSV File  */
    MakeCSV() {

    }
}



module.exports = MakeCSV();