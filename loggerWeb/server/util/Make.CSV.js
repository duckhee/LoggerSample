/** Load Excel Module */
const Excel = require('excel4node');
/** Load File Store Module */
const fs = require('fs');
/** Make work book */
const WorkBook = new Excel.Workbook();

/** Sheet Style Set */
const SheetStyle = WorkBook.createStyle({
    font: {
        color: "#0000",
        size: 12,
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -',
});

//TODO
/** Make Sheet */
const WorkSheet = WorkBook.addWorksheet('Sheet 1');