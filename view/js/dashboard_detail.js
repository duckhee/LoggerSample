if (!window.ADD_NEW_OPTIONS) {
    $.getScript("/media/js/modules/add_new_options.js");
}

if (!window.DASHBOARD_LIST_LOADED) {
    $.getScript("/media/js/modules/dashboard_list.js");
}

/**
 * Created by griggs on 3/23/2017.
 */

/************************************************
Globals
************************************************/
// TODO(brett): put comments for description


var gchartData;
var gcharts;

//if custom dates are selected use those dates, else dropdown option days need to be calculated
//gdates is needed for empty charts
var gdates;

function get_dates() {
    // utc_date is in main.js
    var now = utc_date();

    var selected_time = $("#time_dropdown li a.active").data("id");
    var time_span_dict = {
        "1": 1,
        "2": 2,
        "3": 7,
        "4": 30,
        "5": 93,
        "6": 365,
        "7": 90,
        "8": 180
    };

    var time_span = time_span_dict[selected_time];

    ga('send', {
        hitType: 'event',
        eventCategory: 'UI Interaction',
        eventAction: 'click',
        eventLabel: 'change_timeframe_detail',
        eventValue: time_span
    });

    var d = utc_date();
    d.setDate(now.getDate() - time_span);
    // date_to_string is in main.js
    var start_date = date_to_string(d, true);
    var end_date = date_to_string(now);
    var dates = [{ "Date/Time": start_date }, { "Date/Time": end_date }];

    gdates = dates;
    dashboard_detail.get_device_data(start_date, end_date);

}


var dashboard_detail = new ZCPage.page();
var current_request = null;

/************************************************
Helper functions
************************************************/

//get the data for active logger on side panel.
function get_active_logger_id() {
    var $logger = $(".logger.active").first();

    if ($logger[0] == null) {
        var $loggers = $(".logger");
        $loggers.first().addClass("active");
    }

    return $logger.data('id');
}


