// NOTE(brett): This is just a wrapper for the localstorage object

am4core.options.commercialLicense = true;

var token                = $.cookie('token');
var csrf                 = $.cookie('csrftoken');
var validator_my_account = null;
var ROLES                = null;
var ROLES_ORDER          = null;
var PERMISSIONS          = null;
var SUBSCRIPTIONS        = null;
var window_width         = window.screen.availWidth;
var user_language        =$.cookie("LANGUAGE_ID");
var allowed_search_items = [];
var sn_map               = {};
var customersite_map     = {};

if (user_language ==  null)
{
    user_language= 0; //this is set default language and will be changed according to the location
}

var LANGUAGE = {};
var print = console.log;
$.xhrPool = [];
$.xhrPool.abortAll = function() {
    $(this).each(function(i, jqXHR) {   //  cycle through list of recorded connection
        jqXHR.abort();  //  aborts connection
        $.xhrPool.splice(i, 1); //  removes from list by index
    });
};

$.ajaxSetup({
    beforeSend: function(jqxhr) {
        jqxhr.setRequestHeader("Authorization", "Token " + token.toString());
        jqxhr.setRequestHeader("X-CSRFToken", csrf.toString());
        $.xhrPool.push(jqxhr);
    },
    error : function(jqxhr) {
    },
    complete: function(jqxhr) {
        if (jqxhr.status != 200 && jqxhr.status != 201 && jqxhr.status!=202 && jqxhr.status!=204 && jqxhr.statusText != 'abort') {
            if (jqxhr.responseJSON && jqxhr.responseJSON.message) {
                addErrorFlash(jqxhr.responseJSON.message);
            }
            else {
                if (jqxhr.status == 401 || jqxhr.status == 403) {
                    addErrorFlash(LANGUAGE["YOU_ARE_UNAUTHORISED"]);
                }
                else {
                    addErrorFlash(LANGUAGE["INTERNAL_SERVER_ERROR"]);
                }
            }
        }

        var i = $.xhrPool.indexOf(jqxhr);   //  get index for current connection completed
        if (i > -1) $.xhrPool.splice(i, 1); //  removes from list by index
    }
});

function is_empty(thing){
    // works for lists and dicts
    // AKA arrays and objects
    var attrs = 0;
    for (var _ in thing){
        attrs++;
    }
    if (attrs === 0){
        return true;
    }
    return false;
}

function orgSearchClick(e) {
    window.event.preventDefault();
    let search_val = $("#org-search-input").val();
    let by_name = searchbar_options.site_ids_by_name;
    let by_sn = searchbar_options.site_ids_by_sn;
    let by_device_name = searchbar_options.site_ids_by_device_name;
    var site_id = null;
    if (search_val in by_name){
        site_id = by_name[search_val];
    }
    else if (search_val in by_sn){
        site_id = by_sn[search_val];
    }
    else if (search_val in by_device_name){
        site_id = by_device_name[search_val];
    }
    else{
        addErrorFlash("No device or organization found.");
        return;
    }
    switchOrg(site_id);
}

function searchClick(e) {
    var search_val = $("#search-sn-input").val();
    var loggers = $(".treeItem.logger");
    var found = false;
    for (var i = 0; i < loggers.length; i++) {
        if ($(loggers[i]).data("sn") === search_val) {
            $(loggers[i]).click();
            found = true;
        }
    }
    if (!found) {
        addErrorFlash("Logger not found.");
    }
    else {
        $("#search-sn-input").val("")
    }
}


var map = null;
var LocalStorage = (function(){
    var storage = localStorage;

    // set value for key, Must be jsonable
    function _setItem(key, value) {
        try {
            storage.setItem(key, JSON.stringify(value));
        }
        catch(e) {
            console.error(e);
        }

        return key;
    }

    // NOTE(brett): Get the value keyed in the local storage by <key>. If it doenst exist
    // or is not json serializable then return the def value and show the error.
    function _getItem(key, def_value) {
        var value = storage.getItem(key);
        var result = def_value;
        if ( value ) {
            try {
                result = JSON.parse(value);
            }
            catch(e) {
                console.error(e);
            }
        }

        return result;
    }

    function _deleteItem(key){
        try {
            storage.removeItem(key);
        }
        catch(e) {
            console.error(e);
        }
    }

    return {
        get: _getItem,
        set: _setItem,
        delete: _deleteItem
    }
}());

var LANGUAGES = {
    0: translations['0']["COUNTRY_IN_OWN_LANGUAGE"], // English
    1: translations['1']["COUNTRY_IN_OWN_LANGUAGE"], // French
    2: translations['2']["COUNTRY_IN_OWN_LANGUAGE"], // PORTUGUESE
    3: translations['3']["COUNTRY_IN_OWN_LANGUAGE"], // RUSSIAN
    4: translations['4']["COUNTRY_IN_OWN_LANGUAGE"], // SPANISH
    5: translations['5']["COUNTRY_IN_OWN_LANGUAGE"], // DUTCH
    6: translations['6']["COUNTRY_IN_OWN_LANGUAGE"], // CHINESE
    7: translations['7']["COUNTRY_IN_OWN_LANGUAGE"], // JAPANESE
    8: translations['8']["COUNTRY_IN_OWN_LANGUAGE"], // CATALAN
    9: translations['9']["COUNTRY_IN_OWN_LANGUAGE"], // GERMAN
    //10: translations[1]["COUNTRY_IN_OWN_LANGUAGE"], // Polish
};

var COUNTRIES = {
        "AF": "AFGHANISTAN",
        "AX": "ALAND_ISLANDS",
        "AL": "ALBANIA",
        "DZ": "ALGERIA",
        "AS": "AMERICAN_SAMOA",
        "AD": "ANDORRA",
        "AO": "ANGOLA",
        "AI": "ANGUILLA",
        "AQ": "ANTARCTICA",
        "AG": "ANTIGUA_AND_BARBUDA",
        "AR": "ARGENTINA",
        "AM": "ARMENIA",
        "AW": "ARUBA",
        "AU": "AUSTRALIA",
        "AT": "AUSTRIA",
        "AZ": "AZERBAIJAN",
        "BS": "BAHAMAS",
        "BH": "BAHRAIN",
        "BD": "BANGLADESH",
        "BB": "BARBADOS",
        "BY": "BELARUS",
        "BE": "BELGIUM",
        "BZ": "BELIZE",
        "BJ": "BENIN",
        "BM": "BERMUDA",
        "BT": "BHUTAN",
        "BO": "BOLIVIA_PLURINATIONAL_STATE_OF",
        "BQ": "BONAIRE_SINT_EUSTATIUS_AND_SABA",
        "BA": "BOSNIA_AND_HERZEGOVINA",
        "BW": "BOTSWANA",
        "BV": "BOUVET_ISLAND",
        "BR": "BRAZIL",
        "IO": "BRITISH_INDIAN_OCEAN_TERRITORY",
        "BN": "BRUNEI_DARUSSALAM",
        "BG": "BULGARIA",
        "BF": "BURKINA_FASO",
        "BI": "BURUNDI",
        "KH": "CAMBODIA",
        "CM": "CAMEROON",
        "CA": "CANADA",
        "CV": "CAPE_VERDE",
        "KY": "CAYMAN_ISLANDS",
        "CF": "CENTRAL_AFRICAN_REPUBLIC",
        "TD": "CHAD",
        "CL": "CHILE",
        "CN": "CHINA",
        "CX": "CHRISTMAS_ISLAND",
        "CC": "COCOS_ISLANDS",
        "CO": "COLOMBIA",
        "KM": "COMOROS",
        "CG": "CONGO",
        "CD": "CONGO_THE_DEMOCRATIC_REPUBLIC_OF_THE",
        "CK": "COOK_ISLANDS",
        "CR": "COSTA_RICA",
        "CI": "COTE_D_IVOIRE",
        "HR": "CROATIA",
        "CU": "CUBA",
        "CW": "CURACAO",
        "CY": "CYPRUS",
        "CZ": "CZECH_REPUBLIC",
        "DK": "DENMARK",
        "DJ": "DJIBOUTI",
        "DM": "DOMINICA",
        "DO": "DOMINICAN_REPUBLIC",
        "EC": "ECUADOR",
        "EG": "EGYPT",
        "SV": "EL_SALVADOR",
        "GQ": "EQUATORIAL_GUINEA",
        "ER": "ERITREA",
        "EE": "ESTONIA",
        "ET": "ETHIOPIA",
        "FK": "FALKLAND_ISLANDS",
        "FO": "FAROE_ISLANDS",
        "FJ": "FIJI",
        "FI": "FINLAND",
        "FR": "FRANCE",
        "GF": "FRENCH_GUIANA",
        "PF": "FRENCH_POLYNESIA",
        "TF": "FRENCH_SOUTHERN_TERRITORIES",
        "GA": "GABON",
        "GM": "GAMBIA",
        "GE": "GEORGIA",
        "DE": "GERMANY",
        "GH": "GHANA",
        "GI": "GIBRALTAR",
        "GR": "GREECE",
        "GL": "GREENLAND",
        "GD": "GRENADA",
        "GP": "GUADELOUPE",
        "GU": "GUAM",
        "GT": "GUATEMALA",
        "GG": "GUERNSEY",
        "GN": "GUINEA",
        "GW": "GUINEA_BISSAU",
        "GY": "GUYANA",
        "HT": "HAITI",
        "HM": "HEARD_ISLAND_AND_MCDONALD_ISLANDS",
        "VA": "HOLY_SEE",
        "HN": "HONDURAS",
        "HK": "HONG_KONG",
        "HU": "HUNGARY",
        "IS": "ICELAND",
        "IN": "INDIA",
        "ID": "INDONESIA",
        "IR": "IRAN_ISLAMIC_REPUBLIC_OF",
        "IQ": "IRAQ",
        "IE": "IRELAND",
        "IM": "ISLE_OF_MAN",
        "IL": "ISRAEL",
        "IT": "ITALY",
        "JM": "JAMAICA",
        "JP": "JAPAN",
        "JE": "JERSEY",
        "JO": "JORDAN",
        "KZ": "KAZAKHSTAN",
        "KE": "KENYA",
        "KI": "KIRIBATI",
        "KP": "KOREA_DEMOCRATIC_PEOPLE_REPUBLIC_OF",
        "KR": "KOREA_REPUBLIC_OF",
        "KW": "KUWAIT",
        "KG": "KYRGYZSTAN",
        "LA": "LAO_PEOPLE_DEMOCRATIC_REPUBLIC",
        "LV": "LATVIA",
        "LB": "LEBANON",
        "LS": "LESOTHO",
        "LR": "LIBERIA",
        "LY": "LIBYA",
        "LI": "LIECHTENSTEIN",
        "LT": "LITHUANIA",
        "LU": "LUXEMBOURG",
        "MO": "MACAO",
        "MK": "MACEDONIA_THE_FORMER_YUGOSLAV_REPUBLIC_OF",
        "MG": "MADAGASCAR",
        "MW": "MALAWI",
        "MY": "MALAYSIA",
        "MV": "MALDIVES",
        "ML": "MALI",
        "MT": "MALTA",
        "MH": "MARSHALL_ISLANDS",
        "MQ": "MARTINIQUE",
        "MR": "MAURITANIA",
        "MU": "MAURITIUS",
        "YT": "MAYOTTE",
        "MX": "MEXICO",
        "FM": "MICRONESIA_FEDERATED_STATES_OF",
        "MD": "MOLDOVA_REPUBLIC_OF",
        "MC": "MONACO",
        "MN": "MONGOLIA",
        "ME": "MONTENEGRO",
        "MS": "MONTSERRAT",
        "MA": "MOROCCO",
        "MZ": "MOZAMBIQUE",
        "MM": "MYANMAR",
        "NA": "NAMIBIA",
        "NR": "NAURU",
        "NP": "NEPAL",
        "NL": "NETHERLANDS",
        "NC": "NEW_CALEDONIA",
        "NZ": "NEW_ZEALAND",
        "NI": "NICARAGUA",
        "NE": "NIGER",
        "NG": "NIGERIA",
        "NU": "NIUE",
        "NF": "NORFOLK_ISLAND",
        "MP": "NORTHERN_MARIANA_ISLANDS",
        "NO": "NORWAY",
        "OM": "OMAN",
        "PK": "PAKISTAN",
        "PW": "PALAU",
        "PS": "PALESTINE_STATE_OF",
        "PA": "PANAMA",
        "PG": "PAPUA_NEW_GUINEA",
        "PY": "PARAGUAY",
        "PE": "PERU",
        "PH": "PHILIPPINES",
        "PN": "PITCAIRN",
        "PL": "POLAND",
        "PT": "PORTUGAL",
        "PR": "PUERTO_RICO",
        "QA": "QATAR",
        "RE": "REUNION",
        "RO": "ROMANIA",
        "RU": "RUSSIAN_FEDERATION",
        "RW": "RWANDA",
        "BL": "SAINT_BARTHELEMY",
        "SH": "SAINT_HELENA_ASCENSION_AND_TRISTAN_DA_CUNHA",
        "KN": "SAINT_KITTS_AND_NEVIS",
        "LC": "SAINT_LUCIA",
        "MF": "SAINT_MARTIN",
        "PM": "SAINT_PIERRE_AND_MIQUELON",
        "VC": "SAINT_VINCENT_AND_THE_GRENADINES",
        "WS": "SAMOA",
        "SM": "SAN_MARINO",
        "ST": "SAO_TOME_AND_PRINCIPE",
        "SA": "SAUDI_ARABIA",
        "SN": "SENEGAL",
        "RS": "SERBIA",
        "SC": "SEYCHELLES",
        "SL": "SIERRA_LEONE",
        "SG": "SINGAPORE",
        "SX": "SINT_MAARTEN",
        "SK": "SLOVAKIA",
        "SI": "SLOVENIA",
        "SB": "SOLOMON_ISLANDS",
        "SO": "SOMALIA",
        "ZA": "SOUTH_AFRICA",
        "GS": "SOUTH_GEORGIA_AND_THE_SOUTH_SANDWICH_ISLANDS",
        "SS": "SOUTH_SUDAN",
        "ES": "SPAIN",
        "LK": "SRI_LANKA",
        "SD": "SUDAN",
        "SR": "SURINAME",
        "SJ": "SVALBARD_AND_JAN_MAYEN",
        "SZ": "SWAZILAND",
        "SE": "SWEDEN",
        "CH": "SWITZERLAND",
        "SY": "SYRIAN_ARAB_REPUBLIC",
        "TW": "TAIWAN_PROVINCE_OF_CHINA",
        "TJ": "TAJIKISTAN",
        "TZ": "TANZANIA_UNITED_REPUBLIC_OF",
        "TH": "THAILAND",
        "TL": "TIMOR-LESTE",
        "TG": "TOGO",
        "TK": "TOKELAU",
        "TO": "TONGA",
        "TT": "TRINIDAD_AND_TOBAGO",
        "TN": "TUNISIA",
        "TR": "TURKEY",
        "TM": "TURKMENISTAN",
        "TC": "TURKS_AND_CAICOS_ISLANDS",
        "TV": "TUVALU",
        "UG": "UGANDA",
        "UA": "UKRAINE",
        "AE": "UNITED_ARAB_EMIRATES",
        "GB": "UNITED_KINGDOM",
        "US": "UNITED_STATES",
        "UM": "UNITED_STATES_MINOR_OUTLYING_ISLANDS",
        "UY": "URUGUAY",
        "UZ": "UZBEKISTAN",
        "VU": "VANUATU",
        "VE": "VENEZUELA_BOLIVARIAN_REPUBLIC_OF",
        "VN": "VIET_NAM",
        "VG": "VIRGIN_ISLANDS_BRITISH",
        "VI": "VIRGIN_ISLANDS_US",
        "WF": "WALLIS_AND_FUTUNA",
        "EH": "WESTERN_SAHARA",
        "YE": "YEMEN",
        "ZM": "ZAMBIA",
        "ZW": "ZIMBABWE",
        "OT": "OTHER"
    };
