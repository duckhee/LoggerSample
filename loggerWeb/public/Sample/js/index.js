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

$(function() {
    'use strict';
    var options = $.Main.options;
    if (options.enableControlTreeView) {
        $.Main.tree(".main-sidebar");

    }
});