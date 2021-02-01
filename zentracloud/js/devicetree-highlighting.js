function highlightDeviceTree(selected_element, type) {
    $(".treeItem").removeClass("active");
    selected_element.addClass("active");
    if(type == "plot" || type == "logger") {
        selected_element.prevAll("div.site:first").addClass("active");
        if(type == "logger"){
            selected_element.prevAll("div.plot:first").addClass("active");
        }
    }
}

$(document).ready(function() {
    $(".deviceTree > .logger").click(function() {
        highlightDeviceTree($(this), "logger");
    });
    $(".deviceTree > .plot").click(function() {
        highlightDeviceTree($(this), "plot");
    });
    $(".deviceTree > .site").click(function() {
        highlightDeviceTree($(this), "site");
    });
});