var SALUTATIONS ={};

$(document).ready(function() {
    // needs to be in document.ready because we need access to translations
    LANGUAGE = translations[user_language];

    SALUTATIONS = {
        "Mr.": LANGUAGE["MR"],
        "Ms.": LANGUAGE["MS"],
        "Mrs.": LANGUAGE["MRS"],
        "Dr.": LANGUAGE["DR"],
        "Prof.": LANGUAGE["PROF"]
    };

    // translates country names
    for (var code in COUNTRIES) {
        var full_name = COUNTRIES[code];
        COUNTRIES[code] = LANGUAGE[full_name];
    }
});
// ZCTemplate.start_debug();
//NOTE(Dustin): This determines the order in which templates load so if you want it to load sooner, put it at the top!
function loadTemplates() {
    ZCTemplate.load([
        'device-alerts',
        'map-popup',
        'dashboard_map',
        'dashboard_list',
        'dashboard_detail',
        'success',
        'feedback',
        'device-subscription',
        'unauthorized',
        'flash-notification',
        'new-organization',
        'edit-my-account',
        'notifications-modal-template',
        'edit-device',
        'edit-location',
        'edit-measurement-configuration',
        'edit-communication-settings',
        'edit-site',
        'invite-user',
        'remove-user',
        'edit-invites',
        'no-chart-data',
        'manage-devices-content',
        'delete-plot-section',
        'delete-farm-site',
        'delete-section-list',
        'unsubscribe-device',
        'download-data-options',
        '/media/img/watchface2.2.svg',
        'permission_change',
        'add-new-calibration',
        'edit-measurement-units',
        'edit-calibration',
        'delete-calibration',
        'edit-billing',
        'edit-scientific-model',
        'edit-report',
        'remove-scientific-model',
        'edit-scientific-model-parameters',
        'delete-report',
        'edit-custom-chart',
        'delete-custom-chart',
        'edit-custom-chart-options',
        'dashboard_report',
        'edit-section',
        'device_inventory',
        'manage_devices'
        ])
}


var update_pending_invites = (function(){

    $.ajax({
        url: 'api/1.0/invites/',
        type: 'get',
        contentType: 'application/json',
    })
    .success(function(results) {
        //set the count of pending invites
        if(results.items.length != 0) {
            LocalStorage.set('pending_invites.count', $(".invite-count").html(results.items.length));
        }
        else{
            LocalStorage.set('pending_invites.count', $(".invite-count").remove());
        }
    });

    //store seen invite/s that are still pending.
    from_email_list = [];

    $('#from-user').each(function(){
        var from_email = $(this).html();
        var pending_invites = LocalStorage.get('pending_invites.seen', {});

        from_email_list.push(from_email);

        //if from email not in pending invites storage, add it.
        if(!(from_email in pending_invites)){
            pending_invites[from_email] = true;
        }
        LocalStorage.set('pending_invites.seen', pending_invites);
    });

    //check previous pending invite list to see if it no longer is pending
    var pending_invs = LocalStorage.get('pending_invites.seen', {});

    for(var invite in pending_invs){

        if(!(from_email_list.indexOf(invite) > 0)){
            localStorage.removeItem(invite);
        }
    }

    //set the count of pending invites
    //LocalStorage.set('pending_invites.count', $(".invite-count").html());

    //apply grey color
    $(".badge.invite-count").css("background-color", "#777");

});

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

