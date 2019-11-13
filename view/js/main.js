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
                    $(view).slideToggle(function() {
                        console.log('show');
                        $(view).focus();
                        map.resize();

                    });
                } else {
                    $(".map-view").css('display', 'none');
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
    var options = $.Main.options;
    var Action = $(".md-menu").children('.active').text();
    console.log("Action : ", Action);
    if (Action === "Map") {
        $('.map-view').css('display', 'block');
        var view = "#" + Action;
        console.log("view : ", view);
        mapboxgl.accessToken = 'pk.eyJ1IjoiZG91Y2toZWUiLCJhIjoiY2sydHFqbGhlMWU3MjNvbnZwMXRyYm5iaSJ9.AcPTDkYnboPF0NgLLQ_sIw';
        var map = new mapboxgl.Map({
            container: 'Map',
            center: [137.9150899566626, 36.25956997955441],
            style: 'mapbox://styles/mapbox/satellite-streets-v9',
            zoom: 9
        });

        var mapZoomCtrl = new mapboxgl.NavigationControl();

        mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js');
        map.addControl(new MapboxLanguage({
            defaultLanguage: 'ko'
        }));

        map.addControl(mapZoomCtrl, 'bottom-right');

    }
    console.log("Action : ", Action);
    if (options.enableControlHeaderNav) {
        $.Main.headerNav(".menuBar");
    }
    if (options.enableControlTreeView) {
        $.Main.tree(".sidebar");
    }
    if (options.enableControlActionBarView) {
        $.Main.actionBar(".md-menu", map);
    }

});