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
    /** Date Picker Setting */
    $('.datePicker').datepicker({
        format: "yyyy-mm-dd", //데이터 포맷 형식(yyyy : 년 mm : 월 dd : 일 )

        autoclose: true, //사용자가 날짜를 클릭하면 자동 캘린더가 닫히는 옵션
        calendarWeeks: false, //캘린더 옆에 몇 주차인지 보여주는 옵션 기본값 false 보여주려면 true
        clearBtn: false, //날짜 선택한 값 초기화 해주는 버튼 보여주는 옵션 기본값 false 보여주려면 true
        disableTouchKeyboard: false, //모바일에서 플러그인 작동 여부 기본값 false 가 작동 true가 작동 안함.
        immediateUpdates: true, //사용자가 보는 화면으로 바로바로 날짜를 변경할지 여부 기본값 :false 
        multidate: true, //여러 날짜 선택할 수 있게 하는 옵션 기본값 :false 
        endDate: '+0d', //오늘까지 선택 가능하게 하는 옵션
        multidateSeparator: ",", //여러 날짜를 선택했을 때 사이에 나타나는 글짜 2019-05-01,2019-06-01
        templates: {
            leftArrow: '&laquo;',
            rightArrow: '&raquo;'
        }, //다음달 이전달로 넘어가는 화살표 모양 커스텀 마이징 
        orientation: "bottom right",
        todayHighlight: false, //오늘 날짜에 하이라이팅 기능 기본값 :false 
        toggleActive: false, //이미 선택된 날짜 선택하면 기본값 : false인경우 그대로 유지 true인 경우 날짜 삭제
        weekStart: 0, //달력 시작 요일 선택하는 것 기본값은 0인 일요일 
        language: "ko" //달력의 언어 선택, 그에 맞는 js로 교체해줘야한다.

    }); //datepicker end

});