var UserSettingsMenuController = (function() {
    // NOTE(brett): Initialize the user menu
    var $user_settings_item        = $("#user-settings-menu-my-settings");
    var $measurement_settings_item = $("#user-settings-menu-measurement-settings");
    var $season_pass_item              = $("#user-settings-menu-season-passes");
    var $invite_item               = $("#user-settings-menu-invites");
    var $logout_item               = $("#user-settings-menu-logout");

    var template = ZCTemplate.get('edit-my-account');



    /**
     * Callback for the edit account modal show event
     */
    function edit_account_show($modal) {
        options = SALUTATIONS;
        this.salutation_dropdown = new ZCDropdown.dropdown(options, LANGUAGE["SALUTATION"], {required: false});
        this.country_dropdown = new ZCDropdown.dropdown(COUNTRIES, LANGUAGE["COUNTRY_LABEL"], {required: false});
        this.language_dropdown = new ZCDropdown.dropdown(LANGUAGES, LANGUAGE["LANGUAGES"], {required: false});
        this.salutation_dropdown.parent($modal.find('#salutation-dropdown-parent'));
        this.country_dropdown.parent($modal.find('#country-dropdown-parent'));
        this.language_dropdown.parent($modal.find('#language-dropdown-parent'));

        var self = this;

        user_id = JSON.parse($.cookie('user'))['id'];
        $.ajax('/api/1.0/user/' + user_id + '/')
        .success(function(result) {
            user_info = result.items[0];
            
            self.salutation_dropdown.value("'"+user_info.contactinfo.salutation+"'");
            self.country_dropdown.value(user_info.contactinfo.country);
            self.language_dropdown.value(user_info.contactinfo.language);

            $modal.find("#firstname-textbox").val(user_info.contactinfo.firstname);
            $modal.find("#secondname-textbox").val(user_info.contactinfo.secondname);
            $modal.find("#email-textbox").val(user_info.email);
            $modal.find("#company-textbox").val(user_info.contactinfo.company);
            $modal.find("#street1-textbox").val(user_info.contactinfo.street1);
            $modal.find("#street2-textbox").val(user_info.contactinfo.street2);
            $modal.find("#state-textbox").val(user_info.contactinfo.state);
            $modal.find("#city-textbox").val(user_info.contactinfo.city);
            $modal.find("#zip-textbox").val(user_info.contactinfo.zip);
            $modal.find("#phone-textbox").val(user_info.contactinfo.phone);
            $modal.find("#mobile-textbox").val(user_info.contactinfo.mobile);

        });
    }


    /**
     * Callback for the edit accoutn modal accept button ( rather accept event )
     */
    function edit_account_accept($modal) {

        ga('send', {hitType: 'event',
                    eventCategory: 'UI Interaction',
                    eventAction: 'click',
                    eventLabel: 'edit_account'
        });

        if ($("#form-my-account").valid()) {
            var user = JSON.parse($.cookie('user'));

            // NOTE(brett): Reduce(fn(sum, current, index, array)(), intial_value) to get a dictionary
            // of the elements {name: value, ...}
            var new_data = Array.prototype.reduce.call($modal.find('.form-control'), function (s, c, i, a) {
                var $el = $(c);
                s[$el.attr('name')] = $el.val();
                return s;
            }, {});

            var old_language = user_language;

            new_data.salutation = this.salutation_dropdown.value();
            new_data.country = this.country_dropdown.value();
            new_data.language = this.language_dropdown.value();
            if(new_data["email"] != $("#account-dropdown")){
                $("#account-dropdown").html(new_data["email"])
            }

            $.ajax({
                url: '/api/1.0/user/' + user.id + '/',
                type: 'post',
                contentType: 'application/json',
                'csrfmiddlewaretoken' : getCookie("csrftoken"),

                data: JSON.stringify(new_data)
            })
            .success(function (response) {
                if (response.success) {
                    // NOTE(brett): Reload the content to the newest data
                    var user = response["items"][0];

                    addSuccessFlash(LANGUAGE["SUCCESS_UPDATE_ACCOUNT_INFO"]);
                    if (user.language != user_language)
                    {
                        user_language = user.language;
                        localStorage.clear();
                        location.reload();
                        document.cookie["LANGUAGE_ID"] = new_data.language
                        $.cookie("LANGUAGE_ID", user_language);

                    }
                    //we want to update the user's information in manage_users tab if that is what is currently displayed
                    if (hasher.getHash() == 'manage_user') {
                        new_data.country = COUNTRIES[new_data.country]
                        manage_users.update_user_information(new_data);

                    }
                }
            });

            return true;
        }
        else {
            validator_my_account.focusInvalid();
            return false;
        }
    }


    function edit_measurement_show($modal){

        var user = JSON.parse($.cookie('user'));

        $.ajax({url: '/api/1.0/measurement_units/'+user.id+'/',
               type:'get',
               contentType: 'application/json'})
        .success(function(result){
            var measurement_array = result["items"];

            $modal.dropdowns = {}
            $('#measurement_unit_preferences').empty();
            var unit_parent = $modal.find("#measurement-unit").html(); // this is a script.
            // Basically just yields the contents of the script?
            var new_parent  = $modal.find("#new-measurement-unit").html();
            var $new_rendered = $(Mustache.render(new_parent, {label1 : LANGUAGE["MEASUREMENT_UNITS"]}));
            $('#measurement_unit_preferences').append($new_rendered);

            measurement_array.forEach(function(item, i, a) {
                var c = 0;
                var group = item.group;
                var $rendered = $(Mustache.render(unit_parent, {label: group}));

                var data = item.options.reduce(function (s, e) {
                    // populates the dropdown
                    s[c++] = e;
                    return s;
                }, {});

                $('#measurement_unit_preferences').append($rendered);

                $modal.dropdowns[item.group] = new ZCDropdown.dropdown(data);
                $modal.dropdowns[item.group].group = item.group;
                // plugs the dropdown into the correct div
                $modal.dropdowns[item.group].parent($rendered.find('.measurement-unit-parent-parent'));
                $modal.dropdowns[item.group].value(item.value);

            });


        });
    }


    function edit_measurement_accept($modal){

        ga('send', {hitType: 'event',
                    eventCategory: 'UI Interaction',
                    eventAction: 'click',
                    eventLabel: 'edit_measurements'
        });

         var user = JSON.parse($.cookie('user'));
         //post the correct units for the user to the back end
         var measurement = {};

        Object.keys($modal.dropdowns).forEach(function(e, i, a) {
            measurement[e] = $modal.dropdowns[e].value();


        });

        //  $modal.find(".measure_units .dropdown .btn-label").each(function(i, elem) {
        //      var default_id = $(this).parent().parent().parent().data("id");
        //      var default_value = $(this).attr("data-value");
        //      //var default_id = $(this).attr("data-id");

        //      measurement[default_id] = parseInt(default_value);
        //  });


         //check if any became active and replace
         $modal.find("#measurement_unit_preferences .dropdown ul.dropdown-menu>li>a.active").each(function (i, elem) {
             var id = $(this).parent().parent().parent().parent().data("id");
             var value = $(this).attr("data-value");

             for(var key in measurement){
                 if(key == id) {
                     measurement[key] = parseInt(value);
                 }
             }
         });

         $.ajax({
             url: '/api/1.0/measurement_units/' + user.id + '/',
             type: 'post',
             contentType: 'application/json',
             data: JSON.stringify(measurement)
         })

         .success(function(response){

             location.reload();

             // NOTE (Ethan): Probably leave this out because we reload the page:
             // addSuccessFlash("Successfully updated measurement units.");
         });

         return true;
    }

    /**********************************************
    API
    **********************************************/

    function initialize() {

        $user_settings_item.off('click').on('click', function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            ga('send', {hitType: 'event',
                        eventCategory: 'UI Interaction',
                        eventAction: 'click',
                        eventLabel: 'my_settings'
            });
            var account_template = ZCTemplate.get('edit-my-account');
            var json               = LANGUAGE;
            var new_model_metadata = $.extend(true, json, model_metadata);
            var rendered = Mustache.render(account_template, new_model_metadata);
            var edit_account_modal = new ZCModal.modal('<h4 class="modal-title">'+LANGUAGE["UPDATE_ACCOUNT_INFORMATION"]+'</h4>', rendered, LANGUAGE["ACCEPT"], false, LANGUAGE["CANCEL"]);

            edit_account_modal.on('show', edit_account_show);
            edit_account_modal.show();

            // NOTE (Ethan): Add validation rules to the User Settings modal form
            validator_my_account = $("#form-my-account").validate({
                errorClass    : "validation_fail",
                validClass    : "validation_check",
                errorPlacement: function (error, element) {
                },
                highlight     : function (element, errorClass, validClass) {
                    $(element).closest("div").addClass(errorClass).removeClass(validClass);
                },
                unhighlight   : function (element, errorClass, validClass) {
                    $(element).closest("div").addClass(validClass).removeClass(errorClass);
                },
                ignore        : ".ignore"
            });

            edit_account_modal.on('accept', edit_account_accept);

            // NOTE (Ethan): Maybe one day we'll want to add phone number validation.
            // But right now the regex isn't working

            // $.validator.addMethod("regex", function(value, element, regexp) {
            //     var re = new RegExp(regexp);
            //     return this.optional(element) || re.test(value);
            // }, "Please check your input.");
            //
            // $("#phone-textbox, #mobile-textbox").rules("add", {
            //     regex: "[0-9\-\(\)\s\.\+]+"
            // });
        });

        $measurement_settings_item.off('click').on("click", function(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            ga('send', {hitType: 'event',
                        eventCategory: 'UI Interaction',
                        eventAction: 'click',
                        eventLabel: 'measurement_settings'
            });
            // note(mark) - this code was not used so I commented it out
            // var account_template = ZCTemplate.get('edit-measurement-units');
            // var rendered = Mustache.render(account_template, model_metadata);
            var template = ZCTemplate.get('edit-measurement-units');
            var edit_measurement_modal = new ZCModal.modal("<h4 class='modal-title'>"+LANGUAGE["EDIT_MEASUREMENT_UNITS"]+"</h4>", template, LANGUAGE["ACCEPT"], false, LANGUAGE["CANCEL"]);


            edit_measurement_modal.on('show', edit_measurement_show);
            edit_measurement_modal.show();

            edit_measurement_modal.on('accept', edit_measurement_accept);

        });

        $season_pass_item.off('click').on("click", function(evt) {
            // show here
            evt.stopPropagation();
            evt.preventDefault();
            ga('send', {hitType: 'event',
                eventCategory: 'UI Interaction',
                eventAction: 'click',
                eventLabel: 'subscriptions'
            });
            showSeasonPassModal();
        });

        $logout_item.off('click').on('click', function(evt) {

            ga('send', {hitType: 'event',
                        eventCategory: 'UI Interaction',
                        eventAction: 'click',
                        eventLabel: 'logout'
            });

            $.removeCookie('sessionid');
            $.removeCookie('user');
            $.removeCookie('token');
        });
    }

    return {
        init: initialize
    }

}());


 /**
     * Handles the ui changes when an item is accepted or declined in the invites modal
     *
     * note that the instance of 'this' will be the button pressed as a direct callback
     */
     function decline_accept_invite(button) {

        ga('send', {hitType: 'event',
                    eventCategory: 'UI Interaction',
                    eventAction: 'click',
                    eventLabel: 'decline_invite'
        });

        $current_row      = $(button).closest('.row.data-row');
        var id            = $current_row.data('id');
        var key           = $current_row.data('key');
        var invite_action = null;

        // NOTE(brett): There is something wrong with the HTML if the button does not have one
        // of the classes specified
        if ( $(button).hasClass('button-accept') ) {
            var invite_action = 'accept';
        }
        else if ( $(button).hasClass('button-decline') ) {
            var invite_action = 'decline';
        }

        var post_data = {
            "action": invite_action,
            "key": key,
            "id": id
        };

        $.ajax({
            url: 'api/1.0/invites/'+id+'/',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(post_data)
        })
        .success(function(response) {
            if (response.success) {
                $current_row.animate({height: '0px'}, 250, 'swing', function(){
                    $current_row.remove();
                });
                if (response["message"] == LANGUAGE["INVITATION_NO_LONGER_VALID"]){
                    addErrorFlash(response["message"]);
                }
                else {
                    action = invite_action == 'accept' ? 'accepted' : 'declined';
                    var temp_string = 'SUCCESS_'+action.toUpperCase()+'_INVITATION'
                    var translated_title = LANGUAGE[temp_string]
                    addSuccessFlash(translated_title);
                    if ( invite_action == 'accept' ) {
                        var id = response.items[0].customersite_id;
                        switchOrg(id);
                        hasher.setHash( 'dashboard_map' );
                    }
                }
            }
        });
        update_pending_invites();
     }


function showInviteModal() {
            // evt.stopPropagation();
            // evt.preventDefault();

            ga('send', {hitType: 'event',
                        eventCategory: 'UI Interaction',
                        eventAction: 'click',
                        eventLabel: 'check_invites'
            });

            var invites_template = ZCTemplate.get('edit-invites');
            var json = LANGUAGE;
            var new_model_metadata = $.extend(true, json, model_metadata)
            var rendered = Mustache.render(invites_template, new_model_metadata);


            // NOTE(brett): This could cause problems down the road making the user wait for the
            // modal to show up a better solution woudl be to show the modal first and let the
            // data roll in after
            $.ajax({
                url: 'api/1.0/invites/',
                type: 'get',
                contentType: 'application/json',
            })
            .success(function(results) {

                var results = results["items"];
                var row_template = $(invites_template).find('#invite-row-template').html();

                var $invites_template = $(invites_template);

                $invites_template.find("#template-adding").empty();

                $template_adding = $invites_template.find("#template-adding");
                create_invite_row(results, row_template, $template_adding);

                var edit_invites_modal = new ZCModal.modal('<h4 class="modal-title">'+LANGUAGE["INVITATIONS"]+'</h4>',
                                                           rendered,
                                                           LANGUAGE["OK"],
                                                           false, LANGUAGE["CANCEL"]);




                     edit_invites_modal.on('show', refresh_invite);
                    edit_invites_modal.on('accept', invites_accept);



                edit_invites_modal.show();
                $("#button_refresh").click(function(){
                refresh_invite();
                 });
                //if user doesn't hit accept button, make sure we still account for user seeing their pending invites.
                update_pending_invites();

            });
                /**
     * Callback for the invites modal show event
     */
    function invites_show($modal) {

        $modal.find('.button-refresh')
        .off('click', refresh_invite)
        .on('click',refresh_invite)


}
    /**
     * Callback for the invites modal accept event
     */
    function invites_accept($modal) {

        ga('send', {hitType: 'event',
                    eventCategory: 'UI Interaction',
                    eventAction: 'click',
                    eventLabel: 'accept_invite'
        });

        update_pending_invites();
        return true;
    }




     function refresh_invite(evt) {
         ga('send', {hitType: 'event',
                    eventCategory: 'UI Interaction',
                    eventAction: 'click',
         });

         $.ajax({
                url: 'api/1.0/invites/',
                type: 'get',
                contentType: 'application/json',
         })
             .success(function(results) {

                 var old_ids = $('.row.data-row')
                 var results = results["items"];
                 amount_past_invites = $('.row.data-row').length;
                 amount_currenct_invites = results.length;
                 var flag_to_refresh = true;
                 var id_is_missing = false;
                 var new_id_list = [];

                 for (var i=0 ; i < amount_currenct_invites; i++){
                     new_id_list.push(results[i.toString()]["id"].toString())
                 }
                 if (amount_past_invites == amount_currenct_invites){
                     $.each(old_ids, function( i, val ) {
                         var old_id = $(val).attr("data-id")
                         if (new_id_list.indexOf(old_id.toString()) > -1){
                             flag_to_refresh = false;
                         }
                         else {
                                id_is_missing = true;
                         }
                 });
                 }
                 if ( flag_to_refresh || id_is_missing) {
                     var row_template = $(invites_template).find('#invite-row-template').html();
                     $("#template-adding").empty()
                     create_invite_row(results, row_template, "#template-adding")
                     flag_to_refresh = false;
                 }
             });

        update_pending_invites();
     }
     function create_invite_row(_results, _row_template, template_adding){
         _results.forEach(function (e, i, a) {
             if (e.is_owner) {
                 e.permissions = "Owner";
             }
             else if (e.is_admin) {
                 e.permissions = "Administrator";
             }
             else {
                 e.permissions = "User";
             }

             e.role = ROLES[e.role];

             var row = Mustache.render(_row_template, e);
             $(template_adding).append(row);
         });
     }

}

function showSeasonPassModal(page, org_id, voucher_code){
    if (page==null){
        // later, we can add the functionality to go to either the
        //   voucher or the buy sub-pages
        page = 'home';
    }

    function build_empty_modal(){

        var template_string = ZCTemplate.get('edit-billing');

        var subscription_modal = new ZCModal.modal(
            '<h4 id="season-pass-modal-header" class="modal-title"><h4>',
            template_string, "Next", null, 'Exit', false, {backdrop_close:false});

        subscription_modal.show();
        // subscription_modal.on('cancel', null);
        // subscription_modal.on('accept', null);

        return subscription_modal;
    }

    var subscription_modal = build_empty_modal();

    // lives in the billing JS file 'edit-billing.js'
    populate_season_pass_modal(subscription_modal, page, org_id, voucher_code);
}

var organization_dropdown = null;

function buildOrgDropdown() {
    var $dropdown_parent = $("#org-dropdown");
    var active_org       = $dropdown_parent.data("id");
    $.ajax({
        type: "GET",
        url: "/api/1.0/customersite/",
        success: function(response) {
            var orgs = response.items;
            var org_dict = {};

            for (var i = 0; i < orgs.length; i++) {
                var org             = orgs[i];
                org_dict[org["id"]] = org["name"];
            }

            if ( ! organization_dropdown )
                organization_dropdown = new ZCDropdown.dropdown(
                    org_dict,
                    LANGUAGE["SELECT_AN_OPTION"],
                    options={sort_by_text:true});

            organization_dropdown.value(active_org);
            organization_dropdown.parent($dropdown_parent);
            if (orgs.length > 5) {
                buildOrgSearchBar();
            }

            var $zcd_parent = $(
                "#zc-dropdown-" + organization_dropdown.id() + "-parent");

            $zcd_parent.find("button").addClass("btn-organizationdropdown");
            $zcd_parent.find("ul").append(
                '<li role="presentation">' +
                    '<a role="menuitem" class="addOrganizationButton" ' +
                        'onClick="showNewOrganizationModal()">'+
                        LANGUAGE["ADD_NEW_ORG"]+
                '</a></li>');

            organization_data = orgs.reduce(function(s, e) { s[e.id] = e; return s; }, {});

            $zcd_parent.find("li").each(function() {
                if (!$(this).find("a").hasClass("addOrganizationButton")) {
                    var $dropdown_element = $(this).find("a");
                    var org_name          = $dropdown_element.text();
                    var org_pk            = $dropdown_element.data("value");
                    if (org_pk) {
                        $dropdown_element.addClass("dropdown-edit-label");
                        $dropdown_element.attr("onclick", "switchOrg('" + org_pk + "');");

                        if (organization_data[org_pk].user_is_owner) {
                            var $link = $('<a />', {
                                class: 'editOrganization glyphicon glyphicon-pencil col-md-2 dropdown-edit-icon',
                                'data-toggle': 'modal',
                                'data-name': org_pk,
                                'data-target': '.addOrganization'
                            })
                                .on('click.pencil-edit', function () {
                                    editOrganization(org_pk);

                                    ga('send', {
                                        hitType: 'event',
                                        eventCategory: 'UI Interaction',
                                        eventAction: 'click',
                                        eventLabel: 'edit_organization'
                                    });
                                });

                            var $edit_button = $('<span />', {}).append($link);
                            $(this).append($edit_button);

                        } else {

                            var $link = $('<a />', {
                                class: 'editOrganization glyphicon glyphicon-pencil col-md-2 dropdown-edit-icon link-disabled',
                                'data-toggle': 'modal',
                                'data-name': org_pk,
                                'data-target': '.addOrganization'
                            })

                            var $edit_button = $('<span />', {}).append($link);
                            $(this).append($edit_button);

                        }
                    }
                }
            });
        }
    })
}

