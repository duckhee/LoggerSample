//Default Chart Options
var DefaultOptions = {
    chart: {
        height: 350,
        type: 'area',
        stacked: false,
        event: {
            selection: function(chart, e) {
                console.log(new Date(e.xaxis.min));
            }
        },
    },
    title: {
        text: "Graph"
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight'
    },
    series: [],
    fill: {
        type: 'gradient',
        gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
        }
    },
    legend: {
        position: 'bottom',
        horizontalAlign: 'left',

    },
    noData: {
        text: 'Loading...'
    },
    xaxis: {
        type: 'datetime',

    },

    tooltip: {
        x: {
            format: 'yyyy/MM/dd HH:mm'
        },
    }
};


//function Make Chart (Area)
function MakeAreaChart(GetQuerySelectorId, titleText, options) {
    var option;
    var charts;
    if ((options === undefined) || (options === null)) {
        option = DefaultOptions;
    } else {
        option = options;
    }
    if (titleText === undefined || titleText === null) {

    } else {
        option.title.text = titleText;
    }
    charts = new ApexCharts(document.querySelector("#" + GetQuerySelectorId), option);
    charts.render();
    return charts;
}

function InputChartData(chart, id, options) {
    console.log('chart : ' + chart + ", options : " + options + "device id : " + id);
    return $.ajax({
        type: 'GET',
        url: '/beta/Data?no=' + id,
        dataType: 'json',
        error: function() {
            console.log('ajax error');
        },
        success: function(data) {
            console.log('get data : ', data);
            if (data.err) {
                console.log('data is null');
                return null;
            }
            return InsertChart(data, chart);
        }
    });
}

/** Function Insert data if make chart data make server side */
function InsertChart(data, chart) {
    //console.log("chart Data Insert : ", data[0]);
    chart.updateSeries(data).then(result => {
        for (let i in data) {
            chart.toggleSeries(data[i].name);
        }
    });
}

/** Change Yaxis Graph */
function ChangeYMinMax(data, chart) {
    /** Data Json {min:, max:} */
    /** if want to min max delete data = {min:null, max:null} */
    if (data == null) {
        data = { min: null, max: null };
    }
    return chart.updateOptions({ yaxis: data });
}