//WHEN RESET BUTTONS HIT, GO BACK TO ORIGINAL CHART STATUS
function reset_yaxis(graph_id) {
    ga('send', {
        hitType: 'event',
        eventCategory: 'UI Interaction',
        eventAction: 'click',
        eventLabel: 'reset_axis_detail'
    });

    // Make input box transparent to see min and max from amcharts y-axis before modifying
    $("#{0}_max".format(graph_id)).css('background', 'transparent');
    $("#{0}_min".format(graph_id)).css('background', 'transparent');

    // Clear inputs
    $("#{0}_max".format(graph_id)).val("");
    $("#{0}_min".format(graph_id)).val("");

    var checked_values = {};

    $("input[name='sensor']:checked").each(function() {
        var value = $(this).attr("value");
        var id = $(this).attr("id");
        checked_values[id] = value;
    });

    var chartData_final = [];
    var chartData = gchartData.unitData[graph_id];
    var graph_type = gchartData.unitData[graph_id][0]["graph_type"];

    //DETERMINE IF CHART IS COLUMN OR TRACE
    if (graph_type == "bar") {
        var chartType_final = "column";
        var fillAlphas = 1;
        var baseValue = 0;

    } else {
        var chartType_final = "smoothedLine";
        var fillAlphas = 0;
        var baseValue = 1;
    }

    var chartData_final = [];
    var chartData_max_keys_index = 0;
    var chartData_max_keys_flag = 0;

    for (var i = 0; i < chartData.length; i++) {
        var entry = {};
        //sort the keys. <-- This is to display ports in order for amcharts legend
        var keys = Object.keys(chartData[i]);
        // This is to get the all the ports titles
        if (keys.length > chartData_max_keys_flag) {
            chartData_max_keys_index = i;
        }
        keys.sort();
        var count = 1;
        for (var e = 0; e < keys.length; e++) { //element in chartData[i]) {
            var element = keys[e];
            //do not include decimal value in legend
            // (decimal was used to make sure we are graphing multiple traces of the same unit from one sensor)

            //if (element.includes(".")) {

            if (element.includes("Port")) {
                var port = element.substr(0, element.indexOf(':'));
                var sensor_name = element.substr(element.indexOf(":") + 1);

                // NOTE(brett): The loggers right now only have 6 ports... call anything after the em60
                var port_num = parseInt(port.replace('Port', ''));
                if (port_num > 6) {
                    var element_final = "Logger's " + sensor_name;
                }
                //some work around to atmos two temp readings (leagacy
                // else if (sensor_name == " ATMOS 41 MicroEnvironment Monitor" && unit_title == "Temperature (째C)") {
                //
                //     var element_final = port + " -" + sensor_name + ' ' + count;
                //     count++;
                // }
                else {
                    var element_final = port + ":" + sensor_name;
                }
                entry[element_final] = chartData[i][element];
            }

            if (element == "Date/Time") {
                entry["Date/Time"] = chartData[i]["Date/Time"];
            } else {
                continue
            }
        }
        chartData_final[i] = entry;
    }


    //graphing the right colors...
    var graph_ports = [];
    var port_colors = {
        "Port 1": "#276c9b",
        "Port 2": "#54a0d4",
        "Port 3": "#007d00",
        "Port 4": "#00b000",
        "Port 5": "#cc7b00",
        "Port 6": "#ff9a00",
        "Logger's": "#462378",
        // "Port7": "#462378",
        // "Port8": "#743DC4"

    };
    var value_axis_data = [{
        "id": "v1",
        "axisAlpha": 0,
        "position": "left",
        "ignoreAxisWidth": true,
        "fontSize": 11,
        "autoGridCount": false,
        "gridColor": "#E7E8E7",
        "gridAlpha": .9,
        "baseValue": baseValue
    }];

    for (values in chartData_final[chartData_max_keys_index]) {
        if (values != "Date/Time") {
            // Assign the correct port number to a static "meter" color
            for (key in port_colors) {
                if (values.includes(key)) {


                    var line_color = port_colors[key];
                }
            }

            graph_ports.push({
                "id": "{0}".format(values),
                "hideBulletsCount": 50,
                "lineThickness": 1.5,
                "title": "{0}".format(values),
                "useLineColorForBulletBorder": true,
                "valueField": "{0}".format(values),
                "type": chartType_final,
                "lineColor": line_color,
                "fillAlphas": fillAlphas,
                "balloonText": "<span style='font-size:11px; white-space: nowrap;'>[[title]]:<b>[[value]]</b></span>",
                "connect": false
            });
        }
    }
    //design the chart

    var chart_attributes = get_chart_attributes(chartData_final, value_axis_data, graph_ports, key = graph_id);
    var chart = AmCharts.makeChart("{0}".format(graph_id), chart_attributes);
    chart.validateNow();
    chart.invalidateSize();


};


//**detects click inside input box. Changes input background to white. Clear input value**
function update_y_max(key) {
    $("#{0}_max".format(key)).css('background', 'white');
    $("#{0}_max".format(key)).val('');
    setTimeout(function() { input_status(key) }, 10000);
}


function update_y_min(key) {
    $("#{0}_min".format(key)).css('background', 'white');
    $("#{0}_min".format(key)).val('');
    setTimeout(function() { input_status(key) }, 10000);
}


//detects if user begins to type in box after being idle
function ymax_keyup(key) {
    $("#{0}_max".format(key)).css('background', 'white');
}


function ymin_keyup(key) {
    $("#{0}_min".format(key)).css('background', 'white');
}


//IF INPUT IS EMPTY, REVERT TO BOX BEING TRANSPARENT
function input_status(key) {
    ga('send', {
        hitType: 'event',
        eventCategory: 'UI Interaction',
        eventAction: 'click',
        eventLabel: 'max_min_input_detail'
    });

    var max_input = document.getElementById('{0}_max'.format(key)).value;
    var min_input = document.getElementById('{0}_min'.format(key)).value;

    if (max_input == "") {
        $("#{0}_max".format(key)).css('background', 'transparent');
    }
    if (min_input == "") {
        $("#{0}_min".format(key)).css('background', 'transparent');
    }

}

$(document).on("blur keydown", ".maxField", function(event) {

    var key = event.target.id.substr(0, event.target.id.indexOf('_'));
    var charCode = (key.which) ? key.which : key.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    dashboard_detail.get_chart_data(gchartData, key);
});

