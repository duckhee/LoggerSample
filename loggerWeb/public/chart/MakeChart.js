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
        curve: 'smooth'
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
    xaxis: {
        type: 'datetime',
    },
    tooltip: {
        x: {
            format: 'yy/MM/dd HH:mm'
        },
    }
};

//function Make Chart (Area)
function MakeAreaChart(GetQuerySelectorId, titleText, options) {
    var option;
    var charts;
    console.log(options);
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

//function Update Series
function UpdateSeries(NamesArray, DataArray, chart) {
    let Series = new Array();
    for (let i in NamesArray) {
        let ReturnJson = {
            name: NamesArray[i],
            data: DataArray[i]
        };
        Series.push(ReturnJson);
    }
    //update Series 
    for (let i in Series) {
        chart.appendSeries(Series[i]);
    }
    //Make Toggle graph show All OFF
    for (let i in Series) {
        chart.toggleSeries(NamesArray[i]);
    }
}