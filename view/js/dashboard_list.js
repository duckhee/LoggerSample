if (!window.ADD_NEW_OPTIONS) {
    $.getScript("/media/js/modules/add_new_options.js");
}

var DASHBOARD_LIST_LOADED = true;

var account_user_id = $("#account-dropdown").data('id');

var dashboard_list = new ZCPage.page();

var closing_accordion_animation = {
    'transition': 'max-height 0.4s ease-out',
    'max-height': '0',
    'height': '0',
}

var final_state_of_closed_accordion = {
    'max-height': '0',
    'height': '0',
    'transition': ''
}

dashboard_list.init = function($html) {
    var self = this;
    self.$template = $html;
    self.$rendered = null;
    $(window).on("resize", resize_height_of_accordion);
};



dashboard_list.show = function() {

    var json = translations[user_language];

    var self = this;
    var loader = ZCLoader;


    if (!self.$rendered) {

        $(".content").fadeOut("fast", function() {
            $this = $(this);

            $this.empty();
            $this.append(self.$rendered);
            loader.start($this);

            $this.fadeIn("fast");
            //NOTE(Bri) - each template is currently a hard coded background color, perhaps an easier method?
            $this.css("background-color", "#efefef");

            var $action_bar = $(".actionBar");
            var $add_new = $(".addNew");
            var $content = $(".content");
            var $content_wrapper = $(".contentWrapper");
            var $device_tree = $(".deviceTree");

            var $device_items = $(".treeItem.logger");
            var device_names = [];
            for (var i = 0; i < $device_items.length; i++) {
                device_names.push($($device_items[i]).data("sn"));
            }

            $device_tree.addClass("manage");
            //NOTE (mark) - To get the hierarchy tree not to reopen when its closed
            if (!$(".float-collapse-button").hasClass("active")) {
                $content_wrapper.removeClass("hideTree");
            }
            $add_new.addClass("manage");
            $action_bar.addClass("toggle");
            $action_bar.removeClass("table");
            $action_bar.removeClass("action");
            $action_bar.css("display", "block");
            $content_wrapper.addClass("hasTopBar");
            $content_wrapper.removeClass("hasLegendBar");
            $content.css("top", "");
            $content.css("margin-top", "50px");
            $content_wrapper.removeClass("hasDatePicker");
        }).promise().done(function() {

            $.ajax({
                type: "GET",
                url: "/api/2.0/readings/",
                success: function(data) {
                    loader.stop();
                    var data = data["items"];
                    var deviceData = data["devices"]

                    deviceData.sort(function(a, b) {
                        var nameA = a.name.toLowerCase(),
                            nameB = b.name.toLowerCase()
                        if (a.plot_name < b.plot_name) //sort string ascending
                        {
                            return -1
                        } else if (a.plot_name > b.plot_name) {
                            return 1
                        } else if (nameA < nameB) {
                            return -1
                        } else if (nameA > nameB) {
                            return 1
                        }
                        return 0 //default return value (no sorting)
                    })
                    for (var i = 0; i < data["devices"].length; i++) {

                        var device = data["devices"][i];

                        device["actual_battery"] = device["battery"];
                        device["actual_rssi"] = device["rssi"];
                        device["rounded_battery"] = Math.round(device["battery"] / 10) * 10;
                        device["rounded_rssi"] = Math.round(device["rssi"] / 25) * 25;

                        if (i == 0) {

                            device["first_device"] = true;
                        }

                        device["device_number"] = device.pk;

                        if ($.cookie("superuser") == "True") {
                            device["raw"] = 1;
                        }

                        var sensor_data = device["sensor_data"];

                        for (var j = 0; j < sensor_data.length; j++) {
                            if (j > 0) {
                                sensor_data[j]["separator"] = true;
                            }

                            var sensor_measurements = sensor_data[j]["measurements"];

                            for (var l = 0; l < sensor_measurements.length; l++) {
                                if (sensor_measurements[l] != null) {
                                    var translate_title = sensor_measurements[l]["label"]
                                    var new_title = translate_title;
                                    if (new_title.charAt(0) == ' ') {
                                        new_title = new_title.replace(' ', '')
                                    }
                                    new_title = new_title.replace('(', '').replace(')', '').replace('-', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace('-', '_').replace('/', '_').replace('&', 'A').replace('CO��', 'CO').replace('慣', 'A')
                                    new_title = new_title.replace('532', 'FIVE_THIRTYTWO').replace('570', 'FIVE_SEVENTY').replace('650', 'SIX_FIFTY').replace('810', 'EIGHT_TEN').toUpperCase()

                                    sensor_measurements[l]["label"] = translations[user_language][new_title];
                                }
                            }

                            for (var k = 0; k < sensor_measurements.length; k++) {
                                if (k % 4 == 0 && k != 0) {
                                    sensor_measurements[k]["inner_separator"] = true;

                                }

                            }
                        }
                    }

                    var devices = data["devices"];
                    for (var l = 0; l < devices.length; l++) {
                        var device = devices[l];
                        if (!("last_updated" in device)) {
                            device["last_updated"] = translations[user_language]["HAVE_NOT_PROCESSED_DATA"]
                        }
                        if ((device["sensor_data"]).length == 0) {
                            (device["no_sensor_data_found"]) = (translations[user_language]["THERE_IS_NO_DATA_SHOW"])
                        }
                    }


                    self.$rendered = $(Mustache.render(self.$template[0].innerHTML, data));
                    loader.stop();
                    $('.content').append(self.$rendered);
                    $('[data-toggle="tooltip"]').tooltip();
                    $('.content').fadeIn("fast");



                    //allow user to be able to navigate again
                    enable_nav_buttons();

                    // have all the list panels get the correct height when page is loaded
                    resize_height_of_accordion();

                    // if a device is selected then it will scroll it
                    var id_of_device = $(".deviceTree .logger.active").data("id");
                    if (id_of_device != undefined) {
                        goToByScroll(id_of_device);
                        highlightItemList($("#device-" + id_of_device));
                    }


                },
                error: function(a, b, c) {
                    loader.stop();
                    $('.content').html('<div style="margin: 10px; left: 50%; width: 100px; margin-left: 50%;">' + translations[user_language]["NO_DATA_AVAILABLE_YET"] + '</div>');

                    //allow user to be able to navigate again
                    enable_nav_buttons();

                }

            });
        });

        $("#new-device-btn").off("click").on("click", function() {
            create_and_show_new_device_subscription_modal();
            ga('send', {
                hitType: 'event',
                eventCategory: 'UI Interaction',
                eventAction: 'click',
                eventLabel: 'add_new_device_list'
            });
        });

        $("#new-site-btn").off("click").on("click", function() {
            create_and_show_new_site_modal();
            ga('send', {
                hitType: 'event',
                eventCategory: 'UI Interaction',
                eventAction: 'click',
                eventLabel: 'add_new_site_list'
            });
        });

        $("#new-plot-btn").off("click").on("click", function() {
            create_and_show_new_section_modal();
            ga('send', {
                hitType: 'event',
                eventCategory: 'UI Interaction',
                eventAction: 'click',
                eventLabel: 'add_new_plot_list'
            });
        });

    }

    function goToByScroll(id) {
        if ($(".btn.navItem.active").data("hash") == "dashboard_list") {
            if ($("#device-" + id).length != 0) {
                $("#device-" + id).scrollintoview({ duration: 400 });
            } else {
                addErrorFlash(translations[user_language]["NO_DATA_THIS_DEVICE"]);
            }
        }
    }

    function highlightItemList(selected_element) {
        $(".list-item").removeClass("active");
        selected_element.addClass("active");
    }

    // Scroll to the list view item when the sidebar item is clicked
    $(".deviceTree .logger").off('click.list.logger').on('click.list.logger', function() {

        // open the list info for a given device and only open
        var id_of_device = $(this).data("id");
        $("#device-" + id_of_device).find("#btn-close-all_row").addClass("open");

        $this = $("#device-" + id_of_device)[0]["children"][0];
        $this = $($this).closest(".panelHead").next();
        $this.addClass("open");

        var row_height = $this.find('.panelBody')[0].clientHeight;
        $this.animate({
            'max-height': row_height + "px",
            'height': row_height + "px",
            'transition': 'max-height 0.4s ease-out'
        }, {
            complete: function() {
                goToByScroll(id_of_device);
                highlightItemList($("#device-" + id_of_device));
            }
        });

        // // get selected item and scroll to it
        // setTimeout(function() {
        //     $(".logger.active").click();
        // }, 700);
    });
};

dashboard_list.hide = function() {
    $(".deviceTree .logger").off('click.list.logger');
    $.xhrPool.abortAll();
};


function resize_height_of_accordion() {
    // have all the list panels get the correct height
    $(".accordion-btn.accordion-row").each(function() {
        $this = $(this).closest(".panelHead").next();
        if ($this.hasClass("open")) {
            add_correct_height_to_accordion($this)
        }
    });
}


function add_correct_height_to_accordion(accordion) {
    var row_height = accordion.find('.panelBody')[0].clientHeight;
    accordion.css({ 'max-height': row_height + "px" });
    accordion.css({ 'height': row_height + "px" });
    accordion.css({ 'transition': 'max-height 0.4s ease-out' });
}


function close_open_all_list_info() {
    $title_button = $("#btn-close-all_title");
    $accordion_button = $(".accordion-btn.accordion-row");
    $accordion_no_trans = $(".accordion-without-transition");

    $title_button.toggleClass("open");

    if ($title_button.hasClass("open")) {

        $accordion_button.addClass("open");
        $accordion_no_trans.addClass("open");
        $accordion_button.each(function() {
            $this = $(this).closest(".panelHead").next();
            add_correct_height_to_accordion($this)
        });
    } else {
        $accordion_button.removeClass("open");
        $accordion_no_trans.removeClass("open");
        $accordion_button.each(function() {

            $this = $(this).closest(".panelHead").next();
            $this.animate(closing_accordion_animation, {
                complete: function() {
                    //    this is to make sure that the transition is completed before the code moves on
                    $this.css(final_state_of_closed_accordion);
                }
            });
        });
        // Clean the transition
        $accordion_button.each(function() {
            $this = $(this).closest(".panelHead").next();
            $this.css({ 'transition': '' });
        });
    }
}


function close_open_single_list_info(row) {
    $title_button = $("#btn-close-all_title");
    $accordion_button = $(".accordion-btn.accordion-row");
    $accordion = $(row).closest(".panelHead").next();
    $panel = $(row).closest(".panelHead").parent();
    $current_active_panel = $(document).find(".panel.list-item.active");
    $current_active_device = $(document).find(".treeItem.logger.active");
    var selected_device_pk = parseInt($panel[0]['id'].split('-')[1]);
    $device = $(document).find(".treeItem.logger[data-id=\"" + selected_device_pk + "\"]");

    $(row).toggleClass("open");
    $accordion.toggleClass("open");

    if ($accordion.hasClass("open")) {
        add_correct_height_to_accordion($accordion);

        //if opening window, make device and panel 'active'
        if (!$panel.hasClass("active")) {

            $current_active_panel.removeClass("active");
            $panel.addClass("active");

            $current_active_device.removeClass("active");
            $device.addClass("active");
        }
    } else {
        $accordion.animate(closing_accordion_animation, {
            complete: function() {
                $accordion.css(final_state_of_closed_accordion);
            }
        });
    }


    // Open the "close all" button if all accordions are open
    var are_all_open = true;
    $accordion_button.each(function() {
        if (!$(this).hasClass("open")) {
            are_all_open = false;
        }
    });

    if (are_all_open) {
        $title_button.addClass("open");
    }

    // Close the "close all" button if all accordions are closed
    var are_all_closed = true;

    $accordion_button.each(function() {
        if ($(this).hasClass("open")) {
            are_all_closed = false;
        }
    });

    if (are_all_closed) {
        $title_button.removeClass("open");
    }
}

function download_options(pk) {
    create_and_show_download_modal(pk);
    ga('send', {
        hitType: 'event',
        eventCategory: 'UI Interaction',
        eventAction: 'click',
        eventLabel: 'download_data_list'
    });
}

var startDate;
var endDate;
var endDate_storage;


function get_request_data(item) {
    return {
        'device_description': item.device_name + "/" + item.sn,
        'request_time': item.request_time,
        'status': item.status,
        'time_frame': item.start_date + " - " + item.end_date,
        'request_id': item.id,
        'ready_for_download': item.ready_for_download,
        'need_request_again': item.need_request_again,
        'in_progress': item.in_progress,
        'filename': escape(item.filename)
    };
}

let last_download_requests = [];
let refresh_interval = null;

delete_download_request = function(request_id) {
    if (confirm("This action cannot be undone.")) {
        $.ajax({
            type: "POST",
            url: "/api/2.0/downloads/delete/" + request_id + "/",
            success: function(data) {
                // This function goes and adds a removal animation to the line we are going to delete.
                // Once the animation finishes it will fully remove the item.
                $('*[data-id=' + request_id + ']').addClass('removed-row')
                    .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
                        $(this).remove();
                        return false;
                    });
                return false;
            }
        });
    }
    return false;
};