$(document).on("blur keydown", ".minField", function(event) {

    var key = event.target.id.substr(0, event.target.id.indexOf('_'));
    var charCode = (key.which) ? key.which : key.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    //dashboard_detail.get_chartData(gchartData, key);
    dashboard_detail.get_chart_data(gchartData, key);
});


//EXPORT CHART AS PNG
function export_option(graph_id) {

    var chart_object = gcharts[graph_id];
    var chart_title = $("#{0}-{0} h2".format(graph_id)).html();
    var active = $(".logger.active");
    var device = active[0]["outerText"];

    chart_object.export.capture({}, function() {
        this.toPNG({
            multiplier: 1
        }, function(data) {
            this.download(data, "image/png", "{0}-{1}.png".format(device, chart_title));
        });
    });
};


dashboard_detail.init = function init($html) {
    var self = this;
    self.$template = $html;
};


dashboard_detail.show = function show() {
    var $device_items = $(".treeItem.logger");
    var device_names = [];
    for (var i = 0; i < $device_items.length; i++) {
        device_names.push($($device_items[i]).data("sn"));
    }
    var self = this;

    var $current_time = $('#time_dropdown li a.active');
    var active_time;

    //if active time was changed and saved to local display, else default
    var saved_timeframe = LocalStorage.get('dashboard_detail.timeframe');

    if (saved_timeframe && ($current_time.text() != saved_timeframe)) {
        $('#time_dropdown li a').each(function() {
            if ($(this).text() == saved_timeframe) {

                $current_time.removeClass("active");
                active_time = $(this).text();
                $(this).addClass("active");

                $("#time_dropdown").click();
            }
        })
    } else {
        //display active time
        active_time = $('#time_dropdown li a.active').text();
    }

    $("#selected-time").text(active_time);

    //If a different device is selected from left-menu, clear html charting, and update data
    // NOTE(brett): Name the event so we can clear it later (.details).
    $(".deviceTree .logger").on('click.details', function() {
        // Clear current graphs
        $("#chart_panels").empty();
        //$("#chart_panels").addClass('loading_icon');
        $("#port_labels").empty();
        //self.get_device_data();
        get_dates();
    });

    // Update data to reflect new time frame from user
    $('#time_dropdown').on('click', 'li a', function() {

        $('#time_dropdown li a.active').removeClass('active');

        $(this).addClass('active');
        $("#selected-time").text($(this).text());

        LocalStorage.set('dashboard_detail.timeframe', $(this).text());

        disable_nav_buttons();

        get_dates();
    });

    var p1 = $(".content").fadeOut("fast", function() {
        $(this).empty();
        $(this).append(self.$template);
        $(this).fadeIn("fast");

        var $action_bar = $(".actionBar");
        var $add_new = $(".addNew");
        var $content = $(".content");
        var $content_wrapper = $(".contentWrapper");
        var $device_tree = $(".deviceTree");

        $device_tree.addClass("manage");
        $add_new.addClass("manage");
        $action_bar.addClass("toggle");
        $action_bar.removeClass("action");
        $action_bar.removeClass("table");
        $action_bar.css("display", "block");
        $content_wrapper.addClass("hasTopBar");
        $content.css("margin-top", "60px");
        $content_wrapper.addClass("hasDatePicker");
    });

    $.when(p1).then(function() {
        get_dates();
        //dashboard_detail.get_device_data();
    });

    $("#new-device-btn").off("click").on("click", function() {
        create_and_show_new_device_subscription_modal();

        ga('send', {
            hitType: 'event',
            eventCategory: 'UI Interaction',
            eventAction: 'click',
            eventLabel: 'add_new_device_detail'
        });

    });

    $("#new-site-btn").off("click").on("click", function() {
        create_and_show_new_site_modal();

        ga('send', {
            hitType: 'event',
            eventCategory: 'UI Interaction',
            eventAction: 'click',
            eventLabel: 'add_new_site_detail'
        });
    });

    $("#new-plot-btn").off("click").on("click", function() {
        create_and_show_new_section_modal();

        ga('send', {
            hitType: 'event',
            eventCategory: 'UI Interaction',
            eventAction: 'click',
            eventLabel: 'add_new_plot_detail'
        });
    });

};


