const excel = require('excel4node');

/** Make WorkBook */
const _WorkBook = new excel.Workbook();
/** Style Setting */
const SheetStyle = _WorkBook.createStyle({
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
});

const CSVDownload = (data, res) => {
    const sheet = _WorkBook.addWorksheet('sheet1');
};

module.exports = {
    CSVDownload
};