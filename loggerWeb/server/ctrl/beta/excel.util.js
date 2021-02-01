/** Beta DownLoad  */
const excel = require('excel4node');
/** New WorkBook */
const _Books = new excel.Workbook();
/** Sheet */
const _Sheets = _Books.addWorkSheet('Sheet 1');
/** Excel Sheet Style */
const style = _Books.createStyle({
    alignment: {
        horizontal: ['center'],
        vertical: ['center']
    },
    font: {
        size: 12,
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
});

const MakeChart = () => {

};

module.exports = {

};