var searchbar_options = null;
function buildOrgSearchBar(){
    var $dropdown_parent = $("#org-dropdown");
    $.ajax({
        type: "GET",
        url: "/api/1.0/customersite_search_bar/",
        success: function(response){

            let data = response.items;
            searchbar_options = data;
            let names = Object.keys(data.site_ids_by_name);
            let device_names = Object.keys(data.site_ids_by_device_name);
            let sns = Object.keys(data.site_ids_by_sn);
            let autocomplete_options = names.concat(device_names).concat(sns);
            // Many devices have name == sn, so only show it once
            let unique_options = Array.from(new Set(autocomplete_options));
            let searchbar_template = $("#search-bar").html();

            let searchbar = Mustache.render(searchbar_template, {'show_search':true});
            $dropdown_parent.find(".dropdown-menu").prepend(searchbar);
            let text = $("#org-search-input");
            text.autocomplete({
                source:unique_options
            });
            text.on("autocompleteselect", function (event, ui) {
                window.event.stopPropagation();
            });
            $("#org-search-submit").on('click', orgSearchClick);
        }
    });
}


function getOrgVariables() {
    $.ajax({
        type: "GET",
        url: "/api/1.0/organization_roles/",
        success: function(data) {
            ROLES = data["items"][0];
            ROLES_ORDER = data["order"];
        },
        async: false
    });

    $.ajax({
        type: "GET",
        url: "/api/1.0/organization_permissions/",
        success: function(data) {
            PERMISSIONS = data["items"][0];
        },
        async: false
    });

    // (note: Drew) comment out until org alerts are reworked
    // $.ajax({
    //     type: "GET",
    //     url: "/api/1.0/organization_subs/",
    //     success: function(data) {
    //         SUBSCRIPTIONS = data["items"][0];
    //     },
    //     async: false
    // });
}


var deviceTreeHighlights = {
    "site": function(item) {
        $(".treeItem").removeClass("active");
        $(item).addClass("active");
    },
    "plot": function(item) {
        $(".treeItem").removeClass("active");
        $(item).addClass("active");
        $(item).parent().prevAll(".site:first").addClass("active");
    },
    "logger": function(item) {
        $(".treeItem").removeClass("active");
        $(item).addClass("active");
        $(item).parent().prevAll(".plot:first").addClass("active");
        $(item).parent().prevAll(".plot:first").parent().prevAll(".site:first").addClass("active");
    }
}

function setMap(){
    if (typeof L === 'undefined') {
        // Return if map hasn't been loaded. Helpful for local development.
        return;
    }
    // if no customersite no need to load the map because they will land on a welcome page
    var customersite = $.cookie('customersite');
    if (customersite != "None") {
        //get last active device coordinates if available.
        //Washington State coordinates -- NOTE(BRI) initial load, may want to detect user's initial coordinates
        var last_active_device_coord = JSON.parse(sessionStorage.getItem('map.map_state'));

        if (last_active_device_coord) {
            var lat = parseInt(last_active_device_coord["coords"][0]);
            var longitude = parseInt(last_active_device_coord["coords"][1]);
            var zoom = 7;

        }
        else {
            var lat = 46.751525;
            var longitude = -117.166636;
            var zoom = 7;

        }

        //set up map and leave it up.
         L.mapbox.accessToken = "pk.eyJ1Ijoia2Vuc3J1ZCIsImEiOiI5ZGE3Yzg1MWViOGE5MTU5ZDk3YmU0MzU2YmQ0MjAxNiJ9.fYCk-YENYah_fjiMh0TvZg";

        if (!map){
            map = L.mapbox.map($("#map")[0], "mapbox.streets-satellite", {
                maxZoom: 19,
                zoomControl: false
            }).setView([lat, longitude], 7);
        }
        new L.Control.Zoom({position: "bottomright"}).addTo(map);
    }
}

function add_subdomain_to_title() {
    var host = window.location.host.split(".");
    var subdomain = host[0];

    if(subdomain != 'zentracloud' && subdomain != 'www') {
        document.title += ' - ' + subdomain.toUpperCase();
    }
}

$(document).ready(function(){
    ZCModal.init();
    ZCDropdown.init();
    UserSettingsMenuController.init();
    add_subdomain_to_title();

    ZCDropdown.init_promise().then(function(){
        buildOrgDropdown();
        loadTemplates();
    });

    if(window_width > 768){
        setMap();
    }

    //if user has not seen invites, set pill count to green.
    var invite_seen = LocalStorage.get('pending_invites.count');
    var invite_count = $(".invite-count").html();

    if (invite_count != invite_seen)
    {
        $(".badge.invite-count").css("background-color", "darkgreen")
    }
    else {
        //verify they are not new emails //get current pending invites, and check with local storage pending invites
        var current_emails = [];

        $.ajax({
            url: 'api/1.0/invites/',
            type: 'get',
            contentType: 'application/json'
        })
            .success(function (results) {

                var invites = results["items"];

                for (var i = 0; i < invites.length; i++) {
                    current_emails.push(invites[i]["email"])
                }
            });

        var invite_list_seen = LocalStorage.get('pending_invites.seen', {});

        for(var email in current_emails){
            if(!(email in invite_list_seen))
            {
                $(".badge.invite-count").css("background-color", "darkgreen")
            }
        }
    }


    // Bind a listener to the feedback button
    $("#feedback-btn").on("click", function(e) {
        var modal = setUpFeedbackModal();

        modal.on("dismiss", ()=>{
            // add user input to cache so we can repopulate it when they reopen the feedback modal
            let devices = $('#feedback-dev-dropdown').children("div").children("ul").children("input");
            var checked_devices = [];
            for (var i = 0; i < devices.length; i++) {
                if (devices[i].checked === true) {
                    checked_devices.push(devices[i].value);
                }
            }

            const current_feedback = {
                subject: $('#feedback-subject').val(),
                message: $('#feedback-message').val(),
                topic: $('#feedback-topic-dropdown').children("div").children("button").text().trim(),
                devices: checked_devices,
            };

            window.localStorage.setItem('cached_feedback', JSON.stringify(current_feedback));
        });

        modal.on("cancel", (m)=>{
            window.localStorage.removeItem('cached_feedback');
            return true;
        });

        ga('send', {hitType: 'event',
            eventCategory: 'UI Interaction',
            eventAction: 'click',
            eventLabel: 'feedback'
        });

        e.preventDefault();
        modal.show();

        validator_feedback = $("#form-feedback").validate({
            errorClass    : "validation_fail",
            validClass    : "validation_check",
            errorPlacement: function(error, element) {},
            highlight     : function(element, errorClass, validClass) {
                $(element).closest("div").addClass(errorClass).removeClass(validClass);
            },
            unhighlight   : function(element, errorClass, validClass) {
                $(element).closest("div").addClass(validClass).removeClass(errorClass);
            },
            ignore        : ".ignore"
        });
    });


    /*
    *   Check main menu overflow and make a burger menu
    */
    $(window).resize();

    getOrgVariables();

    var customersite = $.cookie("customersite")
    if (customersite != "None") {

        checkDeviceTreeAlerts();

        $('.panel-collapse').on('shown.bs.collapse', function(){
            var active = $(this).attr('id');
            set_panel_state(active);

        })
        .on('hidden.bs.collapse', function(){
            var panel_state = LocalStorage.get('deviceTree.collapse_state', {});
            var active = $(this).attr('id');
            delete panel_state[active];
            LocalStorage.set('deviceTree.collapse_state', panel_state);
        });

        /* Check previous UI panel settings */
        check_panel_state();

        var selected_device = LocalStorage.get('deviceTree.active_device', {});

        for ( var device in selected_device ) {
            var $element = $(document).find(".treeItem.logger[data-id=\""+device+"\"]");
            deviceTreeHighlights["logger"]($element);
        }

        $(".deviceTree > .site-group > .site").off('click').on('click', function(evt) {
            deviceTreeHighlights["site"](this);
        });

        $(".deviceTree > .site-group > .plot-group > .row > .plot").off('click').on('click', function(evt) {
            deviceTreeHighlights["plot"](this);
        });

        $('.deviceTree > .site-group > .plot-group > .panel-collapse > .treeItem.logger').off('click.highlight').on('click.highlight', function() {
            deviceTreeHighlights["logger"](this);
            var active_device       = $(this).attr('data-id');
            set_active_device(active_device);

        });
        $('.device-tree-badge').off('click').on('click', function(evt) {

            var active_device       = $(this).parent().attr('data-id');
            var active_name         = $(this).parent().attr('data-name');
            set_active_device(active_device);

            data = {"device":active_device, "name":active_name};
            //get warning modal pop up
            showAlertModal(data)

        });
    }
    else{
        // note(mark) - this is to get it to the welcome hash when there is no customersite
        hasher.setHash( 'welcome' );
    }

    let voucher_code = localStorage.getItem('redirect_to_voucher');
    if (voucher_code == null){
        voucher_code = getUrlParameter('code');
    }
    if (voucher_code != null){
        localStorage.removeItem('redirect_to_voucher');
        showSeasonPassModal('voucher', undefined, voucher_code);
    }
});

function check_panel_state(){

    var panel_state = LocalStorage.get('deviceTree.collapse_state', {});
    for ( var panel in panel_state ) {
        if ( $('#'+panel).hasClass('panel-collapse') ) {
            $('#'+panel).collapse('show');
            $('#'+panel).addClass('in');
        }
        else{
            $('#'+panel).removeClass('in');
        }
    }

}


function set_panel_state(panel){

    var panel_state = LocalStorage.get('deviceTree.collapse_state', {});
    panel_state[panel] = true;
    LocalStorage.set('deviceTree.collapse_state', panel_state);
}


function set_active_device(active_device) {

    var device_state = LocalStorage.get('deviceTree.active_device', {});
    //only need current active device to be in localstorage device_state
    for (var device in device_state) {
        if (active_device != device) {
            delete device_state[device]
        }
    }

    device_state[active_device] = true;
    LocalStorage.set('deviceTree.active_device', device_state);
}


/*
*
*   BASIC ROUTING / Lazy-Loading pages
*   the following chunk of code is for demo purposes only.
*   Not meant for productive use.
*
*/

var defaultHash = 'dashboard_map';
crossroads.addRoute('{page}', function(page){
    if ($.cookie('customersite') != 'None'){
        showPage(page)
    }
});



/*
*   Bind listeners to all menu items
*/
nav_enabled = true;
function enable_nav_buttons() {
    nav_enabled = true;
    $(".navItem").prop("disabled", false);
}

function disable_nav_buttons() {
    nav_enabled = false;
    $(".navItem").prop("disabled", true);
}


$(".navItem").off("click").on("click", function(e) {

    var page = $(this).attr("data-hash");

    var last_hash = hasher.getHash();

    if(nav_enabled) {

        e.preventDefault();
        crossroads.parse(page);
        hasher.setHash(page);
    }

    //only disable if previous page does not equal current page.
   if(last_hash!=page) {
        disable_nav_buttons();
   }

});


var orgs = {};
$(".listHolder .btn-organizationdropdown").each(function() {
    if ($(this).text() in orgs) {
        orgs[$(this).text()].push($(this));
    }
    else {
        orgs[$(this).text()] = [$(this)];
    }
});

for (var key in orgs) {
    if (orgs.hasOwnProperty(key)) {
        if (orgs[key].length > 1) {
            for (var i = 0; i < orgs[key].length; i++) {
                var $option = orgs[key][i];
                $option.text(key + " (" + $option.data("owner") + ")");
            }
        }
    }
}