request_download_request_again = function(request_id) {
    window.event.preventDefault();
    var d = new Date();
    var current_date = parseInt(d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();

    $.ajax({
        type: "GET",
        url: "/api/2.0/download-xlsx/request/" + request_id + "/" + current_date + "/",
        success: function(data) {
            $('*[data-id=' + request_id + ']').addClass('removed-row')
                .one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
                    $(this).remove();
                });
            let request_item_template = ZCTemplate.get('download_request_item');
            let request_item_section = $("#download_request_section");
            let request = data.items;
            var request_data = get_request_data(request);
            var rendered = Mustache.render(request_item_template, request_data);
            request_item_section.prepend(rendered);
            // Would like to scroll to top here.
            window.event.stopPropagation();
            return false;
        },
        error: function(data) {
            if (data.status === 404) {
                modalErrorFlash(translations[user_language]["NO_DATA_TIME_PERIOD"]);
                window.event.stopPropagation();
                return false;
            } else if (data.status === 500) {
                modalErrorFlash("Download Failed");
                window.event.stopPropagation();
                return false;
            } else {
                modalErrorFlash(data.responseJSON.message);
                window.event.stopPropagation();
                return false;
            }
        }
    });
    window.event.stopPropagation();
    return false;
};

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    for (let i = 0; i < arr1.length; i++) {
        if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i]))
            return false;
    }
    return true;
}

