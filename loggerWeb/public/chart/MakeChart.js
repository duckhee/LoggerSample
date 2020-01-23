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

//function Make Default Chart(Area)
function _DefaultChart(_Name, _DataSeries) {
    var options = DefaultOptions;
    options.series = _DataSeries;
    charts = new ApexCharts(document.querySelector("#" + _Name, options));
    charts.render();
    return charts;
}

//function Update Series
function UpdateSeries(NamesArray, DataArray, chart) {
    console.log("Data : ", DataArray);
    let Series = new Array();
    for (let i in NamesArray) {
        let ReturnJson = {
            name: NamesArray[i],
            data: DataArray[0]
        };
        Series.push(ReturnJson);
        console.log(Series);
    }
    //update Series 
    for (let i in Series) {
        chart.appendSeries(Series[i]);
        //console.log(Series[i]);
    }
    //Make Toggle graph show All OFF


    for (let i in Series) {
        chart.toggleSeries(NamesArray[i]);
        //console.log(Series[i]);
    }

}

/** Make Chart Data */
function MakeNameJson(Names) {
    let Series = new Array();
    console.log('make value');
    return new Promise((resolve, reject) => {
        for (let i in Names) {
            let DataJson = {};

            DataJson.name = Names[i];
            DataJson.data = [];
            if (parseInt(i) !== 0)
                Series.push(DataJson);
        }
        if (Series.length === Names.length - 1) {
            //console.log("Data JSON : ", Series);
            return resolve(Series);
        }
    });
}

/** Make Chart Data */
function MakeDataJson(Names, Data) {
    console.log('Names : ', Names);
    console.log("data length : ", Data.length);
    var Time;
    return new Promise((resolve, reject) => {
        for (let i = 0; i < Data.length; i++) {
            let SplitData = Data[i].columnValue.split(',');

            //console.log('Split Data : ', SplitData);
            for (let i2 in SplitData) {
                if (i2 == 0) {
                    Time = new Date(SplitData[0]);
                } else {
                    let ChartData = parseFloat(SplitData[i2]);
                    if (isNaN(ChartData)) {
                        ChartData = null;
                    }
                    //console.log("Time : ", Time+", Data : ", ChartData);
                    Names[i2 - 1].data.push([Time, ChartData]);
                }

            }

        }

        return resolve(Names);

    });
}

//Get Data Make Update
function UpdateChart(NamesArray, DataArray, chart) {
    /** Make Insert Data Format */
    console.log('data');
    MakeNameJson(NamesArray).then(NameJson => {
        console.log('success');
        console.log('NameJson : ', NameJson);
        MakeDataJson(NameJson, DataArray).then(result => {
            console.log('testing success');

            //chart.appendSeries(result);
            for (let i in result) {
                console.log('Data Test : ', result[i]);
                chart.appendSeries(result[i]);
                //chart.toggleSeries(result[i].name);
            }
            for (let i in result) {
                chart.toggleSeries(result[i].name);
            }
            console.log('done');
        }).catch(err => {
            console.log('Error : ', err);
            console.log('test failed');
        });
    }).catch(err => {
        console.log('failed');

    });
}

function generateDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
        var x = baseval;
        var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push([x, y]);
        baseval += 86400000;
        i++;
    }
    return series;

}

/** Ajax Data Parsing */
function AjaxTest(no, chart) {

    $.ajax({
        type: 'GET',
        url: '/admin/Device/getData?no=' + no,
        dataType: 'json',
        error: function() {
            //return reject(null);
            console.log("AJAX ERROR");
        },
        success: function(data) {
            InsertChart(data, chart);
        }
    });

}
/** Ajax Data Parsing */
function AjaxDataParsing(data) {

}

//TODO
function AjaxEcolog(no, chart) {
    $.ajax({
        type: 'GET',
        url: '/admin/Device/testEcolog?no=' + no,
        dataType: 'json',
        error: function() {
            console.log("AJAX ERROR");
        },
        success: function(data) {

            InsertChart(data, chart);
        }
    });
}

/** Function Insert data if make chart data make server side */
function InsertChart(data, chart) {
    for (let i in data) {
        console.log('Data Test : ', data[i]);
        chart.appendSeries(data[i]);
        //chart.toggleSeries(result[i].name);
    }
    for (let i in data) {
        chart.toggleSeries(data[i].name);
    }
}

/** Test Ecolog Chart */