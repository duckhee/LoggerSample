//DataRange Logger
function MakeRangeBtn(BtnJqueryId, HiddenStartJqueryId, HiddenEndJqueryId) {
    BtnJqueryId.daterangepicker({
        opens: 'left',
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
    }, function (start, end) {
        /*
            let ReturnJson = {
                startDate: start.format('YYYY-MM-DD'),
                endDate: end.format('YYYY-MM-DD')
            };
            return ReturnJson;
        */
        HiddenStartJqueryId.val(start.format('YYYY-MM-DD'));
        HiddenEndJqueryId.val(end.format('YYYY-MM-DD'))
    });
}