refresh_download_requests = function() {
    if (window.event !== undefined) {
        window.event.preventDefault();
    }

    if ($("#form-download-data").length) {
        $(".download-request-btn .glyphicon-refresh").addClass("fast-right-spinner");
        $.ajax({
            type: "GET",
            url: "/api/2.0/downloads/",
            success: function(data) {
                // Check if anything has changed first. If it has then refresh.
                if (!arraysEqual(last_download_requests, data.items)) {
                    let request_item_section = $("#download_request_section");
                    last_download_requests = data.items;
                    request_item_section.empty();
                    if (data.items.length === 0) {
                        request_item_section.append('<div class="row download-request-item"><div class="col-xs-12 col-sm-offset-4 col-sm-8">' + translations[user_language]["THERE_IS_NOT_A_SHRED"] + '</div></div>');
                    } else {
                        let request_item_template = ZCTemplate.get('download_request_item');
                        for (var i = 0; i < data.items.length; i++) {
                            let item = data.items[i];
                            var request_data = get_request_data(item);
                            var rendered = Mustache.render(request_item_template, request_data);
                            request_item_section.append(rendered);
                        }
                    }
                }
                $('[data-toggle="tooltip"]').tooltip();
                $(".download-request-btn .glyphicon-refresh").removeClass("fast-right-spinner");
                window.event.stopPropagation();
                return false;
            }
        });
    } else {
        // We want to remove the refresh interval so that we don't continue making ajax calls when they are unnecessary.
        clearInterval(refresh_interval)
    }
    return false;
};