// scroll to selected org when dropdown is open
$("#org-dropdown").on("shown.bs.dropdown", function() {
    $(".dropdown-edit-label.active")[0].scrollIntoView()
});

/*
*   Function can be triggered with inline code to dive deeper into hierarchies
*/
function subNav(event){
    var page = $(event).attr("data-hash");

    crossroads.parse( page );
    hasher.setHash( page );
}

/*
*   Function lazy-loads the passed page into the content area
*/
var current_page = null;
function showPage( page ){
    // add the active class to navItem
    var clickedNavItem = $(document).find(".navItem[data-hash=" + page + "]");
    clickedNavItem.parent().find(".navItem").removeClass("active");
    clickedNavItem.addClass("active");

    ga('send', {
        hitType: 'event',
        eventCategory: 'UI Interaction',
        eventAction: 'click',
        eventLabel: page
    });

    //we always want to have interactive map available, but only seen on dashboard map page to avoid re-rendering.
    var map_div = $(document).find("#interactive_map");
    if(page == "dashboard_map"){

       $(".content").empty();
       $(".content").append(map_div);

        //grab users last map settings if available and map has already been initialized
        var last_map_location = JSON.parse(sessionStorage.getItem('map.map_state'));
        if(last_map_location && map){
            var lat  = last_map_location["coords"]["lat"];
            var longitude = last_map_location["coords"]["lng"];
            var zoom = last_map_location["coords"]["zoom"];

            //set zoom to default if none detected.
            if(!zoom){
                zoom =7;
            }

            map.panTo([lat,longitude], zoom);
        }
    }
    else{
        //close pop-up to clear content div while switching to another tab.
        if ( map && map.closePopup ) {
            map.closePopup();
        }
        //save map set up to div.
        $("#map_storage").append(map_div)
    }

    function load_page() {
        if ( current_page ) {
            current_page.hide();
        }

        ZCPage.get_page( page ).success(function(page_controller){
            current_page = page_controller;
            current_page.show();
            //remove initial loading wheel
            var loader = $(".int-load")
                if (loader){
                    loader.hide()
                    // loader.remove()
            }
        });

        ga('send', {hitType: 'pageview', page:'/'+page});
    }

    // NOTE(brett): For now we need this so we dont try to use a template before it is loaded
    if ( ZCTemplate.is_loading() ) {

        ZCTemplate.done_loading(load_page)
    }
    else {
        load_page();
    }
}

/*
*   Function parses hashes
*/
function parseHash(newHash, oldHash){

    if(newHash === "" || newHash === " ") newHash = defaultHash;
    hasher.setHash(newHash);
    crossroads.parse(newHash);
}

hasher.initialized.add(parseHash); //parse initial hash
hasher.changed.add(parseHash); //parse hash changes
hasher.init(); //start listening for hash changes


/*
*
*   DATE PICKERS
*   the following chunk of code initializes date pickers.
*
*/

function initDatePickers(){
    $('.datepicker').datetimepicker({
        viewMode: 'days',
        format: 'DD MMM YYYY',
        icons: {
            previous: 'btn-chevron-prev',
            next: 'btn-chevron-next',
        }
    });

    $('.timepicker').datetimepicker({
        format: 'h:mm A',
        icons: {
            up: 'btn-chevron-up',
            down: 'btn-chevron-down',
        }
    });
}

/*
*
*   IMAGE CAROUSEL
*   the following chunk of code controls the image carousel.
*
*/
var nextPos = 0;
var nextImage = 0;
var imageWidth = 160;
var currentPos = 0;

$("body").on("mousedown", ".carouselPrevButton", function(){
    currentPos = $(".carousel").scrollLeft();
    nextImage = Math.ceil(currentPos / imageWidth) - 1
    nextPos = nextImage * imageWidth;
    $(".carousel").animate({scrollLeft: nextPos }, 300);
    carouselButtons();

})

$("body").on("mousedown", ".carouselNextButton", function(){
    currentPos = $(".carousel").scrollLeft();
    nextImage = Math.ceil(currentPos / imageWidth) + 1
    nextPos = nextImage * imageWidth;
    $(".carousel").animate({scrollLeft: nextPos }, 300);
    carouselButtons();
})


function carouselButtons(){
    var max = $('.carousel').prop('scrollWidth') - $('.carousel').innerWidth();
    var min = 0;

    if(nextPos >= max){
        $(".rightShadow").hide();
        $(".leftShadow").show();
        $(".carouselNextButton").hide()
        $(".carouselPrevButton").show();

    }else if(nextPos <= min){
        $(".leftShadow").hide();
        $(".rightShadow").show();
        $(".carouselNextButton").show()
        $(".carouselPrevButton").hide();

    }else{
        $(".rightShadow").show();
        $(".leftShadow").show();
        $(".carouselNextButton").show()
        $(".carouselPrevButton").show();
    }
}

document.addEventListener('scroll', function (event) {
    if( $(event.target).hasClass("carousel") ){
        nextPos = $(".carousel").scrollLeft();
        carouselButtons();
    }
}, true);


/*
*
*   Toggle popup content to successful message
*
*/

$('body').on('show.bs.modal','.inviteUser', function (event) {
    $(".modal-content").removeClass("success")
})


$("body").on("click", "#sendInvitation", function(){
    $(".inviteUser .modal-content").addClass("success")
})



/*
*
*   Toggle panels to edit mode
*
*/


// $("body").on("click", "#editPanel, #deletePanel, #cancelEdit, #savePanel" , function(){ toggleEditPanel() });

function toggleEditPanel(){
    // // toggle panels to edit mode
    // $(".panel").toggleClass("locked").toggleClass("active");
    // // show / hide buttons save, cancel, delete
    // $("#deletePanel").toggleClass("hide")
    // $("#cancelEdit").toggleClass("hide")
    // $("#savePanel").toggleClass("hide")
    // // hide / hide button edit
    // $("#editPanel").toggleClass("hide")
}

var time_dropdown_open = false;

$("#time_dropdown_button").on("click", function() {
    if (time_dropdown_open) {
        $("#time_dropdown").removeClass("open");
        time_dropdown_open = false;
    }
    else {
        $("#time_dropdown").addClass("open");
        time_dropdown_open = true;
    }
});

$(window).on("click", function() {
    if (time_dropdown_open) {
        $("#time_dropdown").removeClass("open");
        time_dropdown_open = false;
    }
});

$(window).resize(function() {
    var hiddenElements = getMenuOverflowItems();
    $( ".menuBar .menuItem" ).css("visibility", "visible")
    $( ".mobileMenu" ).empty();

    // find out if there are hidden elements
    if( hiddenElements ){
        $(".mobileMenuBurger").show();
        hiddenElements.css("visibility", "hidden")
        hiddenElements.clone(true).appendTo( ".mobileMenu" ).css("visibility", "visible");
    }else{
        $(".mobileMenuBurger").hide();
    }
});

/*
*
*   Open / Close overflow menu
*
*/


$("body").on("click", ".mobileMenuBurger, .mobileMenu", function(){
    $( ".mobileMenu" ).toggleClass("closed")
})


// function returns all elements which are wrapping into next line
// @param: class name of the elements that will wrap

function getMenuOverflowItems(){
    var screenWidth = $(window).width();
    var menuWidth = 380;
    var wrapped = false;
    var allWrapped = false;

    $('.menuBar .menuItem').each(function(index) {
        menuWidth += $(this).outerWidth( true );
        // The and case is added so that when there is only the welcome_feedback button we don't have to hide it.
        if((menuWidth > screenWidth) && (document.getElementById("welcome_feedback") !== $(this)[0])){
            wrapped = $(this);
            return false;
        }
    });

    // if there is at least one element wrapping, return all following as well
    if(wrapped){
        allWrapped = wrapped.nextAll( '.menuItem' ).andSelf()
    }
    return allWrapped;
}

//Subscribe to a device
function deviceSubscribe(section_value){

    ga('send', {
        hitType:       'event',
        eventCategory: 'UI Interaction',
        eventAction:   'click',
        eventLabel:    'device_subscription'
    });

    var deviceID       = $('#deviceSerialNumber').val();
    var devicePassword = $('#devicePassword').val();

    // ajax call to get subscribe to device
    var status;

    $.ajax(
        {
            type: "POST",
            url: "add_subscription/",
            data: {
                newLoggerID:       deviceID,
                newLoggerPassword: devicePassword,
                newLoggerSection:  section_value,
                customersite: $.cookie('customersite')
            },
            complete: function(response) {

                if (response.status == 200 || response.status == 201) {

                    //set the site and plot to the active panel
                    var selected_field = $("#subscription-field .btn-label").html();
                    var activate_panel = $(".plot-group[data-plot-name=\""+selected_field+"\"] > .panel-collapse").attr('id');

                    set_panel_state(activate_panel);
                    //check_panel_state();

                    var activate_device = response.responseJSON.did;
                    set_active_device(activate_device);

                    //update side panel with new device
                    var $plotgroup = $(".plot-group[data-plot-name=\""+selected_field+"\"] > .panel-collapse")

                    var $item = $('<div />', {
                        'aria-expanded': 'false',
                        'data-id': activate_device,
                        'data-sn': deviceID,
                        'class': 'treeItem logger'
                    });

                    $plotgroup.append($item);
                    $item.html(deviceID);

                    //make the new section/plot that has been created "active"
                    $item.on('click', function(){
                            var logger_id = $(this).data('id');
                            deviceTreeHighlights["logger"](this);

                            if(hasher.getHash() == 'manage_devices') {
                                manage_devices.update_view_with_selected_device(logger_id);
                            }
                    });

                    $item.click();
                    addSuccessFlash(LANGUAGE["SUCCESS_ADDED_DEVICE"]+": " + deviceID);
                    status = true;

                    //create pop-up for new device
                    page_name = $(".navItem.active").attr("data-hash");
                    if(page_name =="dashboard_map"){
                        fadeInPage()
                    }
                }
                else {
                    modalErrorFlash(response.responseText);
                    status =  false;
                }
            },
            async: false
        }
    );

    return status;
}

//Switch Org
function switchOrg(org_pk){

    ga('send', {hitType: 'event',
                    eventCategory: 'UI Interaction',
                    eventAction: 'click',
                    eventLabel: 'switch_organization'
    });
   $.ajax({
            type: "post",
            contentType: "application/json",
            url: "/api/1.0/switch_customersite/" + org_pk + "/",
            success: function(data){
                location.reload();
            }
        }
    );
}


function showAlertModal(active_data) {

    ga('send', {
        hitType: 'event',
        eventCategory: 'UI Interaction',
        eventAction: 'click',
        eventLabel: 'check_device_alerts'
    });

    const active_device_name  = active_data.name;
    const template = ZCTemplate.get('device-alerts');
    var MODAL_TITLE = '<h4 class="modal-title">Alerts for ' +active_device_name + '</h4>';
    var new_device_alerts_modal = new ZCModal.modal(MODAL_TITLE, template, translations[user_language]["OK"], false , translations[user_language]["CANCEL"]);

    // var dd_alert_types = null;
    // var dd_alert_time = null;
    //
    // var ALERT_TYPES = {};
    // var DATE_TIME_OPTIONS = {};

    // Create the ZCDropdowns
    // dd_alert_types = new ZCDropdown.dropdown(ALERT_TYPES, "Select an Alert Type");
    // dd_alert_time = new ZCDropdown.dropdown(DATE_TIME_OPTIONS, "Select a Time");

    //dd_alert_types.parent($("#dropdown-alert-type"));
    //dd_alert_time.parent($("#dropdown-alert-time"));


    new_device_alerts_modal.on('show', function ($new_device_alerts_modal) {
        var user = JSON.parse($.cookie('user'));
        var pk = $('.panelSideBar.active').attr("data-id");

        $.ajax({
            type: "get",
            url: "/api/1.0/active_alert/" + active_data.device + "/",
            success: function (alerts) {
                var alert_items = alerts["items"];
                var alert_strings = alerts["strings"];

                $('#all_active_alerts').empty();

                var row = $new_device_alerts_modal.find("#alert_string_list").html();

                for (var i = 0; i < alert_strings.length; i++) {

                    var alert_string_data = alert_strings[i];
                    var rendered = Mustache.render(row, alert_string_data);

                    $('#all_active_alerts').append(rendered)
                }
            }
        });
    })

    new_device_alerts_modal.on("accept", function () {
        return true;
    });

    new_device_alerts_modal.show();

}

var validator_organization = null;


