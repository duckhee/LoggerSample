if (typeof jQuery === "undefined") {
    throw new Error("Main requires jQuery");
}

$.Main = {};

$.Main.options = {
    /** Animation Speed */
    animationSpeed: 500,
    /** sidebar control enable */
    enableControlTreeView: true,
    /** middle menu enable */
    enableControlActionBarView: true,
    /**TODO */
    enableControlHeaderNav: false
};

//TODO
$.Main.headerNav = function(menu) {
    var _this = this;
    $(document).off('click' + menu + ' .menuItem')
        .on('click', menu + ' .menuItem', function(e) {
            var $this = $(this);

            var checkElement = $this.next();

            if (($this.is('.menuItem'))) {
                $(menu).children('.active').removeClass('active');
                $this.addClass('active');
            }

        });
};

//TODO
$.Main.actionBar = function(menu, map) {

    var _this = this;
    $(document).off('click' + menu + ' .btn-outline-dark')
        .on('click', menu + ' .btn-outline-dark', function(e) {
            var $this = $(this);
            var checkElement = $this;
            if ((checkElement.is('button')) && (!checkElement.is('.active'))) {
                var getParent = $this.parent().children('.active');
                getParent.removeClass('active');
                $this.addClass('active');
                //TODO
                console.log($this.text());
                var view = "#" + $this.text();
                console.log("view : ", view);
                /*
                                if (map === undefined) {
                                    mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vuc3J1ZCIsImEiOiI5ZGE3Yzg1MWViOGE5MTU5ZDk3YmU0MzU2YmQ0MjAxNiJ9.fYCk-YENYah_fjiMh0TvZg';
                                    var map = new mapboxgl.Map({
                                        container: 'Map',
                                        center: [137.9150899566626, 36.25956997955441],
                                        style: 'mapbox://styles/mapbox/satellite-v9',
                                        zoom: 9
                                    });
                                    var mapZoomCtrl = new mapboxgl.NavigationControl();
                                    map.addControl(mapZoomCtrl, 'bottom-right');
                                }
                */
                if ("#Map" === view) {
                    $(".detail-view").css('display', 'none');
                    $(view).slideToggle(function() {
                        console.log('show');
                        $(view).focus();
                        map.resize();

                    });
                } else {
                    $(".map-view").css('display', 'none');
                    $(view).slideToggle(function() {
                        console.log("detail show");
                    })
                }

            }
        });
};


$.Main.tree = function(menu) {
    var _this = this;
    var animationSpeed = $.Main.options.animationSpeed;
    $(document).off('click' + menu + ' .treeItem-menu')
        .on('click', menu + ' .treeItem-menu', function(e) {
            var $this = $(this);
            var checkElement = $this.parent().next();
            if ($this.is('.treeItem-menu')) {
                if ($this.children('i').is('.fa-folder')) {
                    $this.children('i').removeClass('fa-folder');
                    $this.children('i').addClass('fa-folder-open');
                    $this.addClass('menu-open');

                } else {
                    $this.children('i').removeClass('fa-folder-open');
                    $this.children('i').addClass('fa-folder');
                    $this.removeClass('menu-open');
                }
            }
            if (checkElement.is('.treeItem-menu-item') && (checkElement.is(':visible'))) {
                checkElement.slideUp(animationSpeed, function() {
                    console.log('close item');


                });
            } else if (checkElement.is('.treeItem-menu-item') && (!checkElement.is(':visible'))) {
                checkElement.slideDown(animationSpeed, function() {
                    console.log('show item');

                });
            }
            if (checkElement.is(''))
                if (checkElement.is()) {
                    e.preventDefault();

                }
        });
};

$(function() {
    "use strict";
    var map;
    var popup;
    var marker;
    var options = $.Main.options;
    var Action = $(".md-menu").children('.active').text();

    if (Action === "Map") {
        $('.map-view').css('display', 'block');
        var view = "#" + Action;
        mapboxgl.accessToken = 'pk.eyJ1IjoiZG91Y2toZWUiLCJhIjoiY2sydHFqbGhlMWU3MjNvbnZwMXRyYm5iaSJ9.AcPTDkYnboPF0NgLLQ_sIw';
        var map = new mapboxgl.Map({
            container: 'Map',
            center: [126.812355, 33.542225],
            style: 'mapbox://styles/mapbox/satellite-streets-v9',
            zoom: 14
        });

        var mapZoomCtrl = new mapboxgl.NavigationControl();

        mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js');
        map.addControl(new MapboxLanguage({
            defaultLanguage: 'ko'
        }));

        map.addControl(mapZoomCtrl, 'bottom-right');

        /** Set popup */
        var mapPopUp =
            "<div class='map-popup'>" +
            "<div class='map-box'>" +
            "<h5 class='map-box-title'>Jeju Island</h5>" +
            "<div class='map-box-content'>" +
            "<img src='http://hydro.browse.jp/hydrolift/45-JEJU/45-JEJUdata/g1_0.png' style='width:100%; height:80%;'>" +
            "<img src='http://hydro.browse.jp/hydrolift/45-JEJU/45-JEJUdata/g1_1.png' style='width:100%;height:80%;'>" +
            "<img src='http://hydro.browse.jp/hydrolift/45-JEJU/45-JEJUdata/g1_2.png' style='width:100%;height:80%;'>" +
            "<img src='http://hydro.browse.jp/hydrolift/45-JEJU/45-JEJUdata/g1_3.png' style='width:100%;height:80%;'>" +
            "</div>" +
            /**map box content end  */
            "</div>" +
            /**map box end  */
            "</div>";
        /**map-popup end  */
        popup = new mapboxgl.Popup({ offset: 25, anchor: 'bottom' })
            .setMaxWidth("600px")
            .setHTML(mapPopUp);

        marker = new mapboxgl.Marker({
                draggable: false
            })
            .setLngLat([126.8124566, 33.542319])
            .setPopup(popup)
            .addTo(map);


    }

    if (options.enableControlHeaderNav) {
        $.Main.headerNav(".menuBar");
    }
    if (options.enableControlTreeView) {
        $.Main.tree(".sidebar");
    }
    if (options.enableControlActionBarView) {
        $.Main.actionBar(".md-menu", map);
    }
    if (map !== undefined) {
        map.on('click', function(e) {
            var px = map.project(e.lngLat); // find the pixel location on the map where the popup anchor is
            px.y -= e.lngLat.lat + 250; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
            map.panTo(map.unproject(px), { animate: true }); // pan to new center
        });

        $("#device1").click(function() {
            var deviceLat = { lng: 126.8124566, lat: 33.542319 };
            var px = map.project(deviceLat);
            px.y -= deviceLat.lat + 250; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
            map.panTo(map.unproject(px), { animate: true });
            popup.addTo(map);
        });
    }
    $("#home").click(function() {
        location.href = "./index.html";
    });
    $("#manage-device").click(function() {
        location.href = "./ManageDevice.html";
    });

});