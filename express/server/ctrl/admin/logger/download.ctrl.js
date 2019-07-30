const fs = require('fs');
const excel = require('excel4node');

/**
 * use local function
 * @param {*} fileInfo 
 */
const MakeCSV = (fileInfo)=>{
    /** sheet make setting */
    let csvFile = new excel.Workbook();
    let firstSheet = csvFile.addWorksheet('sheet1');
    /** sheet style setting */
    let sheetStyle = csvFile.createStyle({
        alignment:{
            horizontal:['center'],
            vertical:['center']
        },
        font:{
            size:10,
            bold:false,
        },
        border:{
            left:{
                style:'thin',
                color: '#000000'
            },
            right:{
                style:'thin',
                color: '#000000'
            },
            top:{
                style:'thin',
                color: '#000000'
            },
            bottom:{
                style:'thin',
                color: '#000000'
            }
        }
    });
    let CSVJson = {
        sheet:firstSheet,
        style:sheetStyle,
        csv:csvFile
    };

    return CSVJson;
};