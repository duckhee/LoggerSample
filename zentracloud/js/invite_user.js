var email_sent = false;
var user_language        =$.cookie("LANGUAGE_ID");

$("button.dropdown-toggle").click(function() {
    var dropdown = $(this);
    var items = $(this).next().find("a");
    items.removeClass("active");

    items.each(function(i, obj) {
        if ($(obj).text().trim() == dropdown.text().trim()) {
            $(obj).addClass("active");
        }
    });
});

$(".dropdown-menu > li").click(function() {
    $(this).parent().prev().find(".btn-label").text($(this).text());
});

$("button#sendInvitation").click(function() {
    var email = $("#invite-email").val();
    var name = $("#invite-name").val();
    var role = $("#invite-role").text();
    var permissions = $("#invite-permissions").text();
    var alerts = $("#invite-alerts").text();

    var invitation_data = {"email": email, "name": name, "role": role, "permissions": permissions, "alerts": alerts, "csrfmiddlewaretoken": getCookie('csrftoken')};

    $.ajax({
        type: "POST",
        url: "invite_user/",
        data: invitation_data,
        success: function(result) {
            var result_div = $("#invite-success");
            if (result == "ValidationError") {
                result_div.html(
                    "<div class='alertimage popup image-alert'></div>" +
                    "<span class='alertMessage'>"+translations[user_language]["INVALID_EMAIL"]+":<br><b>" + email + "</b></span>"
                );
                email_sent = false;
            }
            else if (result == "NameError") {
                result_div.html(
                    "<div class='alertimage popup image-alert'></div>" +
                    "<span class='alertMessage'>"+translations[user_language]["NAME_CANNOT_BE_EMPTY"]+"</span>"
                );
                email_sent = false;
            }
            else if (result == "AlreadyExists") {
                result_div.html(
                    "<div class='alertimage popup image-alert'></div>" +
                    "<span class='alertMessage'>"+translations[user_language]["USER_ALREADY_EXISTS"]+":<br><b>" + email + "</b></span>"
                );
                email_sent = false;
            }
            else {
                result_div.html(
                    "<div class='alertimage popup image-success'></div>" +
                    "<span class='alertMessage'>"+translations[user_language]["INVITATION_SENT"]+"<br><b>" + email + "</b></span>"
                );
                email_sent = true;
            }
        },
        error: function(message) {
            console.log("Error: ", message.responseText);
            $("#invite-success").html(
                "<div class='alertimage popup image-alert'></div>" +
                "<span class='alertMessage'>"+translations[user_language]["SOMETHING_WENT_WRONG_INVITATION"]+"<br><b>" + email + "</b></span>"
            );
        }
    });
});

$(".modal.inviteUser").on("hidden.bs.modal", function() {
    if (email_sent) {
        location.reload();
    }
});

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}