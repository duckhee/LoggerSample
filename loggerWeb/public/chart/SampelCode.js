function getAjaxMakeChartTempData(data) {
    var i = 0;
    var series = [];

    while (i < data.length) {
        var x = new Date(data[i].time).getTime();
        var y = data[i].temp;
        series.push([x, y]);
        i++;
    }
    return series;
}

function getAjaxMakeChartData(data) {
    var i = 0;
    var series = [];
    console.log(data);
    while (i < data.length) {
        var x = new Date(data[i].time).getTime();
        //console.log('x :::: '+x);
        var y = data[i].waterContent;
        //console.log('y :::: '+y);
        series.push([x, y]);
        i++;
    }
    return series;
}
//get data make and get data time set
function DrawDataChart() {

    var options = {
        chart: {
            height: 350,
            type: 'area',
            stacked: false,
        },
        title: {
            text: 'Logger Data',
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.6,
                opacityTo: 0.8,
            }
        },
        stroke: {
            curve: 'smooth'
        },
        series: [{
            name: 'series1',
            type: 'area',
            data: [31, 40, 28, 51, 42, 109, 100]
        }, {
            name: 'series2',
            type: 'area',
            data: [11, 32, 45, 32, 34, 52, 41]
        }],

        xaxis: {
            type: 'datetime',
            categories: ["2018-09-19T00:00:00", "2018-09-19T01:30:00", "2018-09-19T02:30:00", "2018-09-19T03:30:00", "2018-09-19T04:30:00", "2018-09-19T05:30:00", "2018-09-19T06:30:00"],
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        }
    }

    var chart = new ApexCharts(
        document.querySelector("#LoggerDataChart"),
        options
    );
    chart.render();
    return chart;
}
//logger data show function end
function DrawWeatherData() {
    var options = {
        chart: {
            height: 350,
            type: 'area',
            //type: 'line',
            //stacked: false,
        },
        title: {
            text: 'Weather Data',
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        series: [{
            name: 'series1',
            type: 'area',
            data: [31, 40, 28, 51, 42, 109, 100]
        }, {
            name: 'series2',
            type: 'bar',
            data: [11, 32, 45, 32, 34, 52, 41]
        }],

        xaxis: {
            type: 'datetime',
            categories: ["2018-09-19T00:00:00", "2018-09-19T01:30:00", "2018-09-19T02:30:00", "2018-09-19T03:30:00", "2018-09-19T04:30:00", "2018-09-19T05:30:00", "2018-09-19T06:30:00"],
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        }
    }

    var chart = new ApexCharts(
        document.querySelector("#WeaterhDataChart"),
        options
    );
    chart.render();
    return chart;
}

function downloadRange() {
    $('.daterange').daterangepicker({
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
        console.log(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        $("#startCal").val(start.format('YYYY-MM-DD'));
        $("#endCal").val(end.format('YYYY-MM-DD'));
        console.log('hidden value start :::: ' + $("#startCal").val() + ", hidden value end ::: " + $("#endCal").val())


        $.ajax({
            type: 'post',
            url: '/download/loggerData?no=4',
            dataType: 'json',
            data: {
                start: $("#startCal").val(),
                end: $("#endCal").val()
            },
            error: function () {

            },
            success: function (data) {
                $("#startCal").val('');
                $("#endCal").val('');
                console.log(data);
            }
        })

    });
}
//DataRange Logger
function LoggerDownLoad() {
    $("#LoggerDataDownload").daterangepicker({
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
        }
    }, function (start, end) {
        console.log(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        $("#startCal").val(start.format('YYYY-MM-DD'));
        $("#endCal").val(end.format('YYYY-MM-DD'));
        console.log('hidden value start :::: ' + $("#startCal").val() + ", hidden value end ::: " + $("#endCal").val())
    });
}
//DataRange Weather
function WeaterDownload() {
    $("#WeatherDataDownload").daterangepicker({
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
        }
    }, function (start, end) {
        console.log(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
        $("#startCal").val(start.format('YYYY-MM-DD'));
        $("#endCal").val(end.format('YYYY-MM-DD'));
        console.log('hidden value start :::: ' + $("#startCal").val() + ", hidden value end ::: " + $("#endCal").val())
    });
}
$(document).ready(function () {
    LoggerDownLoad();
    WeaterDownload();
    const Weather = DrawWeatherData();
    const Logger = DrawDataChart();
});