// dashboard_detail.hide = function hide() {
//     var self = this;
//
//     //If a different device is selected from left-menu, clear html charting, and update data
//     $(".deviceTree > .logger").off('click');
//     // Update data to reflect new time frame from user
//     $('#time_dropdown').off('click');
//
// };

var loader = ZCLoader;
//clear previous panels and creates new chart panels
dashboard_detail.create_html_charts = function(chart_data) {
    var self = this;
    var $chart_container = self.$template.find("#chart_panels");

    $chart_container.empty();

    var chart_template = self.$template.find("#unit_chart").html();


    for (var key in chart_data.measurement_map) {


        var unit_title = chart_data.measurement_map[key];
        if (unit_title.charAt(0) == ' ') {
            unit_title = unit_title.replace(' ', '')
            console.log("unit_title: ", unit_title)
        }
        if (unit_title.indexOf("(") != -1) {

            unit_title = unit_title.replace('532', 'FIVE_THIRTYTWO').replace('570', 'FIVE_SEVENTY').replace('650', 'SIX_FIFTY').replace('810', 'EIGHT_TEN').replace('&', 'AND').replace('慣', 'A').replace('CO��', 'CO').replace('-', '_').replace('-', '_');
            var extractIndex = unit_title.indexOf("(");
            var extractedUnit = unit_title.slice(extractIndex - 1, unit_title.length);

            unit_title = unit_title.slice(0, extractIndex - 1);

            unit_title = unit_title.replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').toUpperCase();
            let translated_title = translations[user_language][unit_title] ? translations[user_language][unit_title] + extractedUnit : chart_data.measurement_map[key]
            unit_title = translated_title;
        } else {

            unit_title = unit_title.replace('532', 'FIVE_THIRTYTWO').replace('570', 'FIVE_SEVENTY').replace('650', 'SIX_FIFTY').replace('810', 'EIGHT_TEN').replace('&', 'AND').replace('慣', 'A').replace('CO��', 'CO').replace('-', '_').replace('-', '_');
            unit_title = unit_title.replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').toUpperCase();

            unit_title = translations[user_language][unit_title] ? translations[user_language][unit_title] : chart_data.measurement_map[key];


        }
        var hidden = false;

        if (Object.keys(chart_data.unitData).length == 0) {
            var e = unit_title;
        } else {
            hidden = chart_data.unitData[key][0]["hidden"];
            var e = key //chart_data.measurement_map[key]
        }

        if (!hidden) {

            var unit_info = { 'key': e, 'unit_title': unit_title, 'reset_axis': translations[user_language]["RESET_AXIS"] };
            var rendered = Mustache.render(chart_template, unit_info);
            $chart_container.append(rendered);
        }
        // return;
    }

    loader.start($(".amchart_chart"));

};

