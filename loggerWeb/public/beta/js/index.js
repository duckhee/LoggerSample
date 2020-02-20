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
    enableControlHeaderNav: false,
    /** SideBar Control */
    sidebarPushMenu: true,
    //Sidebar push menu toggle button selector
    sidebarToggleSelector: "[data-toggle='offcanvas']",
    //Sidebar push menu toggle button selector
    controlSidebarOptions: {
        //Which button should trigger the open/close event
        toggleBtnSelector: "[data-toggle='control-sidebar']",
        //The sidebar selector
        selector: ".control-sidebar",
        //Enable slide over content
        slide: true
    },
    //The standard screen sizes that bootstrap uses.
    //If you change these in the variables.less file, change
    //them here too.
    screenSizes: {
        xs: 480,
        sm: 768,
        md: 992,
        lg: 1200
    }
};

$.Main.headerNav = function(menu) {
    var _this = this;
    $(document).off('click' + menu + '.menuItem')
        .on('click', menu + '.menuItem', function(e) {
            var $this = $(this);
            var checkElement = $this.next();
            if (($this.is('.menuItem'))) {
                $(menu).clidren('active').removeClass('active');
                $this.addClass('active');
            }
        });
};

$.Main.tree = function(menu) {
    var _this = this;
    var animationSpeed = $.Main.options.animationSpeed;
    $(document).off('click' + menu + ' .treeItem-menu')
        .on('click', menu + ' .treeItem-menu', function(e) {
            var $this = $(this);
            var checkElement = $this.next();
            if (checkElement.is('.treeItem-menu-item') && (checkElement.is(':visible'))) {
                checkElement.slideUp(animationSpeed, function() {});
            } else if (checkElement.is('.treeItem-menu-item') && (!checkElement.is(':visible'))) {
                checkElement.slideDown(animationSpeed, function() {});
            }
            if (checkElement.is(''))
                if (checkElement.is()) {
                    e.preventDefault();

                }
        });
};

/* ControlSidebar()
 * ==========
 * Adds the push menu functionality to the sidebar.
 *
 * @type Function
 * @usage: $.Main.pushMenu("[data-toggle='offcanvas']")
 */
$.Main.controlSidebar = {
    //instantiate the object
    activate: function(toggleBtn) {
        //GEt the screen sizes
        var screenSizes = $.Main.options.screenSizes;

        //Enable sidebar toggle
        $(document).on('click', toggleBtn, function(e) {
            e.preventDefault();
            console.log('sidebar control');
            //Enable sidebar push menu
            //sidebar-collapse wrapper-collapse
            //main-sidebar wrapper
            if ($(".main-sidebar").hasClass("sidebar-collapse")) {
                $(".main-sidebar").removeClass('sidebar-collapse');
                $(".wrapper").removeClass('wrapper-collapse');
                $('.content').css('width', $(window).width() - 260);
                $(".map").css('width', $(window).width() - 260);

            } else {
                $(".main-sidebar").addClass('sidebar-collapse');
                $(".wrapper").addClass('wrapper-collapse');
                $('.content').css('width', $(window).width());
                $(".map").css('width', $(window).width());
            }

        });
    }

};

/** Header Menu Control */
$.Main.HomeMove = {
    active: function() {


    }
};

$.Main.HeaderMove = {
    active: function() {
        $("#dashBoardSelect").click(function() {

            location.href = "/beta/Dashboard";
        });
        $("#MapSelect").click(function() {

            location.href = "/beta/map";
        });
        $("#ListSelect").click(function() {

            location.href = "/beta/list";
        });
        $("#DetailSelect").click(function() {

            location.href = "/beta/detail";
        });
    }
};

$(function() {
    'use strict';
    var options = $.Main.options;
    if (options.enableControlTreeView) {
        $.Main.tree(".main-sidebar");
    }
    if (options.sidebarPushMenu) {
        $.Main.controlSidebar.activate(options.sidebarToggleSelector);
    }
    $.Main.HeaderMove.active();

    $("#LogoutBtn").click(function() {
        console.log("Log out Btn ");
        document.LogoutForm.method = "POST";
        document.LogoutForm.action = "/beta/logout";
        document.LogoutForm.submit();
    });
});