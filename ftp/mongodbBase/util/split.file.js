
/**
 * file type is csv
 * read line and file line data make row data
 * return row data array
 */
const GetDataCSV = (fileLineData)=>{
    let rowData = fileLineData.split('\r\n');
    return rowData;
}


/**
 * file type is MIS
 * read line and file line data make row data
 * return row data array
 */
const GetDataMIS = (fileLineData)=>{

};


module.exports = {
    GetDataCSV,
    GetDataMIS
}