gpk = null;
var ajax_loader = ZCLoader;
dashboard_detail.get_device_data = function(start_date, end_date) {

    if (current_request != null) {
        // Cancel the current request if the user is making another request
        current_request.abort();
    }

    var self = this;
    var $bar_container = self.$template.find("#download_bar");

    $bar_container.empty();

    var bar_template = self.$template.find("#unit_bar").html();

    var active_logger_id = get_active_logger_id();
    var pk = $(".logger.active").data('sn');

    if (!pk) {
        enable_nav_buttons();
        return;
    }

    var sort_data = function(data) {
        newData = {
            measurement_map: data['measurement_map'],
            unitData: {},
            graph_order: data['graph_order']
        };

        var counter = 0;
        // NOTE(brett): we already have the data. Just need to format it.
        var worker = new window.Worker('media/js/workers/sort-unit-data.js');
        worker.onmessage = function(e) {
            var k = e.data[0];
            var values = e.data[1];

            newData.unitData[k] = values;
            if (--counter == 0) {
                setTimeout(function() {

                    self.create_html_charts(newData);
                    self.get_chart_data(newData);

                }, 150);
            }
        };

        for (var k in data.unitData) {
            worker.postMessage([k, data.unitData[k], gdates]);
            counter++;
        }
    };

    $('#chart_panels').empty()
    ajax_loader.start($("#chart_panels"));
    current_request = $.ajax({
        type: "get",
        url: "/api/2.0/detail_chart_data/",
        data: { "serial_num": pk, "start_date": start_date, "end_date": end_date },
        xhr: function() {
            var xhr = new window.XMLHttpRequest();

            xhr.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    console.log(percentComplete);
                }
            }, false);

            return xhr;
        },
        success: function(results) {
            ajax_loader.stop();

            var data = results.items;

            var deviceData = results.device_info;

            if (deviceData != null) {
                var active_logger_id = get_active_logger_id();
                var pk = $(".logger.active").data('sn');
                // whether or not the data is being filtered because of subscription status
                var filtered = deviceData.filtered;
                var unit_info = {
                    'name': deviceData["name"],
                    last_updated: deviceData["last_updated"],
                    filtered: deviceData['filtered'],
                    'is_em50': deviceData['is_em50'],
                    'pk': deviceData["pk"],
                    'actual_battery': deviceData["battery"],
                    'actual_rssi': deviceData["rssi"],
                    'rounded_battery': Math.round(deviceData["battery"] / 10) * 10,
                    'rounded_rssi': Math.round(deviceData["rssi"] / 25) * 25,
                    "device_type": deviceData["device_type"],
                    "can_download": deviceData["can_download"]
                };
                var rendered = Mustache.render(bar_template, unit_info);
                $bar_container.append(rendered);
                $('[data-toggle="tooltip"]').tooltip();
            }
            var measurement_length = Object.keys(data.measurement_map).length;
            var unit_length = Object.keys(data.unitData).length;
            var zero_length = (measurement_length === 0 || unit_length === 0);
            if (filtered && zero_length) {
                $('#chart_panels').html(
                    '<div class="row">' +
                    '<div class="col-md-offset-4 col-md-4">' +
                    '<button type="button" class="btn btn-xs btn-default navItem" onclick="showSeasonPassModal();">' +
                    'Device subscription expired' +
                    '</button>' +
                    '</div>' +
                    '</div>');
            } else if (zero_length) {
                $('#chart_panels').html('<div class="row"><div class="col-md-offset-4 col-md-4">' + translations[user_language]["THERE_IS_NOT_A_SHRED"] + '</div></div>');
            } else {
                gchartData = data;
                sort_data(data)
            }

            if (results.success == false) {

                addErrorFlash(results.message);
            }
            //if there is no data, we want to enable to navigation buttons.
            enable_nav_buttons();
        },
        error: function(response) {
            ajax_loader.stop();

            $('#chart_panels').html();

            self.get_chart_data({});
            //if there is no data, we want to enable to navigation buttons.
            enable_nav_buttons();
        }

    });

};