// TODO (Ethan): MAKE THIS FUNCTION CALL WHEN YOU CLICK THE NEW ORGANIZATION BUTTON
function showNewOrganizationModal() {

    ga('send', {hitType: 'event',
        eventCategory: 'UI Interaction',
        eventAction: 'click',
        eventLabel: 'add_new_organization'
    });

    // Create a ZCModal
    if (user_language ==  null)
    {
        user_language= 0; //this is set default language and will be changed according to the location
    }
    var json = LANGUAGE;
    var new_model_metadata =  $.extend(true, json, model_metadata);
    var new_org_template = ZCTemplate.get("new-organization");
    var new_org_rendered = Mustache.render(new_org_template, new_model_metadata);
    var new_org_modal    = new ZCModal.modal("<h4 class='modal-title'>" + LANGUAGE["NEW_ORGANIZATION"] + "</h4>", new_org_rendered, LANGUAGE["ACCEPT"], false, LANGUAGE["CANCEL"]);
    var dd_org_role      = null;
    // (note: Drew) comment out until alerts are reworked
    // var dd_org_subs      = null;

    // Create the ZCDropdowns
    dd_org_role = new ZCDropdown.dropdown(ROLES, LANGUAGE["SELECT_A_ROLE"], {order: ROLES_ORDER});
    // dd_org_subs = new ZCDropdown.dropdown(SUBSCRIPTIONS, LANGUAGE["SELECT_AN_ALERT_LEVEL"]);

    var dd_org_role_id = dd_org_role.id();
    // var dd_org_subs_id = dd_org_subs.id();

    new_org_modal.on("accept", function() {
        if ($("#form-new-organization").valid()) {
            var org_name  = $("#organizationName").val();
            var org_edit  = "new";
            var org_role  = dd_org_role.value();
            // var org_subs  = dd_org_subs.value();
            var data_dict = {
                "org_edit": org_edit,
                "org_name": org_name,
                "org_role": org_role,
                // "org_subs": org_subs,
                "csrfmiddlewaretoken": getCookie('csrftoken')
            }

            $.ajax({
                type: "POST",
                url: "/api/1.0/customersite/",
                contentType: "application/json",
                data: JSON.stringify(data_dict),
                success: function(response) {
                    if (response.success) {
                        // If we were successful, add the new org to the org dropdown
                        $("#org-dropdown").empty();
                        switchOrg(response.items['id']);
                        addSuccessFlash(LANGUAGE["SUCCESS_CREATED_NEW_ORG"]);
                        hasher.setHash( 'dashboard_map' );

                    }
                }
            })

            return true;
        }
        else {
            validator_organization.focusInvalid();
            return false;
        }
    });

    new_org_modal.show();

    validator_organization = $("#form-new-organization").validate({
        errorClass    : "validation_fail",
        validClass    : "validation_check",
        errorPlacement: function (error, element) {
        },
        highlight     : function (element, errorClass, validClass) {
            $(element).closest("div").addClass(errorClass).removeClass(validClass);
        },
        unhighlight   : function (element, errorClass, validClass) {
            $(element).closest("div").addClass(validClass).removeClass(errorClass);
        },
        ignore        : ".ignore"
    });

    dd_org_role.parent($("#dropdown-org-role"));
    // dd_org_subs.parent($("#dropdown-org-alert"));

    $("#zc-dropdown-" + dd_org_role_id + "-parent a").on("click", function() {
        $("#hidden-zc-dropdown-" + dd_org_role_id).valid();
    });
    // $("#zc-dropdown-" + dd_org_subs_id + "-parent a").on("click", function() {
    //     $("#hidden-zc-dropdown-" + dd_org_subs_id).valid();
    // });
}


//Edit an Organization
function editOrganization(pk) {
    // Create a ZCModal

    var edit_org_template = ZCTemplate.get("new-organization");
    var user_language = $.cookie("LANGUAGE_ID");
    if (user_language ==  null)
    {
        user_language= 0; //this is set default language and will be changed according to the location
    }
    var json = LANGUAGE;
    var new_model_metadata =  $.extend(true, json, model_metadata);
    var edit_org_rendered = Mustache.render(edit_org_template, new_model_metadata);
    var edit_org_modal    = new ZCModal.modal("<h4 class='modal-title'>"+LANGUAGE["EDIT_ORGANIZATION"]+"</h4>", edit_org_rendered, LANGUAGE["ACCEPT"], false, LANGUAGE["CANCEL"]);
    var dd_org_role       = new ZCDropdown.dropdown(ROLES, LANGUAGE["SELECT_A_ROLE"], {order: ROLES_ORDER});
    // var dd_org_subs       = new ZCDropdown.dropdown(SUBSCRIPTIONS, LANGUAGE["SELECT_AN_ALERT_LEVEL"]);
    var org_role          = null
    // var org_subs          = null
    var org_name          = null
    // Get information about the selected Organization
    var p1 = $.ajax({
        type: "GET",
        url: "/api/1.0/customersite/" + pk + "/",
        success: function(response) {
            org_name = response.items[0].name;
        }
    });

    var p2 = $.ajax({
        type: "GET",
        url: "/api/1.0/site_user/" + pk + "/",
        success: function(response) {
            org_role = response.items[0].role;
            // org_subs = response.items[0].notification_level;
        }
    });

    $.when(p1, p2).then(function() {
        var dd_org_role_id = dd_org_role.id();
        // var dd_org_subs_id = dd_org_subs.id();

        edit_org_modal.$modal.find("#organizationName").val(org_name);

        edit_org_modal.on("accept", function() {
            if ($("#form-new-organization").valid()) {
                var edit_name  = $("#organizationName").val();
                var edit_role  = dd_org_role.value();
                // var edit_subs  = dd_org_subs.value();
                var data_dict = {
                    "org_edit": org_name,
                    "org_name": edit_name,
                    "org_role": edit_role,
                    // "org_subs": edit_subs,
                    "csrfmiddlewaretoken": getCookie('csrftoken')
                }

                $.ajax({
                    type: "POST",
                    url: "/api/1.0/customersite/" + pk + "/",
                    contentType: "application/json",
                    data: JSON.stringify(data_dict),
                    success: function(response) {
                        if (response.success) {
                            // If we were successful, add new org to org dropdown
                            $("#org-dropdown").empty();
                            buildOrgDropdown();
                            addSuccessFlash(LANGUAGE["SUCCESS_UPDATED_ORG_INFO"]);

                        }
                    }
                })

                return true;
            }
            else {
                validator_organization.focusInvalid();
                return false;
            }
        });

        edit_org_modal.show();

        validator_organization = $("#form-new-organization").validate({
            errorClass    : "validation_fail",
            validClass    : "validation_check",
            errorPlacement: function (error, element) {
            },
            highlight     : function (element, errorClass, validClass) {
                $(element).closest("div").addClass(errorClass).removeClass(validClass);
            },
            unhighlight   : function (element, errorClass, validClass) {
                $(element).closest("div").addClass(validClass).removeClass(errorClass);
            },
            ignore        : ".ignore"
        });


        dd_org_role.parent($("#dropdown-org-role"));
        // dd_org_subs.parent($("#dropdown-org-alert"));

        dd_org_role.value(org_role);
        // dd_org_subs.value(org_subs);

        $("#zc-dropdown-" + dd_org_role_id + "-parent a").on("click", function() {
            $("#hidden-zc-dropdown-" + dd_org_role_id).valid();
        });
        // $("#zc-dropdown-" + dd_org_subs_id + "-parent a").on("click", function() {
        //     $("#hidden-zc-dropdown-" + dd_org_subs_id).valid();
        // });
    });
}


//For getting the csrf Token, mostly.
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


/*
*   File Upload in "Feedback" via drag and drop
*
*
*/