fill_in_download_requests = function(e) {
    $.ajax({
        type: "GET",
        url: "/api/2.0/downloads/",
        success: function(data) {
            $("#loading-requests").hide();
            let request_item_section = $("#download_request_section");
            last_download_requests = data.items;
            if (data.items.length === 0) {
                request_item_section.append('<div class="row download-request-item"><div class="col-xs-12 col-sm-offset-4 col-sm-8">' + translations[user_language]["THERE_IS_NOT_A_SHRED"] + '</div></div>');
            } else {
                let request_item_template = ZCTemplate.get('download_request_item');
                for (var i = 0; i < data.items.length; i++) {
                    let item = data.items[i];
                    var request_data = get_request_data(item);
                    var rendered = Mustache.render(request_item_template, request_data);
                    request_item_section.append(rendered);
                }
            }
            $('[data-toggle="tooltip"]').tooltip();
            // window.event.stopPropagation();
            return false;
        }

    });
    // window.event.stopPropagation();
    return false;
};

create_and_show_download_modal = function(pk) {
    var loader = $(".int-load");
    if (loader) {
        loader.show();
        // loader.remove()
    }
    $.ajax({
        type: "GET",
        url: "/api/1.0/device/",
        success: function(device_data) {
            loader.hide();
            var self = this;
            var json = translations[user_language];
            var template = ZCTemplate.get('download-data-options');

            var new_model_metadata = $.extend(true, json, model_metadata, {
                "EXCEL_DOWNLOAD_OPTIONS": translations[user_language]["EXCEL_DOWNLOAD_OPTIONS"],
                "DEVICE": translations[user_language]["DEVICE"],
                "TIME_FRAME": translations[user_language]["TIME_FRAME"],
                "STATUS": translations[user_language]["STATUS"],
            });
            var rendered = Mustache.render(template, new_model_metadata);
            // var modal_title        = '<h4 class="modal-title">'+ translations[user_language]["MANAGE_DOWNLOADS"]+ '</h4>';
            var modal_title = '<h4 class="modal-title">Manage Downloads</h4>';
            var modal = new ZCModal.modal(modal_title, rendered, "Request Data", false, "Close");

            var download_options = {
                "date_range": translations[user_language]["DOWNLOAD_DATA_SPECIFIED_DATE"],
                "all": translations[user_language]["DOWNLOAD_ALL_DATA"],
                "dsld": translations[user_language]["DOWNLOAD_DATA_LAST_DOWNOAD"]
            };

            let dropdown_options = {
                no_input: true,
                required: true,
                sort_by_text: true
            };

            var download_dropdown = new ZCDropdown.dropdown(
                download_options,
                translations[user_language]["CHOOSE_DOWNLOAD_OPTION"],
                dropdown_options
            );

            download_dropdown.value("date_range");
            let device_only_dict = {};

            for (let i = 0; i < device_data.items.length; i++) {
                let device_info = device_data.items[i];
                let device_name = device_info.local_name;
                let device_id = device_info.did;
                device_only_dict[device_id] = device_name;
            }

            let device_dropdown = new ZCDropdown.dropdown(
                device_only_dict,
                "Select Device",
                $.extend(dropdown_options, { multiple_selection_no_input: true })
            );

            device_dropdown.value(pk);

            download_dropdown.parent(modal.$modal.find("#dropdown-download"));
            device_dropdown.parent(modal.$modal.find("#device-dropdown"));
            var dsld_date = LocalStorage.get('dashboard_list.dsld_endDate' + pk + account_user_id);

            if (dsld_date) {
                let d = new Date(dsld_date);
                if (d == "Invalid Date") {
                    dsld_date = undefined;
                }
            }

            modal.on('show', function($modal) {

                var excel_download_row = modal.$modal.find("#excel_daterange");

                var date_range = $modal.find("#date_range_selector").html();
                excel_download_row.append(date_range);

                download_request_file = function(request_id, filename) {
                    if (window.event !== undefined) {
                        window.event.preventDefault();
                    }
                    let export_url = "/report/download-xlsx/" + request_id + "/";

                    $.get(export_url, function() {
                        window.open(export_url, '_blank');
                    }).fail(function() {
                        addFlashNotification(translations[user_language]["FAILED_DOWNLOAD"], true, ".zc-modal-header");
                        refresh_download_requests();
                    });

                    window.event.stopPropagation();
                    return false;
                };

                //on selecting dropdown, if date range is picked, display date range picker
                $("#dropdown-download").off('click.list.dropdown-download').on('click.list.dropdown-download', function(evt) {

                    var download_value = download_dropdown.value();
                    modal.$modal.find("#excel_daterange").empty();

                    if (download_value == "date_range") {
                        var date_range = $modal.find("#date_range_selector").html();
                        excel_download_row.append(date_range);

                        $('input[name="daterange"]').daterangepicker(
                            //bootstrap predefined ranges of datetime selector
                            $(function() {

                                var start = moment().subtract(29, 'days');
                                var end = moment();

                                $('#reportrange').daterangepicker({
                                    alwaysShowCalendars: true,
                                    autoApply: true,
                                    startDate: start,
                                    endDate: end
                                }, cb);

                                cb(start, end);

                                function cb(start, end) {

                                    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                                    startDate = parseInt(start._d.getMonth() + 1) + '-' + start._d.getDate() + '-' + start._d.getFullYear() + ' ' + '00:00';
                                    endDate = parseInt(end._d.getMonth() + 1) + '-' + end._d.getDate() + '-' + end._d.getFullYear() + ' ' + end._d.getHours() + ':' + end._d.getMinutes();
                                    endDate_storage = end._d.toLocaleString();
                                }

                            })
                        );
                    }

                    if (download_value == "dsld") {
                        var ed = new Date();
                        endDate_storage = ed.toLocaleString();
                    }

                    if (download_value == "all") {
                        startDate = 0;
                        var ed = new Date();
                        endDate = parseInt(ed.getMonth() + 1) + '-' + ed.getDate() + '-' + ed.getFullYear() + ' ' + ed.getHours() + ':' + ed.getMinutes();
                        endDate_storage = ed.toLocaleString();

                    }
                });

                // Click the dropdown now that we have the value set so that the actual range selector shows up.
                $("#dropdown-download").click();

                fill_in_download_requests();

                refresh_interval = setInterval(function() {
                    refresh_download_requests();
                }, 5000);
            });

            modal.on('accept', function($modal) {
                // Disable the button so that we can't have multiple clicks.
                $("#zc-modal-btn-accept").prop('disabled', true);
                //save users last download to local storage
                var download_value = download_dropdown.value();
                var devices = device_dropdown.value();

                var d = new Date();
                var current_date = parseInt(d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();

                if (download_value === "dsld") {

                    if (!(dsld_date)) {
                        var d = new Date();
                        // startDate = 0;
                        endDate = parseInt(d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();
                        // download_value = "all"
                    } else {
                        var d = new Date(dsld_date);
                        startDate = parseInt(d.getMonth() + 1) + '-' + (d.getDate()) + '-' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes();
                        // endDate = 0;
                    }


                }

                LocalStorage.set('dashboard_list.dsld_endDate' + pk + account_user_id, endDate_storage);

                let download_data = {
                    start_date: startDate,
                    end_date: endDate,
                    download_value: download_value,
                    current_date: current_date,
                    devices: devices
                };

                $.ajax({
                    type: "POST",
                    url: "/api/2.0/download-xlsx/",
                    contentType: 'application/json',
                    data: JSON.stringify(download_data),
                    success: function(data) {
                        let request_item_template = ZCTemplate.get('download_request_item');
                        let request_item_section = $("#download_request_section");
                        for (let request_index = 0; request_index < data.items.length; request_index++) {
                            let request = data.items[request_index];
                            var request_data = get_request_data(request);
                            var rendered = Mustache.render(request_item_template, request_data);
                            request_item_section.prepend(rendered);
                        }
                        // Re-enable the button
                        $("#zc-modal-btn-accept").prop('disabled', false);
                    },
                    error: function(data) {
                        if (data.status === 404) {
                            modalErrorFlash(translations[user_language]["NO_DATA_TIME_PERIOD"], true);
                        } else if (data.status === 500) {
                            modalErrorFlash(translations[user_language]["DOWNLOAD_FAILED"], true)
                        } else {
                            modalErrorFlash(data.responseJSON.message, true)
                        }
                        // Re-enable the button
                        $("#zc-modal-btn-accept").prop('disabled', false);
                    }
                });

                return false;

            });

            modal.show();
        },
        error: function(data) {
            loader.hide();
            if (data.status === 404) {
                addFlashNotification(translations[user_language]["NO_DATA_TIME_PERIOD"], true);
            } else if (data.status === 500) {
                addFlashNotification(translations[user_language]["DOWNLOAD_FAILED"], true)
            } else {
                addFlashNotification(data.responseJSON.message, true)
            }
        }
    });
};