ScrollLoadables = [];
dashboard_detail.get_chart_data = function(chart_data, one_key) {
    disable_nav_buttons();
    // NOTE(brett): Handling the deferred chart rendering should be done in its own function... right now it needs
    // some of the info from this function and it makes sense to have it here. This will need a solid refactor.

    // NOTE(brett): This is done so the callbacks dont get cleared when only one graph  needs to be updated. an example is
    // when the min/max is updated for a single graph
    ScrollLoadables = (one_key) ? ScrollLoadables : [];

    var self = this;
    //only update the necessary graphs.
    var elements = [];
    //if there is no chart data, provide empty charts
    if (isEmpty(chart_data.unitData)) {
        for (var i in chart_data.measurement_map) {
            elements.push(chart_data.measurement_map[i])

        }
    } else {

        if (one_key != undefined) {
            var key_comp = one_key.toString();
            //only recreate the graph with one key
            elements.push(key_comp);
        } else {
            //pass in all chart_data.unitData
            for (unit in chart_data.unitData) {
                elements.push(unit)
            }
        }
    }

    var charts = {};
    gcharts = charts;
    // if there is no data, still create graphs with no data points.
    if (isEmpty(chart_data.unitData)) {

        for (var j = 0; j < elements.length; j++) {

            var unit_title = elements[j];
            var chartData_final = gdates;
            //var chartData_final = [{"Date/Time":"2/1/2017"},{"Date/Time":"2/2/2017"}];

            var value_axis_data = [{
                "id": "v1",
                "axisAlpha": 0,
                "position": "left",
                "ignoreAxisWidth": true,
                "fontSize": 11,
                "autoGridCount": false,
                "gridColor": "#E7E8E7",
                "gridAlpha": .9,
                "baseValue": 1,
                "strictMinMax": true,
                "minimum": 0,
                "maximum": 1
            }];

            graph_ports = [{
                "id": "{0}".format(unit_title),
                //"hideBulletsCount": 50,
                "lineThickness": 1.5,
                "title": "{0}".format(unit_title),
                "useLineColorForBulletBorder": true,
                "valueField": "{0}",
                //"fillAlphas": 0,
                "connect": false
            }];

            var chart_attributes = get_chart_attributes(chartData_final, value_axis_data, graph_ports, key = j);
            var chart = AmCharts.makeChart(j, chart_attributes);

            chart.validateNow();
            chart.invalidateSize();
            charts[j] = chart;

            loader.stop();
        }
    } else {
        for (var j = 0; j < elements.length; j++) {
            var key = elements[j];
            //if there is no data for unit, do not graph, delete html tag
            if (chart_data.unitData[key].length == 0) {
                $("[id={0}-{1}]".format(key, key)).remove();
                loader.stop();
                //continue;
            } else {
                //CLEAN UP CHART DATA
                var unit_title = chart_data.measurement_map[key];
                var chartData = chart_data.unitData[key];
                var graph_type = chart_data.unitData[key][0]["graph_type"];

                //DETERMINE IF CHART IS COLUMN OR TRACE
                if (graph_type == "bar") {
                    var chartType_final = "column";
                    var fillAlphas = 1;
                    var baseValue = 0
                } else {
                    var chartType_final = "smoothedLine";
                    var fillAlphas = 0;
                    var baseValue = 1
                }

                var chartData_final = [];
                var chartData_max_keys_index = 0;
                var chartData_max_keys_flag = 0;
                var graph_port_finished = {};
                //graphing the right colors (USE METER COLOR SCHEME -- Hard Code)...
                var port_colors = {
                    "Port 1": "#276c9b",
                    "Port 2": "#54a0d4",
                    "Port 3": "#007d00",
                    "Port 4": "#00b000",
                    "Port 5": "#cc7b00",
                    "Port 6": "#ff9a00",
                    "Logger's": "#462378",
                    // "Port7": "#462378",
                    // "Port8": "#743DC4"
                };
                var graph_ports = [];

                for (var i = 0; i < chartData.length; i++) {
                    var entry = {};
                    //sort the keys. <-- This is to display ports in order for amcharts legend
                    var keys = Object.keys(chartData[i]);
                    // This is to get the all the ports titles
                    if (keys.length > chartData_max_keys_flag) {
                        chartData_max_keys_index = i;
                    }
                    keys.sort();
                    var count = 1;
                    for (var e = 0; e < keys.length; e++) { //element in chartData[i]) {
                        var element = keys[e];
                        //do not include decimal value in legend
                        // (decimal was used to make sure we are graphing multiple traces of the same unit from one sensor)

                        //if (element.includes(".")) {
                        if (element.includes("Port")) {
                            var port = element.substr(0, element.indexOf(':'));
                            var sensor_name = element.substr(element.indexOf(":") + 1);

                            // NOTE(brett): The loggers right now only have 6 ports... call anything after the em60
                            var port_num = parseInt(port.replace('Port', ''));
                            if (port_num > 6) {
                                var element_final = "Logger's " + sensor_name;
                            }
                            // // note(mark) legacy way to handle atmos two temps
                            // else if (sensor_name == " ATMOS 41 MicroEnvironment Monitor" && unit_title == "Temperature (째C)") {
                            //
                            //     var element_final = port + " -" + sensor_name + ' ' + count;
                            //     count++;
                            // }
                            else {
                                var element_final = port + ":" + sensor_name;
                            }
                            entry[element_final] = chartData[i][element];

                        }

                        if (element == "Date/Time") {
                            entry["Date/Time"] = chartData[i]["Date/Time"];
                        } else {
                            continue
                        }
                    }
                    chartData_final[i] = entry;
                    for (values in entry) {
                        if (values == "Date/Time") {
                            continue
                        } else {
                            let line_color = "#276c9b";
                            for (port_num in port_colors) {
                                if (values.includes(port_num)) {
                                    line_color = port_colors[port_num];
                                }
                            }
                            if (!(values in graph_port_finished)) {
                                graph_ports.push({
                                    "id": "{0}".format(values),
                                    "hideBulletsCount": 50,
                                    "lineThickness": 1.5,
                                    "title": "{0}".format(values),
                                    "useLineColorForBulletBorder": true,
                                    "valueField": "{0}".format(values),
                                    "type": chartType_final,
                                    "lineColor": line_color,
                                    "fillAlphas": fillAlphas,
                                    "balloonText": "<span style='font-size:11px; white-space: nowrap;'>[[title]]:<b>[[value]]</b></span>",
                                    "textAlign": "left",
                                    "connect": false
                                });
                                graph_port_finished[values] = 1;
                            }
                        }
                    }
                }

                //look for max in data set to determine y-axis font size

                //determine if the user has set a specificed max or min value, if so use it
                // var max =  $(".maxField").val();
                // var min =  $(".minField").val();
                var max = $("#{0}_max".format(key)).val();
                var min = $("#{0}_min".format(key)).val();

                if (max == "" && min == "") {
                    var value_axis_data = [{
                        "id": "v1",
                        "axisAlpha": 0,
                        "position": "left",
                        "ignoreAxisWidth": true,
                        "fontSize": 11,
                        "autoGridCount": false,
                        "gridColor": "#E7E8E7",
                        "gridAlpha": .9,
                        "baseValue": baseValue,
                        "strictMinMax": true
                    }];
                } else if (max != "" && min == "") {
                    var value_axis_data = [{
                        "id": "v1",
                        "axisAlpha": 0,
                        "position": "left",
                        "ignoreAxisWidth": true,
                        "fontSize": 11,
                        "autoGridCount": false,
                        "gridColor": "#E7E8E7",
                        "gridAlpha": .9,
                        "maximum": max,
                        "baseValue": baseValue,
                        "strictMinMax": true
                    }];
                } else if (max == "" && min != "") {
                    var value_axis_data = [{
                        "id": "v1",
                        "axisAlpha": 0,
                        "position": "left",
                        "ignoreAxisWidth": true,
                        "fontSize": 11,
                        "autoGridCount": false,
                        "gridColor": "#E7E8E7",
                        "gridAlpha": .9,
                        "minimum": min,
                        "baseValue": baseValue,
                        "strictMinMax": true
                    }];
                } else {
                    var value_axis_data = [{
                        "id": "v1",
                        "axisAlpha": 0,
                        "position": "left",
                        "ignoreAxisWidth": true,
                        "fontSize": 11,
                        "autoGridCount": false,
                        "gridColor": "#E7E8E7",
                        "gridAlpha": .9,
                        "minimum": min,
                        "maximum": max,
                        "baseValue": baseValue,
                        "strictMinMax": true
                    }];
                }

                var chart_attributes = get_chart_attributes(chartData_final, value_axis_data, graph_ports, key);
                // NOTE(brett): This is done to save the arguments. We are using old javascript. I bind the arguments to
                // the function so key does not retain the last value in the callback. Typical javascript bs.
                var checkRender = (function checkRender(key, chart_attributes) {
                    var $chart_div = $("#" + key.toString());
                    var offset = $chart_div.offset();
                    var width = $chart_div.width();
                    var height = $chart_div.height();

                    if (!$chart_div || !offset) {
                        return true;
                    }

                    // NOTE(brett): Add a margin so that charts start loading _before_ they get to the
                    // screen.
                    var rect_margin = 200
                    if (offset.top < window.scrollY + window.innerHeight + rect_margin) {
                        var chart = AmCharts.makeChart(key.toString(), chart_attributes);
                        chart.validateNow();
                        chart.invalidateSize();
                        charts[key] = chart;
                        return true;
                    }
                    return false;
                }).bind(this, key, chart_attributes)

                if (!checkRender()) {
                    ScrollLoadables.push(checkRender);
                }

            }
        }
    }




    enable_nav_buttons();

};