var isAdvancedUpload = function() {
    var div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();


if (isAdvancedUpload) {
    var droppedFiles = undefined;

    $("body").on('drag dragstart dragend dragover dragenter dragleave drop',".droparea", function(e) {
        e.preventDefault();
        e.stopPropagation();
    })
    $("body").on('dragover dragenter',".droparea", function() {
        $(".droparea").addClass('dragover');
    })
    $("body").on('dragleave dragend drop',".droparea", function() {
        $(".droparea").removeClass('dragover');
    })
    $("body").on('drop',".droparea", function(e) {
        droppedFiles = e.originalEvent.dataTransfer.files;
        console.log(droppedFiles)
        // now do the upload
    });
}


$("body").on("click", "#addFiles", function(){
    $('#fileInput').click();
})


$("body").on("change", "#fileInput", function(){
    var droppedFiles = document.getElementById("fileInput").files;
    console.log(droppedFiles)
    // now do the upload
});


function getDevicePKList() {
    var pk_list = [];

    $(".treeItem.logger").each(function() {
        if ($(this).data("id") != "") {
            pk_list.push($(this).data("id"));
        }
    });

    var last_active_device_coord = LocalStorage.get("active_device.coordinates", {});
    var device_id = last_active_device_coord["device_id"];

    //TODO (Dustin) : Discovered that this doesn't ever work because we no longer use "active_device.coordinates"
    //if last logger saved and in list, move to first in list for rending it's data first.
    if(device_id) {
        if (device_id in pk_list) {

            var i = pk_list.indexOf(device_id);
            if(i != -1) {
                pk_list.splice(i, 1);
            }
            pk_list.unshift(device_id);
        }
    }

    return pk_list;
}


function checkDeviceTreeAlerts() {
    var pk_list = getDevicePKList();

    // for (var i = 0; i < pk_list.length; i++) {
        // var pk = pk_list[i];
        // if (!pk) {
        //     continue;
        // }

        $.ajax({
            type: "get",
            url: "/api/1.0/active_alert/",
            success: function(alerts) {
                var alert_items = alerts["items"];
                for (var j = 0; j < alert_items.length; j++) {
                    var alert      = alert_items[j];
                    var $tree_item = $(".treeItem.logger[data-id='" + alert["device"] + "']");
                    var $badge     = $tree_item.find("span.device-tree-badge");
                    var num_alerts = parseInt($badge.text());

                    $tree_item.addClass("warning");
                    $badge.text(num_alerts + 1);

                    // If the number of alerts is in the double digits, shift the badge slightly left to center it
                    if (num_alerts + 1 > 9) {
                        $badge.css("margin-left", "-69px");
                    }

                    $badge.show();
                }
            }
        });
    // }
}


var validator_feedback;

function setUpFeedbackModal() {

    ZCModal.init();
    var template = ZCTemplate.get("feedback");
    var user_language = $.cookie("LANGUAGE_ID");
    if (user_language ==  null)
    {
        user_language= 0; //this is set default language and will be changed according to the location
    }
    var json = LANGUAGE;
    let cached_feedback = JSON.parse(window.localStorage.getItem('cached_feedback'));
    var new_model_metadata =  $.extend(true, json, {'cached_feedback': cached_feedback}, model_metadata);
    var rendered = Mustache.render(template, new_model_metadata);
    var modal    = new ZCModal.modal("<h4 class='modal-title'>"+LANGUAGE["FEEDBACK"]+"</h4>", rendered, LANGUAGE["SEND_FEEDBACK"], false, LANGUAGE["CANCEL"]);

    var topic_options = {
        "R": LANGUAGE["FEATURE_REQ"],
        "B": LANGUAGE["BUG_REPORT"],
        "Q": LANGUAGE["QUESTION"],
        "O": LANGUAGE["OTHER"]
    };

    // the cache has the translated topic name so we need to get the associated key
    var topic = null;
    if (cached_feedback !== null) {
        for (let t in topic_options) {
            if (topic_options[t] === cached_feedback['topic']) {
                topic = t;
                break;
            }
        }
    }

    if (topic !== null) {
        var dropdown = new ZCDropdown.dropdown(topic_options, cached_feedback['topic']);
        let topic_dropdown = modal.$modal.find('#feedback-topic-dropdown');
        dropdown.parent(topic_dropdown);
        dropdown.value(topic);
        topic_dropdown.children("input").val(topic);
    } else {
        var dropdown = new ZCDropdown.dropdown(topic_options, LANGUAGE["SELECT_A_TOPIC"]);
        dropdown.parent(modal.$modal.find("#feedback-topic-dropdown"));
    }

    var devices = {};
    $(".treeItem.logger").each(function() {
        // finds the devices in the current org
        var id = $(this).data("id");
        var name = $(this).data("name");
        devices[id] = name;
    });

    var device_dropdown = new ZCDropdown.dropdown(
        devices,
        LANGUAGE['AFFECTED_DEVICES'], //this should prob be translated
        {multiple_selection: true,
        required:false, sort_by_text: true}
    );

    var dev_parent = modal.$modal.find('#feedback-dev-dropdown');
    device_dropdown.parent(dev_parent);
    var feedback_devices = {};

    if (cached_feedback != null) {
        let dropdown_devices = dev_parent.children("div").children("ul").children("input");
        for (let i = 0; i < cached_feedback['devices'].length; i++) {
            for (let j = 0; j < dropdown_devices.length; j++) {
                if (cached_feedback['devices'][i] === dropdown_devices[j].value) {
                    dropdown_devices[j].checked = true;
                    feedback_devices[cached_feedback['devices'][i]] = true;
                }
            }
        }
    }

    dev_parent.find('input[type=checkbox]').change(function () {
        var val = this.value;
        // the user has clicked a device, so toggle its membership
        if (feedback_devices[val] === undefined){
            feedback_devices[val] = true;
        }
        else{
            delete feedback_devices[val];
        }
    });

    modal.on("show", function($modal) {
        $("#feedback-topic-dropdown a").on("click", function() {
            $("#hidden-zc-dropdown-" + dropdown.id()).valid();
        });
    });

    modal.on("accept", function($modal) {
        if ($("#form-feedback").valid()) {
            var new_data = Array.prototype.reduce.call($modal.find(".form-control"), function (sum, current, index, array) {
                var $el = $(current);
                sum[$el.attr("name")] = $el.val();

                return sum;
            }, {});

            new_data = Array.prototype.reduce.call($modal.find(".dropdown .btn-label"), function (sum, current, index, array) {
                var $el = $(current);
                sum[$el.attr("name")] = $el.html();

                return sum;
            }, new_data);

            var user = JSON.parse($.cookie('user'));

            new_data.sender = user.id;
            new_data.topic = dropdown.value();
            new_data.email = JSON.parse($.cookie('user'));
            new_data.devices = [];
            new_data.browser = get_user_browser();
            for (var did in feedback_devices){
                new_data.devices.push(did);
            }

            //check file size
            var file;
            var input = document.getElementById('fileinput');

            if (input.files[0]) {
                file = input.files[0];

                file_size = Math.round((file.size / 1024 / 1024) * 100 / 100).toFixed(5);

                if (file_size > 8) {
                    $("<div id='file-error'>" +
                        "<font color ='red' size='2'>" +
                        "<p>*File size is too big.</p></font>" +
                        "</div>").appendTo('#file-upload');

                    return false;
                }
            }

            new_data["log_rocket_url"] = LogRocket.sessionURL;  // There is a chance that this may be null
            $.ajax({
                url: "/api/1.0/feedback/",
                type: "post",
                contentType: "application/json",
                data: JSON.stringify(new_data)
            }).success(function (response) {
                if (response.success) {
                    var feedback = response.items[0].id;

                    if (file) {
                        //if there is an attached file, save it.
                        var fdata = new FormData();
                        fdata.append('feedback', input.files[0], input.files[0].name);

                        $.ajax({
                            url: "/api/1.0/feedback/"+response.items[0].id+"/",
                            type: "put",
                            cache: false,
                            processData: false,
                            contentType: false,
                            data: fdata
                        }).success(function (response) {
                            if (response.success) {
                                addFlashNotification(LANGUAGE["SUCCESS_SUBMITTED_FEEDBACK"]);
                                modal.hide();
                            }
                        });
                    }
                    else {
                        addFlashNotification(LANGUAGE["SUCCESS_SUBMITTED_FEEDBACK"]);
                        modal.hide();
                    }
                    window.localStorage.removeItem('cached_feedback');
                }
            });

            return true
        }
        else {
            validator_feedback.focusInvalid();
            return false;
        }
    });

    return modal;
}


//re-checking file upload. clear error
function clear_error(){
    if($("#file-error")){
        $("#file-error").remove();
    }
}


// NOTE(brett): These are from device information. The the file was included inline instead of just put in main
function select_dropdown_item(item) {
    $(item).parent().parent().prev().find(".btn-label").text($(item).text());
    $(item).parent().parent().find('a').removeClass('active');
    $(item).addClass('active');
    if ($(item).hasClass("farm-option")) {
        update_hierarchy_sections(item);
    }
}

function update_hierarchy_sections(item) {
    var device_hierarchy_section = $("#device-hierarchy-section");
    var device_hierarchy_section_options = $("#device-hierarchy-section-options");
    device_hierarchy_section_options.empty();

    $.ajax({
        type: "GET",
        url: "get_sections_for_farm",
        data: {
            farm: $(item).text()
        },
        success: function(data) {
            var data = data["items"];

            device_hierarchy_section.text(data["current_section"]);
            for (var i = 0; i < data["all_sections"].length; i++) {
                device_hierarchy_section_options.append(
                    "<li role='presentation'>" +
                        "<a role='menuitem' class='device-information-option' onclick='select_dropdown_item(this);'>" +
                            data["all_sections"][i] +
                        "</a>" +
                    "</li>"
                );
            }
        },
        async: false
    });
}

var flash_index = 0;


function tooltips(){
    $(function () {
        // initializes bootstrap tooltips. Not sure why it's not on by default
        $('[data-toggle="tooltip"]').tooltip()
    });
}



function modalSuccessFlash(message, timeout){
    addFlashNotification(message, false, '.modal-alerts', timeout);
}

function modalErrorFlash(message, timeout){
    addFlashNotification(message, true, '.modal-alerts', timeout);
}

function addSuccessFlash(message) {
    addFlashNotification(message);
}


function addErrorFlash(message) {
    addFlashNotification(message, true);
}


// Add a flash notification to the screen. If flashes are already displayed, the new flash will be
// offset vertically.
// The ONLY thing necessary to display a flash notification is to call this function.
//   addFlashNotification("This is a green message");
//   addFlashNotification("This is a red message", true);
function addFlashNotification(message, error, container_selector, timeout) {
    // Only allow one flash with a unique message up at a time (no duplicates)
    var duplicate = false;
    if (container_selector == null){
        container_selector = ".flash-container";
    }
    if (timeout === undefined){
        // seconds before the banner disappears
        timeout = 4;
    }

    $('.flash').each(function() {
        if ($(this).find(".message-text").text() == message) {
            duplicate = true;
        }
    });

    if (duplicate == false) {
        if ( error == undefined ) {
            error = false;
        }

        var template  = ZCTemplate.get("flash-notification");
        var data_dict = {
            message: message,
            color:   "green",
            id:      ++flash_index
        };

        if (error) {
            data_dict["color"] = "red";
        }

        var rendered = Mustache.render(template, data_dict);
        $(container_selector).append(rendered);
        var $current_flash = $("#flash-" + flash_index);
        setTimeout(function() { $current_flash.addClass("in"); }, 1);

        $current_flash.find("span.zc-flash-close-icon").on("click", function() {
            // Do a slide-out
            $current_flash.removeClass("in");
            setTimeout(function() {
                // Remove the flash
                $current_flash.remove();
            }, 400);
        });

        setTimeout(function() {
            // Do a slide-out
            $current_flash.removeClass("in");
            setTimeout(function() {
                // Remove the flash
                $current_flash.remove();
            }, 400);
        }, timeout * 1000);
    }
}

 $('.hide-tree-button').on('click', function () {
     var $content_wrapper   = $(".contentWrapper");
     var $hamburger_btn     = $(".hamburger-button");
     var $float_btn         = $(".float-collapse-button");

     if(!$hamburger_btn.hasClass("collapsed")) {
         //hide device tree and move the floating button
         $content_wrapper.addClass("hideTree");
         $float_btn.addClass("active");
         $hamburger_btn.addClass("collapsed");
     }
     else {
        //open device tree and move the floating button
        $hamburger_btn.removeClass("collapsed");
        $float_btn.removeClass("active");
        $content_wrapper.removeClass("hideTree");
     }
 });

function has(obj, itm, key_val){
    for (var key in obj){
        var val = obj[key];
        if ((itm===key) && (key_val!=='val')){
            return true;
        }
        if ((itm===val) && (key_val!=='key')){
            return true;
        }
    }
    return false;
}

//(Note: Drew) Android Edge returns as unknown browser
function get_user_browser(){
    var ua = window.navigator.userAgent;
    var name;
    var id;
    if (ua.match('Edge/')){
        name = 'Edge';
        id = 0;
    }
    else if (ua.match('OPR/')){
        name = 'Opera';
        id = 1;
    }
    else if (ua.match('Chrome/') || ua.match('CriOS/')){
        name = 'Chrome';
        id = 2;
    }
    else if (ua.match('Firefox/')){
        name = 'Firefox';
        id = 3;
    }
    else if (ua.match('Safari/') && !ua.match('CriOS/') && !ua.match('Android')){
        name = 'Safari';
        id = 4;
    }
    else {
        name = 'Unknown Browser';
        id = -1;
    }

    var version;
    var words = ua.split(' ');
    for (var index in words){
        var word = words[index];
        if (word.indexOf(name) !== -1){
            version = word.split('/')[1];
        }
    }
    if (version === undefined){
        version = 'Unknown Version';
    }
    return {name:name, id:id, version:version};
}

//we want to detect if a user has refreshed the page to clear the coordinates on map page and start over.
window.onunload = function(e) {
    sessionStorage.clear();
};
function utc_date(date){
    // given a regular Date, converts it to the UTC form
    if (date==null) {
        date = new Date();
    }
    var utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return utc;
}

function date_to_string(date, start_of_day){
    // makes a pretty string in a form Python will recognize
    if (date==null){
        date = utc_date();
    }
    // padding makes sure they are 2 digits. Ex: March='03'
    var DD      = ((date.getDate()).toString()).pad(2,"0");
    var MM      = ((date.getMonth() + 1).toString()).pad(2,"0");//getMonth is an array (starts with 0).
    var HH       = ((date.getHours()).toString()).pad(2,"0");
    var mm    = ((date.getMinutes()).toString()).pad(2,"0");
    var YYYY    = date.getFullYear();
    // MM/DD/YYYY HH:mm
    if (start_of_day != null && start_of_day == true) {
        return MM+'/'+DD+'/'+YYYY+' 00:00';
    }
    else {
        return MM+'/'+DD+'/'+YYYY+' '+HH+":"+mm;
    }
}

function edit_site(site_id) {
        $.ajax({
            url: '/api/1.0/site/' + site_id + '/',
            type: 'GET',
        })
            .success(function (results) {
                let site = results.items[0];
                let num_devices = results.extra.length;
                let sections = results.items[0].sections;
                create_and_show_edit_site_modal(site, num_devices, sections);
            });
}

function edit_plot(section_id) {
    $.ajax({
        url: '/api/1.0/section/' + section_id + '/',
        type: 'GET',
    })
        .success(function (results) {
            let section = results.items[0];
            let num_devices = results.extra.length;
            create_and_show_edit_plot_modal(section, num_devices);
        });
}

function create_and_show_edit_site_modal(site, num_devices, sections) {
        if (!site) {
            console.error('There was an error getting ' + UI_SETTINGS_OPTIONS[UI_SETTING]["first"] + ' info. Something went wrong :(.', data);
            return;
        }

        var first_info = (UI_SETTINGS_OPTIONS[UI_SETTING]["first"].toUpperCase())+"_INFO";
        var first_name = (UI_SETTINGS_OPTIONS[UI_SETTING]["first"].toUpperCase())+"_NAME";
        var first_info = translations[user_language][first_info];
        var first_name = translations[user_language][first_name];

        const template = ZCTemplate.get('edit-site');
        var json = translations[user_language];
        var translate_title = 'EDIT_'+ (UI_SETTINGS_OPTIONS[UI_SETTING]["first"].toUpperCase());
        const MODAL_TITLE = '<h4 class="modal-title">'+ translations[user_language][translate_title] + '</h4>';
        var new_model_metadata = $.extend(true, model_metadata, json, {"TITLE": first_info, "NAME": first_name, "farm_id": site.id});
        var rendered_modal_template = Mustache.render(template, new_model_metadata);
        var m = new ZCModal.modal(MODAL_TITLE, rendered_modal_template, translations[user_language]["ACCEPT"], false, translations[user_language]['CANCEL']);
        var edit_site_validator = m.$modal.find('#form-edit-farm').validate(VALIDATION_OPTIONS);

        m.on('show', function ($modal) {
            $modal.find('#site-name-textbox').val('');
            $modal.find('#site-name-textbox').val(site.name);
        });

        m.on('accept', function ($modal) {

            if ($('#form-edit-farm').valid()) {
                var site_name = $modal.find('#site-name-textbox').val();

                if (site_name.strip() == '') {
                    console.error('cannot create new ' + UI_SETTINGS_OPTIONS[UI_SETTING]["first"] + ' with blank name.');
                    return;
                }

                $.ajax({
                    url: '/api/1.0/site/' + site.id + '/',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        name: site_name
                    })
                })
                    .success(function (response) {
                        var translate_title = 'SUCCESS_UPDATED_'+ (UI_SETTINGS_OPTIONS[UI_SETTING]["first"].toUpperCase());
                        addSuccessFlash(translations[user_language][translate_title]);

                        var new_site = response.items[0];

                        if (!new_site) {
                            var translate_title = 'NO_WAS_FOUND_'+ (UI_SETTINGS_OPTIONS[UI_SETTING]["first"].toUpperCase());
                            addErrorFlash(translate_title);
                            return false;
                        }
                        debugger
                        $('#farm-name').html(new_site.name);
                        var $site = $('.treeItem.site[data-id="' + site.id + '"]');
                        $site.children("span").text(new_site.name);
                        $site.closest('.site-group').attr('data-site-name', new_site.name);
                        $site.closest('.site-group').data('site-name', new_site.name);
                        site = new_site;

                        var $device_tree = $(".deviceTree.manage");
                        update_site_tree($device_tree);
                    });

                return true;
            }
            else {
                edit_site_validator.focusInvalid();
            }
        }); // end of m.on('accept')

        let delete_btn = m.$modal.find('#delete-site-btn');
        delete_btn.on('click', ()=> {
            if (num_devices != 0) {
                var translate_title = 'THIS_HAS_DEVICES_' + (UI_SETTINGS_OPTIONS[UI_SETTING]["first"].toUpperCase());
                modalErrorFlash(translations[user_language][translate_title]);
            }
            // else if (charts.length != 0) {
            //         alert('site: charts exists here');
            // }
            else {
                m.hide();
                if(sections.length === 0) {
                    create_and_show_delete_site_modal(site);
                }
                else {
                    create_and_show_delete_site_modal(site, {"sections": sections});
                }
            }
        });

        m.show();
}

