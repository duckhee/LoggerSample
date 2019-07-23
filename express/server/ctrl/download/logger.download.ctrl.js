const downloadLoggerData = (req, res, next) => {
    console.log('get download data ');
    const LoggerNo = req.param('no');
    const LoggerStartDate = req.body.start;
    const LoggerEndDate = req.body.end;
    console.log('Logger no ::: ' + LoggerNo + ", Logger Start Date :: " + LoggerStartDate + ", Logger End Date ::: " + LoggerEndDate);

    res.json('test');
};

module.exports = {
    downloadLoggerData,

}