function get_chart_attributes(chartData_final, value_axis_data, graph_ports, key) {

    //console.log('what is chartData final??',chartData_final);
    //design the chart
    var chart_attributes = {
        "addClassNames": true,
        //"titles":[{"id":"{0}".format(gchartData.measurement_map[key])}],
        "type": "serial",
        "theme": "light",
        "dataProvider": chartData_final,
        "fontFamily": "Helvetica",
        "marginRight": 40,
        "marginBottom": 10,
        "marginLeft": 40,
        "legend": {
            "divId": "{0}_legend".format(key),
            "fontSize": 12,
            "equalWidths": true,
            "position": "top",
            "valueAlign": "left",
            "valueWidth": 0
        },
        "autoMarginOffset": 20,
        "dataDateFormat": "MM/DD/YYYY JJ:NN",
        "valueAxes": value_axis_data,
        "balloon": {
            "borderThickness": 1,
            "shadowAlpha": 0,
            "textAlign": "left",
            "horizontalPadding": 2,
            "maxWidth": 290
        },
        "graphs": graph_ports,
        "categoryField": "Date/Time",
        "categoryAxis": {
            "showFirstLabel": true,
            "parseDates": true,
            "equalSpacing": true,
            "labelOffset": 20,
            "centerLabels": true,
            "startOnAxis": true,
            "axisThickness": 0,
            "axisAlpha": 0,
            "tickLength": 0,
            "axisColor": "#E7E8E7",
            "dashLength": 1,
            "minorGridEnabled": true,
            "minorGridAlpha": .1,
            "gridAlpha": .9,
            "autoGridCount": false,
            "gridCount": 6,
            "gridColor": "#E7E8E7",
            "fontSize": 12,
            "minPeriod": "NN"
                //     "dateFormats": [
                //         {period: 'fff' ,format: 'MMM'},
                //     {period: 'ss'  ,format: 'MMM ss'},
                //     {period: 'NN'  ,format: 'NN'},
                //     {period: 'HH'  ,format: 'JJ:NN'},
                //     {period: 'DD'  ,format: 'MMM DD'},
                //     {period: 'WW'  ,format: 'MMM WW'},
                //     {period: 'MM'  ,format: 'MMM'},
                //     {period: 'YYYY',format: 'MMM'}]//,
        },
        "chartCursor": {
            "pan": true,
            "cursorAlpha": 1,
            "cursorColor": "#258cbb",
            "limitToGraph": "g1",
            "valueLineAlpha": 0.2,
            "valueZoomable": true,
            "categoryBalloonDateFormat": "MMM DD JJ:NN"
        },
        "export": {
            "afterCapture": function() {
                var text = new fabric.Text("{0}".format(gchartData.measurement_map[key]), {
                    top: 5,
                    left: 10,
                    family: this.setup.chart.fontFamily,
                    fontSize: this.setup.chart.fontSize * 1.5
                });
                this.setup.fabric.add(text);
            },
            "delay": 3,
            "enabled": true,
            "format": "PNG",
            "label": "PNG",
            "menu": []
        }

    };
    return chart_attributes;
}

// NOTE(brett): When the screen is scrolled check if the graphis in view. if it is then render it.
function get_scrollables() {
    newScrollables = [];
    ScrollLoadables.forEach(function(e) {
        if (!e()) {
            newScrollables.push(e);
        }
    });
    ScrollLoadables = newScrollables;
}


$(".content").scroll(function() {

    if ($("#chart_panels")[0] != undefined) {
        get_scrollables()
    }
});


dashboard_detail.hide = function() {
    $.xhrPool.abortAll();

    $(".deviceTree .logger").off('click.details');
    // $(window).off('wheel');
};


function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}