function create_and_show_edit_plot_modal(section, num_devices) {
    var second_info = (UI_SETTINGS_OPTIONS[UI_SETTING]["second"].toUpperCase())+"_INFO";
    var second_name = (UI_SETTINGS_OPTIONS[UI_SETTING]["second"].toUpperCase())+"_NAME";
    var first_parent = "PARENT_"+(UI_SETTINGS_OPTIONS[UI_SETTING]["first"].toUpperCase());
    var unnamed_second = "UNNAMED_"+(UI_SETTINGS_OPTIONS[UI_SETTING]["second"].toUpperCase());
    var second_info = translations[user_language][second_info];
    var second_name = translations[user_language][second_name];
    var first_parent = translations[user_language][first_parent];
    var unnamed_second = translations[user_language][unnamed_second];

    var self = this;
    var json = translations[user_language];
    let farm_id = section.farm.id;
    var translate_title = 'EDIT_'+ (UI_SETTINGS_OPTIONS[UI_SETTING]["second"].toUpperCase());
    const template = ZCTemplate.get('edit-section');
    const MODAL_TITLE = '<h4 class="modal-title">'+translations[user_language][translate_title] +'</h4>';
    var new_model_metadata = $.extend(true, model_metadata, json, {"TITLE": second_info, "NAME": second_name, "PARENT": first_parent, "UNNAMED": unnamed_second, "farm_id": farm_id});

    var rendered_modal_template = Mustache.render(template, new_model_metadata);
    var m = new ZCModal.modal(MODAL_TITLE, rendered_modal_template,  translations[user_language]["ACCEPT"], false, translations[user_language]['CANCEL']);

    var farm_dropdown = new ZCDropdown.dropdown([], translations[user_language]["CHOOSE_PARENT"]);
    farm_dropdown.parent(m.$modal.find("#farm-dropdown-parent"));

    var resp_user_dropdown = new ZCDropdown.dropdown([], translations[user_language]["SELECT_RESPONSIBLE_USER"], {required: false});
    resp_user_dropdown.parent(m.$modal.find("#responsible-user-dropdown-parent"));

    m.$modal.find('#plotNameInput').val(section.name);
    m.$modal.find(".farm-select-list-item[data-id='"+farm_id+"']").click();

    //add none to responsible person dropdown
    //m.$modal.find(".userSelect").append("<li role='presentation'>" +
    //"<a role='menuitem' data-id='' class='responsible-user-select-list-item' onclick='select_dropdown_item(this)'>None</a></li>");

    m.$modal.find("#plotNotes").val(section.notes);

    var edit_site_validator = m.$modal.find('#form-edit-section').validate(VALIDATION_OPTIONS);

    m.on('show', function($modal) {
        $.get('/api/1.0/farm/').success(function(e){
            var kvs = e.items.reduce(function(s, e, i) {
                s[e.id] = e.name;
                return s;
            }, {});
            farm_dropdown.data(kvs);
            farm_dropdown.value(farm_id)
        });

        $.ajax({
            type: 'get',
            url: '/api/1.0/user/',
            success: function(e) {
                var kvs = e.items.reduce(function(s, e, i) {
                    s[e.id] = e.email;
                    return s;
                }, {});

                kvs["-1"] = "No Responsible User";

                resp_user_dropdown.data(kvs);

                var resp_value =  section.responsible_user? section.responsible_user.id : -1;
                resp_user_dropdown.value(resp_value)
            }
        });
    });

    m.on('accept', function($modal) {
        if ( $modal.find('#form-edit-section').valid() ) {

            var rui = $modal.find("#responsible-user-dropdown-parent .dropdown ul.dropdown-menu li a.active").data("value");
            var resp_user_id =  rui!= -1 ? rui : "";

            var new_section_info = {
                farm_id            : farm_dropdown.value(),
                name               : $modal.find("#plotNameInput").val(),
                notes              : $modal.find("#plotNotes").val(),
                responsible_user_id: resp_user_id,
            };

            $.ajax({
                url: '/api/1.0/section/' + section.id + '/',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(new_section_info)
            })
            .success(function(data) {
                var translate_title = "SUCCESS_UPDATED_"+ (UI_SETTINGS_OPTIONS[UI_SETTING]["second"].toUpperCase());

                addSuccessFlash(translations[user_language][translate_title]);
                var updated_section = data.items[0];

                if ( ! updated_section ) {
                    var translate_title = "FAILED_TO_SAVE_"+ (UI_SETTINGS_OPTIONS[UI_SETTING]["second"].toUpperCase());
                    addErrorFlash(translations[user_language][translate_title], data)
                }

                $section = $('.treeItem.plot[data-id="' + updated_section.id + '"]');
                $section.children("span").text(updated_section.name);
                $plotgroup = $section.parent();
                $plotgroup.detach();
                $plotgroup.attr('data-plot-name', updated_section.name);
                $plotgroup.data('plot-name', updated_section.name);

                $('.treeItem.site[data-id="'+updated_section.farm.id+'"]').parent().append($plotgroup);

                update_section_tree($plotgroup.parent());
                update_site_tree($plotgroup.parent());

                // update report name if on dashboard report page
                if (window.location.hash === '#/dashboard_report') {
                    $report = $(".panel.report-item-"+data['items'][0]['report_id']['id']+"");
                    $report_title = $report.children('.panel.panelHead.listBody').children('.row').children('.col.col-sm-4.col-xs-9');
                    $report_title.html("<h2>"+translations[user_language]['REPORT']+": "+updated_section.name+"</h2>");
                }

                $section.click();
            });

            return true;
        }
        else {
            edit_site_validator.focusInvalid();
            return false;
        }

        console.warn('probably shouldnt have made it here :/ 2');
        return true;
    });

    let delete_btn = m.$modal.find('#delete-plot-btn');
    delete_btn.on('click', ()=> {
        // check for existing devices
        if ( num_devices != 0 ) {
            var translate_title =  "THIS_HAS_DEVICES_"+ (UI_SETTINGS_OPTIONS[UI_SETTING]["second"].toUpperCase());
            modalErrorFlash(translations[user_language][translate_title], true);
        }
        else {
            m.hide();
            create_and_show_delete_plot_modal(section);
        }
    });

    m.show();
}

function create_and_show_delete_site_modal(site, plot_dict=null) {
    var self                  = this;
    var delete_template       = ZCTemplate.get('delete-farm-site');
    var translate_title       = 'DELETE_'+ (UI_SETTINGS_OPTIONS[UI_SETTING]["first"].toUpperCase());
    var delete_title          = '<h4 class="modal-title">'+translations[user_language][translate_title] +'</h4>';
    var new_delete_modal      = $.extend(true, model_metadata, {"hierarchy": UI_SETTINGS_OPTIONS[UI_SETTING]});
    var delete_modal_template = Mustache.render(delete_template, new_delete_modal);
    var delete_modal          = new ZCModal.modal(delete_title, delete_modal_template, translations[user_language]["DELETE"], false, translations[user_language]["CANCEL"]);

    delete_modal.$modal.find("#farm-name").html(site.name);
    delete_modal.$modal.find("#section_list").empty();

    if (plot_dict != null) {
        var delete_section_template = ZCTemplate.get('delete-section-list');
        var modal_info              = $.extend(true, model_metadata, {"hierarchy": UI_SETTINGS_OPTIONS[UI_SETTING]}, plot_dict);
        var rendered                = Mustache.render(delete_section_template, modal_info);

        delete_modal.$modal.find('#section_list').append(rendered);
    }

    delete_modal.on('show', function($modal) {
        if (plot_dict !== null) {
            delete_modal.$modal.find(".warning-text").html(translations[user_language]['DELETE_SITE_WARNING']);
        }
    });

    delete_modal.on('accept', function($modal) {
        //list of sections within site to delete
        var section_ids = [];

        $modal.find(".section-name").each(function(){ section_ids.push($(this).attr("data-id")); });

        $.ajax({
            url: '/api/1.0/site/' + site.id + '/',
            type: 'delete'
        })
            .success(function (results) {
                let page = window.location.hash;

                if (!results.success) {
                    var translate_title = 'UNABLE_TO_REMOVE_' + (UI_SETTINGS_OPTIONS[UI_SETTING]["first"].toUpperCase());

                    addFlashNotification(translations[user_language][translate_title], true);
                }
                else {
                    var translate_title = 'SUCCESS_REMOVED_' + (UI_SETTINGS_OPTIONS[UI_SETTING]["first"].toUpperCase());

                    addFlashNotification(translations[user_language][translate_title]);
                    $('.site-group[data-site-name="' + site.name + '"]').remove();

                    // Activate first tree element and the update the name in box. If there are no
                    // sites, show the "how do I add devices?" panel.
                    if (page === '#/manage_devices' && $(".site-group:first-child .treeItem.site").length == 0) {
                        self.update_view_with_no_selection();
                    }
                    else {
                        $('.site-group:first-child .treeItem.site').click();
                    }
                }

                // remove reports if on dashboard page
                if (page === '#/dashboard_report') {
                    for (i = 0; i < site.sections.length; i++) {
                        $report = $(".panel.report-item-" + site.sections[i]['report_id']['id'] + "");
                        $report.remove();
                    }
                }
            });

        return true;
    });

    delete_modal.show();
}

function create_and_show_delete_plot_modal(section) {
    var second_info = (UI_SETTINGS_OPTIONS[UI_SETTING]["second"].toUpperCase())+"_INFO";
    var second_name = (UI_SETTINGS_OPTIONS[UI_SETTING]["second"].toUpperCase())+"_NAME";
    var first_name = (UI_SETTINGS_OPTIONS[UI_SETTING]["first"].toUpperCase())+"_NAME";
    var second_info = translations[user_language][second_info];
    var first_name = translations[user_language][first_name];
    var second_name = translations[user_language][second_name];

    const delete_template     = ZCTemplate.get('delete-plot-section');
    var json                  = translations[user_language];
    var new_delete_modal =    $.extend(true, model_metadata, json, {"TITLE": second_info, "SECOND_NAME": second_name, "FIRST_NAME": first_name});
    var translate_title       = "DELETE_"+ (UI_SETTINGS_OPTIONS[UI_SETTING]["second"].toUpperCase());
    const delete_title        = '<h4 class="modal-title">'+ translations[user_language][translate_title]+'</h4>';
    var delete_modal_template = Mustache.render(delete_template, new_delete_modal);
    var delete_modal          = new ZCModal.modal(delete_title, delete_modal_template, translations[user_language]["DELETE"], false, translations[user_language]["CANCEL"]);


    delete_modal.on('show', function($modal) {
        delete_modal.$modal.find("#farm-name").html(section.farm.name);
        delete_modal.$modal.find("#delete-plot-name").html(section.name);
        delete_modal.$modal.find(".warning-text").html(translations[user_language]['DELETE_PLOT_WARNING']);
    });

    delete_modal.on('accept', function($modal) {
        $.ajax({
                url: '/api/1.0/section/' + section.id + '/',
                type: 'delete'
        })
        .success(function() {
            $('.treeItem.plot[data-id="' + section.id + '"]').parent().remove();
            let translate_title =  "SUCCESS_REMOVE_"+ (UI_SETTINGS_OPTIONS[UI_SETTING]["second"].toUpperCase());
            addFlashNotification(translations[user_language][translate_title]);

            //if another logger exists, then display it's data, else select the next plot.
            if($('.deviceTree .treeItem.logger').length){
                $('.deviceTree .treeItem.logger').first().click();
            }
            else{
                $('.deviceTree .treeItem').first().click();
            }

            // remove report if on dashboard page
            if (window.location.hash === '#/dashboard_report') {
                $report = $(".panel.report-item-"+section['report_id']['id']+"");
                $report.remove()
            }
        });

        return true;
    });

    delete_modal.show();
}

// print('About to click');
// showSeasonPassModal();
// $("#user-settings-menu-subscriptions")[0].click();}

