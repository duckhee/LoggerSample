
function populate_season_pass_modal(modal, starting_page, starting_org_id, voucher_code){
    ' Refreshes the subscription modal. Assumes the modal is already open (but may be unpopulated) '
    function first_time_setup(orgs, pass_types){
        ' creates the data structures that we will use to represent the the webpage '

        function add_parts_to_devices(org, parts){
            'Adds info to each device object about which passes it already has'
            for (var f_index in org.farms){
                var farm = org.farms[f_index];
                var sections = farm.sections;
                for (var s_index in sections){
                    var section = sections[s_index];
                    var devices = section.devices;
                    for (var d_index in devices){
                        var device = devices[d_index];
                        // 'name (sn)' or just 'sn' if they're the same
                        device.pretty_name = name_and_sn(device);
                        var did = device.did;
                        var reqs = device.requirements;
                        var passes = [];
                        for (var index in device.passes){
                            var pass = device.passes[index];
                            passes.push(pass.part_num);
                        }
                        device.parts = {};
                        device.cart = {};
                        for (var part_num in parts){
                            var part = parts[part_num];
                            var needs = has(reqs, part_num);
                            // currently, the difference between false and null isn't used
                            if (needs){
                                device.parts[part_num] = false;
                            }
                            else {
                                device.parts[part_num] = null;
                            }
                        }
                        var passes = device.passes;
                        var now = new Date();
                        for (var p_index in passes){
                            var pass = passes[p_index];
                            pass.start = moment(pass.start);
                            pass.end = moment(pass.end);
                            let day_diff = pass.end.diff(pass.start, 'days');
                            var part_num = pass.part_num;
                            if (part_num===null){
                                // should never happen
                                device.parts[null].push(pass);
                            }
                            else if (day_diff < 300){ // only trials are less than 300 days
                                device.trial_start = pass.start.format('L');
                                device.trial_end = pass.end.format('L');
                                device.trial_part = part_num
                            }
                            else {
                                device.parts[part_num] = true;
                            }
                        }
                        delete device.passes;
                        var tp = device.trial_part;
                        if ((tp !== undefined) && (device.parts[tp] === true)){
                            // they had a trial and later got a full pass of that type. So don't show the trial anymore
                            delete device.trial_start;
                            delete device.trial_end;
                            delete device.trial_part
                        }
                        device.org_id = org.id;
                        home.devices[device.did] = device;
                        org.devices[did] = device;
                    }
                }
            }
        }

        // set all the data structures to empty
        org_names = {};
        buy_cart = {};
        payment_method = 0; // 0=nothing selected
        req_actions.changes= {add:{}, remove:{}};
        voucher = {
            code:null,
            left: null,
            passes: [],
            redeem: {}
        };
        home = {
            passes: {},
            devices: {},
            devices_by_sn:{},
            orgs: [],
            pass_types : {},
            active_org: home.active_org,
            show_all_years: home.show_all_years
        };
        tax_rate = null;
        var passes = {};
        home.passes = passes;
        home.pass_types = pass_types;
        for (var part_num in pass_types){
            var part = pass_types[part_num];
            part.start = new Date(part.start);
            part.end = new Date(part.end);
            part.part_num = part_num;
            // part_names[part_num] = part.name;
        }
        for (var index in orgs){
            var org = orgs[index];
            org.devices = {};
            passes[org.id] = {};
            passes[org.id][null] = [];
            for (var part_num in pass_types){
                passes[org.id][part_num] = [];
            }
            var unassigned = org.unassigned;
            for (var u_index in unassigned){
                var pass = unassigned[u_index];
                pass.device = null;
                var part_num = pass.part_num;
                passes[org.id][part_num].push(pass);
            }
            add_parts_to_devices(org, pass_types);
            org.years = [];
            for (var i in years_to_show){
                var year = years_to_show[i];
                // will be used for the 'Renew all' buttons
                org.years.push({
                    year:year,
                    on: false
                })
            }
            delete org.unassigned;
        }
        //print(home);
    }

    function build_voucher_page(){
        var voucher_page_template = $templates.find(
            '#voucher-page-template').html();
        var args = add_words({});
        var page = Mustache.to_html(voucher_page_template, args);
        return page;
    }

    function build_voucher_builder_page(){
        var page = $templates.find(
            '#voucher-builder-page-template').html();
        var args = add_words({});
        page = Mustache.to_html(page, args);
        return page;
    }

    function build_buy_page(){
        var buy_template = $templates.find('#buy-page-template').html();
        var buy_cart = $templates.find('#buy-cart-template').html();
        var args = add_words({});
        buy_cart = Mustache.to_html(buy_cart, args);
        var cart_builder = '';
        var discount_template = $templates.find("#bulk-discount-table-template").html();
        var discount_dicts = [];
        for (var index in bulk_discounts){
            var discount = bulk_discounts[index];
            discount_dicts.push({
                min:discount[0],
                max:discount[1],
                percent:discount[2]
            });
        }
        var discount_section = Mustache.to_html(discount_template, discount_dicts);
        var sections = {
            cart_builder: cart_builder,
            cart: buy_cart,
            bulk_discounts: discount_section
        };
        var rendered_page = Mustache.to_html(buy_template, sections);
        return rendered_page;
    }

    function build_confirmation_page(){
        var confirmation_page_template = $templates.find(
            '#confirmation-page-template').html();
        var args = add_words({});
        var page = Mustache.to_html(confirmation_page_template, args);
        return page;
    }

    function build_contact_page(){
        var contact_page_template = $templates.find(
            '#contact-form-template').html();
        var args = add_words({});
        var page = Mustache.to_html(contact_page_template, args);
        return page;
    }

    function build_requirements_page(){
        var template = $templates.find('#req-page-template').html();
        var args = add_words({});
        template = Mustache.to_html(template, args);
        return template
    }

    function build_account_page(){
        var page_template = $templates.find("#account-page-template").html();
        return page_template;
    }

    function open_page(page, org_id, voucher_code){
        if (org_id === undefined){
            // go to their current org, according to the main dropdown
            org_id = $("#org-dropdown").data("id");
            home.active_org = org_id;
        }
        else{
            home.active_org = org_id;
        }
        // this will also show the given org
        dropdowns.set_value('home_org', org_id);
        if (page === 'buy'){
            buy_actions.show_page()
        }
        else if (page === 'voucher'){
            voucher_actions.show_page();
            if (voucher_code != undefined){
                voucher_actions.use_voucher(voucher_code);
            }
        }
        else {
            home_actions.show_page();
        }
    }

    function build_dropdowns(is_superuser){
        // builds the ZCDropdown that will be used trhoughout the modal
        var orgs = {};
        for (var index in home.orgs){
            var org = home.orgs[index];
            orgs[org.id] = org.name;
        }
        var account_orgs = {};
        for (var index in home.orgs){
            var org = home.orgs[index];
            if (org.m3_id === null){
                var text = '<b>'+org.name+'</b>';
            }
            else {
                var text = org.name;
            }
            account_orgs[org.id] = text;
        }
        dropdowns.make({
            name: 'home_org',
            options: orgs,
            action: home_actions.show_org_body
        });
        var payment_methods = {
            1: 'Credit Card',
            2: 'Quote Request'
        };
        dropdowns.make({
            name: 'payment_methods',
            options: payment_methods,
            action: contact_actions.manage_payment_methods
        });
        dropdowns.make({
            name: 'voucher_org',
            options: orgs,
            action: voucher_actions.build_options,
            optional: {multiple_selection: 200}
        });
        if (!is_superuser){
            // everything after this is only used by superusers
            return;
        }
        dropdowns.make({
            name: 'account_org',
            options: account_orgs,
            action: account_actions.show_org
        });
        function show_buttons(org_id){
            var buttons = $req_page.find(".req-button");
            var selector = ".req-button-"+org_id;
            var show = buttons.filter(selector);
            var hide = buttons.not(selector);
            show.show();
            hide.hide();
            var first = show.find('button').get(0);
            if (first) {
                first.onclick();
            }
            home.active_org = org_id;
        }
        dropdowns.make({
            name: 'req_org',
            options: orgs,
            action: show_buttons
        });

        var part_names = {};
        for (var part_num in home.pass_types){
            var type = home.pass_types[part_num];
            part_names[part_num] = part_num+' | '+type.name;
        }
        dropdowns.make({
            name: 'create_part',
            options: part_names,
            action: null
        });
    }

    function populate_req_page(is_superuser){
        if (!is_superuser){
            return;
        }
        // builds the stuff we need to represent the requirements tab
        var org_options = {};
        for (var did in home.devices){
            var device = home.devices[did];
            var sn = device.sn.toUpperCase();
            var org_id = device.org_id;
            if (org_options[org_id] === undefined){
                org_options[org_id] = {};
            }
            org_options[org_id][sn] = device.name;
            home.devices_by_sn[sn] = device;
        }
        var sn_list = [];
        for (var snn in home.devices_by_sn){
            var dev = home.devices_by_sn[snn];
            sn_list.push({
                sn:snn,
                name: dev.name,
                org_id: dev.org_id
            });
        }
        var template = $templates.find("#req-device-buttons-template").html();
        var args = add_words({sn_list:sn_list});
        var rendered = Mustache.to_html(template, args);
        var div = $req_page.find("#req-devices");
        div.append(rendered);
    }

    function add_listeners(){
        // I've had some problems with the event triggering if you aren't
        //  interacting with an input element
        enter($req_page.find('#req-sn-text'), function(e){
            // hitting enter while using the SN search box is the same as clicking search button
            $req_page.find('#req-sn-button').click();
        });
        enter($voucher_builder_page, function(e){
            voucher_builder_actions.request_voucher();
        });
        enter($voucher_page.find('#voucher-code-input'), function(e){
            voucher_actions.check_code();
        });
        enter($buy_page.find('#buy-quantity'), function(e){
            buy_actions.add_to_cart();
        });
        var close_button = $modal.find("#zc-modal-btn-close");
        close_button.click(function(){
            // makes the session visible in LogRocket for review
            LogRocket.log('Closed subscription modal')
        });
    }

    function setup_stripe(public_key){
        // form a connection to our account
        // var image_url = 'https://stripe.com/img/documentation/checkout/marketplace.png';
        stripe = Stripe(public_key);
        // var stripe_handler = StripeCheckout.configure({
        //     key: public_key,
        //     image: image_url,
        //     locale: 'auto',
        //     token: function(token) {
        //         //add error checking and handling here
        //         var token_id = token.id;
        //         // Get the token ID to your server-side code for use.
        //         // submit the order
        //         buy_actions.place_order(token_id);
        //     }
        // });
        // var button = document.getElementById('stripe_button');
        // button.addEventListener('click', function(e) {
        //     // Open Checkout with further options:
        //     stripe_handler.open({
        //         name: 'Demo Site',
        //         description: '2 widgets',
        //         amount: 2000
        //     });
        //     e.preventDefault();
        // });
        // Create an instance of Elements.
        var elements = stripe.elements();

        // Custom styling can be passed to options when creating an Element.
        // (Note that this demo uses a wider set of styles than the guide below.)
        var style = {
            base: {
                color: '#32325d',
                lineHeight: '18px',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };

        // Create an instance of the card Element.
        card = elements.create('card', {style: style});

        // Add an instance of the card Element into the `card-element` <div>.
        card.mount('#card-element');

        // Handle real-time validation errors from the card Element.
        card.addEventListener('change', function(event) {
            var displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    }

    season_pass_modal = modal;
    var $modal= modal.$modal;
    enter($modal, function(e){
        // stops the enter key from closing the modal
        e.preventDefault();
        return false;
    });
    season_pass_modal.cancel_button = $modal.find('#zc-modal-btn-cancel');
    season_pass_modal.accept_button = $modal.find('#zc-modal-btn-accept');
    var $content = $modal.find('#season-passes-content');
    season_pass_modal.header = $modal.find('#season-pass-modal-header');
    season_pass_modal.content = $content;
    $content.empty();
    var r1 = null;
    var r2 = null;
    var call_1 = $.ajax({
        url: '/api/1.0/season_passes/',
        type: 'get',
        contentType: 'application/json',
        data: {},
        success: function (response) {
            r1 = response;
        }
    });
    var call_2 = $.ajax({
        url: '/api/1.0/season_pass_classes/',
        type: 'get',
        contentType: 'application/json',
        data: {},
        success: function(response){
            r2 = response
        }
    });
    // after both the calls return
    $.when(call_1, call_2).then(function() {
        var data = r1.items;
        var organizations = data.organizations;
        var is_superuser = data.is_superuser;
        var stripe_public_key = data.public_key;
        var pass_types = r2.classes;
        first_time_setup(organizations, pass_types);
        home.orgs = organizations;
        for (var index in organizations) {
            var org = organizations[index];
            org_names[org.id] = org.name;
        }
        $templates = $modal.find('#season-pass-templates');
        var home_page = home_actions.build_page(organizations);
        var voucher_page = build_voucher_page();
        var voucher_builder_page = build_voucher_builder_page();
        var buy_page = build_buy_page();
        var history_page = '';
        var confirmation_page = build_confirmation_page();
        var contact_page = build_contact_page();
        var req_page = build_requirements_page();
        var account_page = build_account_page();
        var wrapper_template = $templates.find(
            '#season-passes-wrapper').html();
        var pages = {
            buy_page: buy_page,
            voucher_page: voucher_page,
            voucher_builder_page: voucher_builder_page,
            home_page: home_page,
            history_page: history_page,
            confirmation_page: confirmation_page,
            contact_page: contact_page,
            req_page: req_page,
            account_page: account_page,
            voucher_builder_tab: is_superuser,
            req_tab: is_superuser,
            account_tab: is_superuser
        };
        var args = add_words(pages);
        var content = Mustache.render(wrapper_template, args);
        $content.append(content);
        $buy_page = $modal.find("#buy-season-passes-page");
        $voucher_page = $modal.find("#voucher-season-passes-page");
        $voucher_builder_page = $modal.find('#voucher-builder-page');
        $history_page = $modal.find("#history-season-passes-page");
        $confirmation_page = $modal.find(
            "#confirmation-season-passes-page");
        $req_page = $modal.find('#req-season-passes-page');
        $contact_page = $modal.find('#contact-season-passes-page');
        $home_page = $modal.find("#home-season-passes-page");
        $account_page = $modal.find("#account-season-passes-page");
        $loading_page = $modal.find('#loading-season-passes-page');
        build_dropdowns(is_superuser);
        populate_req_page(is_superuser);
        add_listeners();
        var $tabs = $modal.find('#season-passes-tabs');
        tabs = {
            home: $tabs.find('#home-tab'),
            voucher_builder: $tabs.find('#create-tab'),
            buy: $tabs.find('#buy-tab'),
            history: $tabs.find('#history-tab'),
            voucher: $tabs.find('#redeem-tab'),
            req: $tabs.find('#req-tab'),
            account: $tabs.find('#account-tab')
        };
        $org_bodies = $home_page.find('.season-passes-org-content');
        open_page(starting_page, starting_org_id, voucher_code);
        history_actions.refresh();
        contact_actions.refresh_fields();
        account_actions.load(is_superuser);
        voucher_actions.hide_sections();
        tooltips();
        setup_stripe(stripe_public_key);
    });
}

var org_names = {}; //{id: name}
// Tells us which years buttons on the assign tab to show/hide
var years_to_show = [2019, 2020, 2021];
var bulk_discounts = [
    // min, max, percent off
    [1, 4, 0],
    [5, 9, 5],
    [10, 19, 10],
    [20, 39, 15],
    [40, 59, 20],
    [60, 99, 25],
    [100, null, 30]
];

var season_pass_modal;

// Jquery sub-objects of the modal
var tabs = {};
var $templates;
var $org_bodies;
var $buy_page;
var $voucher_page;
var $voucher_builder_page;
var $home_page;
var $history_page;
var $confirmation_page;
var $contact_page;
var $req_page;
var $account_page;
var $loading_page;
var tax_rate;
var cart_subtotal;
var stripe;
var card;
var payment_method; // 0=neither, 1=credit card, 2=purchase order

/*
    Superusers have access to the hidden 'Activate 30 Day Trial' button on the Cart tab.
    Since the buy_cart variable does not include devices when a credit is applied,
    devices_in_cart will maintain the device ids of all devices in the cart.
 */
var is_superuser;
var devices_in_cart = [];

var dropdowns = {
    // Handles the common things we want to do with ZCDropdowns
    selectors:{
        home_org: '#home-org-dropdown',
        buy_org: '#buy-org-dropdown',
        buy_part: '#buy-part-dropdown',
        buy_type: '#buy-type-dropdown',
        voucher_org: '#voucher-org-dropdown',
        voucher_quant: '#voucher-quant-dropdown',
        create_part: '#create-part-dropdown',
        create_type: '#create-type-dropdown',
        country_dropdown: '#country-dropdown',
        req_org: '#req-org-dropdown',
        payment_methods: '#payment-methods',
        account_org: '#account-org-dropdown'
    },
    objects: {
        // home_org: jquery
        // get plugged in as they're built
    },
    make: function(a){
        // a = {name, options, label, action, value}
        var optional = a.optional;
        if (optional === undefined){
            optional = {};
        }
        optional.sort_by_text = true;
        var dropdown = new ZCDropdown.dropdown(
            a.options,
            a.label,
            optional
        );
        var wrapper = dropdowns.get(a.name);
        wrapper.empty();
        dropdown.parent(wrapper);
        if (a.value === undefined){
            for (var option in a.options){
                a.value = option;
                // value defaults to the first option
                break;
            }
        }
        a.value = String(a.value);
        dropdown.value(a.value);
        if (a.action === undefined || a.action === null){
            a.action = function(){};
        }
        wrapper.find('a').on("click",
            function () {
                a.action(dropdown.value());
            });
        // only affects dropdowns that allow you to select multiple options
        wrapper.find('input[type=checkbox]').on("click",
            function () {
                a.action(dropdown.value());
            });
        this.objects[a.name] = dropdown;
        return wrapper;
    },
    get: function(name){
        var selector = dropdowns.selectors[name];
        if (selector === undefined){
            print('Error 4321');
            return; //should cause error
        }
        return season_pass_modal.$modal.find(selector);
    },
    active: function(name){
        // returns the active option
        var item = dropdowns.get(name);
        return item.find('a.active');
    },
    value: function(name){
        // returns the selected value
        var item = dropdowns.get(name);
        return item.find('input').val();
    },
    values: function(name, to_int){
        var dropdown = dropdowns.get(name);
        var checks = dropdown.find('.item-checkbox:checkbox:checked');
        var vals = [];
        for (var i = 0; i < checks.length; i++){
            var item = checks[i];
            var val = $(item).attr('value');
            if (to_int){
                vals.push(parseInt(val));
            }
            else{
                vals.push(val);
            }
        }
        return vals;
    },
    set_value: function(name, value){
        var object = dropdowns.objects[name].value(value);
    }
};

var tours = {
    //handles bootstarap tour stuff, for the first-time tutorial
    steps: {
        home: [
            {
                element: "#season-passes-content",
                title: "Subscriptions",
                content: 'Welcome to the Season Pass Manager. <br/><br/>We built this tool to make device subscription and renewal easy.',
                backdrop: true
            },
            {
                element: "#season-passes-content",
                title: "Season Passes",
                content: "Your subscription is divided up by calendar year (Jan-Dec).<br/><br/>For each year, you&#39;ll assign a Season Pass to your devices.",
                backdrop: true
            },
            {
                element: "#home-org-dropdown",
                title: "Switching Organizations",
                content: "If you manage multiple organizations, you can toggle between them here.",
                backdrop: true
            },
            {
                element: ".renew-all-group:first",
                title: "Renew All",
                content: "If you wish to renew all devices you manage, click that year.<br/>To undo, click again.<br/><br/>Try it now.",
                backdrop: true
            },
            {
                element: "#org-trees-wrapper",
                title: "Renewing Devices",
                content: "To renew a specific device, click the year to renew.<br/>To undo, click it again.",
                backdrop: true
            },
            {
                element: "#org-trees-wrapper",
                title: "Select A Renewal",
                content: "Please select 1 or more devices for renewal." +
                "<br/><br/>Don't worry, this wont save anything.",
                backdrop: true
            },
            {
                element: "#zc-modal-btn-accept",
                title: "Review Cart",
                content: "Next, click here to review your cart.",
                backdrop: true,
                autoscroll: true
            }
        ],
        buy: [
            {
                element: "#season-pass-cart",
                title: "Cart",
                content: "These Season Passes will renew the devices you just selected on the Assign tab.",
                backdrop: true
            },
            {
                element: "#cart-builder-toggle-button",
                title: "Advanced Options",
                content: "If you know exactly what you need to buy or wish to see prices, you can find them here.",
                backdrop: true
            },
            {
                element: "#zc-modal-btn-accept",
                title: "Submitting Order",
                content: "When you’re all set, you can proceed to checkout here.",
                backdrop: true,
                autoscroll: true,
            }
        ],
        voucher: [
            {
                element: "#voucher-season-passes-page",
                title: "Redeeming Vouchers",
                content: "If you pre-purchased Season Passes in the form of a voucher code, you can redeem them here.",
                backdrop: true
            }
        ],
        history: [
            {
                element: "#history-season-passes-page",
                title: "Order History",
                content: "After you submit an order or redeem a voucher, you can review the details here at any time.",
                backdrop: true
            }
        ],
        contact : [
            {
                element: "#contact-season-passes-page",
                title: "Contact Info",
                content: "Almost done!" +
                "<br/>We just need to make sure your contact info is up to date.",
                backdrop: true
            },
            {
                element: "#contact-season-passes-page",
                title: "Contact Info",
                content: 'Once it&#39;s up to date, click "Submit".<br/><br/>Submitting your order WILL save it.',
                backdrop: true,
            },
            {
                element: "#contact-season-passes-page",
                title: "End of Tutorial",
                content: 'That&#39;s it!<br/>You&#39;re ready to manage your ZENTRA Cloud subscription.',
                backdrop: true
            }
        ],
        confirmation: []
    },

    suppress: false,

    active : null,

    objects: {

    },

    reset: function(){
        // plays the tutorials again
        var pages = ['home', 'buy', 'voucher', 'history', 'contact'];
        for (var p in pages){
            var page = pages[p];
            window.localStorage.removeItem(page+'_current_step');
            window.localStorage.removeItem(page+'_end');
            var cookie_key = 'subscription_tour_' + page;
            $.removeCookie(cookie_key);
        }
        for (var name in tours.objects){
            delete tours.objects[name];
        }
        tours.start('home');
    },

    start: function(name){
        if (tours.suppress){
            return;
        }
        var cookie_key = 'subscription_tour_' + name;
        if ($.cookie(cookie_key) !== undefined){
            // we have already show this tour to this user. don't show it
            return;
        }
        // set a cookie to remember we've shown this tour to this user. Expires in 1000 days
        $.cookie(cookie_key, true, {expires: 1000});
        var objs = tours.objects;
        // if there is a different tour already active, end it
        for (var tour_name in objs){
            var tour_obj = objs[tour_name];
            if (tour_obj.ended()){
                // delete objs[tour_name];
            }
            else {
                tour_obj.end();
            }
        }
        var steps = tours.steps[name];
        if (tours.objects[name] !== undefined){
            return;
        }
        var tour = new Tour({
            steps:steps,
            name:name
            // Setting to repeat tour every time
            // storage: false
        });
        tour.init();
        tour.start();
        tours.objects[name] = tour;
    },

    next: function(){
        var obj = tours.active;
        if (obj == null){
            return;
        }
        obj.next();
    },

    close: function (){
        var obj = tours.active;
        if (obj === null){
            return;
        }
        obj.end();
        tours.active = null;
    }
};


function time(){
    var milli = (new Date()).getTime();
    return milli / 1000.0;
}


function enter(element, action, num){
    // adds an event listener for when the element is selected and the
    //  enter key is hit. Mostly used for text boxes.
    if (num === undefined){
        num = 13 //the enter key
    }
    element.bind('keydown', function(e){
        var key = e.which;
        if (key===num){
            action(e);
        }
    });
}

function hide_pages(){
    $buy_page.hide();
    $voucher_page.hide();
    $voucher_builder_page.hide();
    $home_page.hide();
    $history_page.hide();
    $confirmation_page.hide();
    $contact_page.hide();
    $req_page.hide();
    $account_page.hide();
    $loading_page.hide();
}

function active_tab(name, hide){
    if (hide === undefined){
        hide = false;
    }
    for (var tab_name in tabs){
        var tab = tabs[tab_name];
        tab.removeClass('active');
        if (hide){
            // hide all tabs
            tab.hide();
        }
        else{
            tab.show();
        }
    }
    tabs[name].addClass('active');
}

function dollars(amount){
    // gives back string in format '$1,234.56'
    if (amount == amount.toFixed(0)){
        // rounds to integer place no decimal
        var str = amount.toFixed(0);
        var comma_index = 3;
    }
    else {
        // rounds to 100ths place if decimal
        var str = amount.toFixed(2);
        var comma_index = 6;
    }
    if (amount > 1000){
        // we reverse because it is easier to say "X digits from the end" that way
        // We assume there will be only 1 comma
        // but getting an order for over $1M would be a good problem to have
        var r = str.split("").reverse().join("");
        var with_comma = r.substring(0, comma_index) + ',' + r.substring(comma_index);
        str = with_comma.split("").reverse().join("");
    }
    return '$'+str;
}

function change_modal_buttons(page){
    // controls the accept and cancel buttons at the bottom of the modal

    function assign_and_order(){
        var call1 = buy_actions.elements_order();
        var call2 = home_actions.submit_assignments();
    }

    function refresh(){
        populate_season_pass_modal(season_pass_modal);
    }

    function contact_or_assign(){
        if (is_empty(buy_cart)){
            // there is nothing to buy. If there are assignments, make them and then refresh modal.
            // If there are no assignments, error flash
            var call = home_actions.submit_assignments();
            if (call === null){
                modalErrorFlash('No changes to save');
            }
            else {
                // wait for the call to finish, then refresh
                $.when(call).then(function(){
                   refresh();
                });
            }
            return;
        }
        // there is something in the cart. Go to the contact page
        contact_actions.show_page();
    }

    var accept = season_pass_modal.accept_button;
    var cancel = season_pass_modal.cancel_button;
    var header = season_pass_modal.header;
    var words = translations[user_language];
    // describes the headers, accept, and cancel button on each of the modal's subpages
    var buttons = {
        home:{
            header: 'Subscription Manager',
            accept: {
                text: '', //set by refresh_accept_button
                title: null,
                action: buy_actions.show_page
            },
            cancel: null
        },
        voucher:{
            header: words.VOUCHERS,
            accept:{
                text: words.REDEEM,
                title: null,
                action: voucher_actions.redeem
            },
            cancel: null
        },
        buy: {
            header: words.CART,
            accept:{
                text: words.CHECKOUT,
                title: null,
                action: contact_or_assign
            },
            cancel: null
        },
        history: {
            header: words.HISTORY,
            accept: null,
            cancel: null
        },
        confirmation: {
            header: words.ORDER_SUBMITTED,
            accept:{
                text: words.OK,
                title: null,
                action: refresh
            },
            cancel: null
        },
        voucher_builder: {
            header: words.REQUEST_VOUCHER,
            accept:{
                text: words.GENERATE,
                title: null,
                action: voucher_builder_actions.request_voucher
            },
            cancel: null
        },
        contact: {
            header: words.CONTACT_INFO,
            accept: {
                text: words.SUBMIT,
                title: null,
                action: assign_and_order
            },
            cancel: {
                text: words.BACK,
                title: null,
                action: buy_actions.show_page
            }
        },
        req: {
            header: words.DEVICE_REQUIREMENTS,
            accept: {
                text: words.SAVE,
                title: null,
                action: req_actions.save_changes
            },
            cancel: {
                text: words.REFRESH,
                title: null,
                action: refresh
            }
        },
        account: {
            header: 'Billing Accounts',
            accept: {
                text: 'Save',
                title: null,
                action: account_actions.save_change
            },
            cancel: {
                text: 'Search',
                title: null,
                action: account_actions.search
            }
        },
        loading: {
            header: words.PROCESSING_ORDER,
            accept: null,
            cancel: null
        },
        trial_or_buy: {
            header: words.CART,
            accept:{
                text: words.CHECKOUT,
                title: null,
                action: contact_or_assign
            },
            cancel:{
                text: "Activate 30 Day Trial", // superuser only feature
                title: null,
                action: trial_actions.activate_trial
            },
        },
        trial_confirmation: {
            header: "Trial Activated",
            accept:{
                text: words.OK,
                title: null,
                action: refresh
            },
            cancel: null
        },
        trial_loading: {
            header: "Processing Trial Request",
            accept: null,
            cancel: null
        }
    };

    var header_string = buttons[page].header;
    header.text(header_string);
    var av = buttons[page].accept;
    var cv = buttons[page].cancel;
    if (cv == null){
        cancel.hide();
    }
    else{
        cancel.show();
        cancel.off();
        cancel.click(cv.action);
        cancel.text(cv.text);
        cancel.attr('title', cv.title);
    }

    if (av == null){
        accept.hide();
    }
    else{
        accept.show();
        accept.off();
        accept.click(av.action);
        accept.text(av.text);
        accept.attr('title', av.title);
    }
}

function name_and_sn(device){
    // formats the device name and SN in a readable way
    if (device.name !== device.sn){
        return device.name + ' (' + device.sn+')';
    }
    return device.sn
}

function add_words(item){
    var words = translations[user_language];
    var with_words = $.extend({}, item, words);
    return with_words;
}

var home = {
    /* passes and devices are sub-objects of orgs.
    They exist to make looking up passes by org and type and devices by id easier */
    passes: {}, //org_id: { part_num: [{stuff
    devices: {},
    // used to lookup device on requirements tab
    devices_by_sn: {},
    years: [],
    // This is the object used to represent the state of the web page.
    // The relevant section is re-rendered when changes are made
    orgs: [],
    pass_types: {}, //part_num : { cost, start, end, type, allowed
    // an easy way to check what we are currently showing vs hiding
    active_org: null,
    show_all_years: false
};

var home_actions = {

    show_page: function(){
        hide_pages();
        $home_page.show();
        active_tab('home');
        change_modal_buttons('home');
        tours.start('home');
        // if the active org was changed in requirements, show that one
        dropdowns.set_value('home_org', home.active_org);
        home_actions.refresh_accept_button();
    },

    show_all_years: function(){
        // display all years we have passes for and refresh modal
        years_to_show = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
        home.show_all_years = true;
        populate_season_pass_modal(season_pass_modal, null, home.active_org);
    },

    show_fewer_years: function(){
        // display smaller number of years for and refresh modal
        years_to_show = [2019, 2020, 2021];
        home.show_all_years = false;
        populate_season_pass_modal(season_pass_modal, null, home.active_org);
    },

    build_page: function(orgs){
        // Converts the object the represents the tab into rendered HTML
        var page_template = $templates.find(
            '#season-passes-home-page-template').html();
        var args = {
            show_all_years: home.show_all_years,
            orgs: orgs
        };
        args = add_words(args);
        var home_page = Mustache.to_html(page_template, args);
        return home_page;
    },

    show_org_body: function(org_id){
        if (org_id === undefined){
            org_id = home.active_org;
        }
        home.active_org = org_id;
        home_actions.refresh_org(org_id);
    },

    remove_all_devices_year: function(year, org_id){
        /* for all devices for a particular org, remove all queued passes for the given year */
        for (var did in home.devices){
            var device = home.devices[did];
            if (device.org_id === org_id){
                home_actions.remove_device_year(did, year);
            }
        }
        for (var index in home.orgs){
            var org = home.orgs[index];
            if (org.id === org_id){
                for (var yindex in org.years){
                    var y = org.years[yindex];
                    if (y.year === year){
                        y.on = false;
                    }
                }
                home_actions.refresh_org(org.id);
            }
        }
    },

    remove_device_year: function(did, year){
        // removes all queued passes for the given device and year
        var device = home.devices[did];
        var org_id = device.org_id;
        for (var part_num in device.parts){
            var part_status = device.parts[part_num];
            var part = home.pass_types[part_num];
            var has_part = ((part_status!==true) && (part_status!==false) && (part_status!==null));
            var right_year = (part.start.getUTCFullYear() === year);
            if (has_part && right_year){
                home_actions.remove_from_device(org_id, part_num, did, false);
            }
        }
    },

    add_all_devices_year: function(year, org_id){
        /* For all devices in an org, queue all passes that they require and do not have for that year */
        for (var did in home.devices){
            var device = home.devices[did];
            if (device.org_id === org_id){
                home_actions.add_to_device_year(did, year);
            }
        }
        for (var index in home.orgs){
            var org = home.orgs[index];
            if (org.id === org_id){
                for (var yindex in org.years){
                    var y = org.years[yindex];
                    if (y.year === year){
                        y.on = true;
                    }
                }
                home_actions.refresh_org(org.id);
            }
        }
    },

    add_to_device_year: function(did, year){
        // queue a device with all required passes for certain year
        var device = home.devices[did];
        var org_id = device.org_id;
        var reqs = device.requirements;
        for (var part_num in device.parts){
            if (!has(reqs, part_num)) {
                continue;
            }
            var has_part = device.parts[part_num];
            var part = home.pass_types[part_num];
            if (year !== part.start.getUTCFullYear()){
                continue;
            }
            if (has_part === false){
                home_actions.add_to_device(org_id, part_num, did, false);
            }
        }
    },

    add_to_device: function(org_id, part_num, did, refresh){
        if (refresh === undefined){
            refresh = true;
        }
        // check for credits to use
        var device = home.devices[did];
        var passes = home.passes[org_id][part_num];
        for (var index in passes){
            var pass = passes[index];
            if (pass.device === null) {
                pass.device = device;
                device.parts[part_num] = pass;
                home_actions.refresh_org(org_id);
                return;
            }
        }
        // since there are no valid credits that the organization owns,
        //   we will add the requested pass to the cart
        buy_actions.add_to_device(org_id, device, part_num);
        if (refresh){
            home_actions.refresh_org(org_id);
        }
    },

    remove_from_device: function(org_id, part_num, did, refresh){
        function move_rest(org_id, part_num){
            // look for any devices in the cart that could use the credit
            //  that just became available, rather than buying a new one
            if (buy_cart[org_id] === undefined){
                return;
            }
            var devices = buy_cart[org_id].devices;
            for (var did in devices){
                // var parts = devices[did];
                var device = home.devices[did];
                var parts = device.parts;
                if (parts[part_num] === 'cart'){
                    // the device has a pass of the right type in the cart.
                    // Switch it to the just-released credit.
                    buy_actions.remove_from_device(org_id, device, part_num);
                    home_actions.add_to_device(org_id, part_num, did, false);
                    break;
                }
            }
        }
        // print('Removing: ', org_id, ' | ', part_num, ' | ', did);

        var device = home.devices[did];
        var pass_type = home.pass_types[part_num];
        var pass = device.parts[part_num];

        if (refresh === undefined){
            refresh = true;
        }

        if (pass == null){
            // shouldnt happen
        }
        else if (pass === 'cart'){
            buy_actions.remove_from_device(org_id, device, part_num);
        }
        pass.device = null;
        device.parts[part_num] = false;
        move_rest(org_id, part_num);
        if (refresh){
            home_actions.refresh_org(org_id);
        }
    },

    submit_assignments: function(){
        // saves pass credit assignments with server
        function build_json(){
            var json = {assign: [], order:[]};
            for (var did in home.devices){
                var device = home.devices[did];
                for (var part_num in device.parts){
                    var pass = device.parts[part_num];
                    if (pass === true){
                        // has a pass already saved to it
                    }
                    else if ((pass === false) || (pass === null)){
                        // does not have pass saved or queued
                    }
                    else if (pass === 'cart'){
                        json.order.push({
                            did:did,
                            part_num:part_num
                        })
                        // not an assignment. There is a purchase queued
                    }
                    else {
                        // new assignment. Add to json
                        json.assign.push({
                            pass_id: pass.id,
                            did: device.did
                        });
                    }
                }
            }
            return json;
        }

        var json = build_json();

        if ((json.assign.length === 0)){
            // modalErrorFlash('No changes to save.');
            return null;
        }

        var order = json.order;
        var assign = json.assign;

        modalSuccessFlash('Saving changes...');
        // var $active = $org_bodies.not(':hidden');
        // var org_id = $active.data('id');
        var call = $.ajax({
            url: '/api/1.0/season_passes/',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(json),
            success: function (response) {
                modalSuccessFlash('Saved successfully');
                // populate_season_pass_modal(season_pass_modal, 'home', org_id);
                },
            error: function(arg1, arg2){
                modalErrorFlash('Unexpected error occurred.');
            }
        });
        return call;
    },

    refresh_org: function(org_id){
        /* Changes may have been made to this org. Re-render what it looks like */
        var $tree_wrapper = $home_page.find('#org-trees-wrapper');
        var $credit_wrapper = $home_page.find('#pass-counter-wrapper');
        var org = null;
        for (var index in home.orgs){
            var current = home.orgs[index];
            if (current.id == org_id){
                org = current;
            }
        }
        if (org === null){
            print('Couldnt find org : ', org_id);
            // return;
        }
        var new_content = this.render_org_body(org);
        var new_counter = this.render_unassigned(org_id);
        $tree_wrapper.empty();
        $tree_wrapper.append(new_content);
        $credit_wrapper.empty();
        $credit_wrapper.append(new_counter);
        home_actions.refresh_accept_button();
    },

    render_unassigned: function(org_id){
        // builds the counter of available pass credits for each org
        var unassigned_template = $templates.find(
            '#unassigned-season-passes-template').html();
        var org_passes = home.passes[org_id];
        var type_counts = [];
        for (var part_num in home.pass_types) {
            var type = home.pass_types[part_num];
            var part_name = type.name;
            var passes = org_passes[part_num];
            if (passes.length === 0){
                // If this org has no passes of a particular type, don't show that type
                continue;
            }
            var count = 0;
            for (var index in passes){
                var pass = passes[index];
                // if a pass is not currently queued with a device, it gets counted as available
                if (pass.device === null){
                    count++;
                }
            }
            type_counts.push({
                part_num: part_num,
                text: part_name,
                count: count
            })
        }
        var has_any = (type_counts.length > 0);
        var args = add_words({types:type_counts, org_id:org_id, has_any:has_any});
        var rendered = Mustache.to_html(unassigned_template,
            args);
        return rendered;
    },

    render_org_body: function(org){
        // contructs HTML to represent the given org
        function render_farms(farms, org_id){
            function render_sections(sections, org_id){
                function render_devices(devices, org_id){
                    function render_buttons(parts, org_id, did){
                        function sorted_list(parts){
                            // all the different parts sorted by starting date
                            var part_list = [];
                            for (var part_num in parts){
                                var part = parts[part_num];
                                part_list.push([part_num, part]);
                            }
                            part_list.sort(function(a,b){
                                var part_num1 = a[0];
                                var part_num2 = b[0];
                                var start1 = home.pass_types[part_num1].start;
                                var start2 = home.pass_types[part_num2].start;
                                return start1.getUTCFullYear() > start2.getUTCFullYear();
                            });
                            return part_list
                        }
                        var button_template = $templates.find(
                            '#device-button-template').html();
                        var part_list = sorted_list(parts);
                        var years = {};
                        for (var index in part_list) {
                            var part_num = part_list[index][0];
                            var pass = part_list[index][1];
                            var pass_type = home.pass_types[part_num];
                            var year = pass_type.start.getUTCFullYear();
                            if (years_to_show.indexOf(year) === -1){
                                // we're not supposed to show this. Skip.
                                continue;
                            }
                            if (years[year] === undefined){
                                years[year] = true;
                            }
                            if (pass === true){}
                            else if (pass === false){
                                years[year] = false;
                            }
                            else if (pass === null){}
                            else if (years[year] !== false){
                                // has credit or cart queued.
                                years[year] = 'remove'
                            }
                            else {}
                        }
                        var buttons = [];
                        for (var year in years){
                            var satisfied = years[year];
                            var args = {
                                year:year,
                                did:did,
                                org_id:org_id};
                            if (satisfied === true){
                                args.satisfied = true;
                            }
                            else if (satisfied === 'remove'){
                                args.remove = true;
                            }
                            else {
                                args.add = true;
                            }
                            args = add_words(args);
                            var rendered = Mustache.to_html(
                                button_template, args);
                            buttons.push(rendered);
                        }
                        return buttons;
                    }
                    var rendered_devices = [];
                    var device_template = $templates.find(
                        '#device-season-passes-template').html();
                    for (var d_index in devices){
                        var device = devices[d_index];
                        device.buttons = render_buttons(
                            device.parts, org_id, device.did);
                        var args = add_words(device);
                        var rendered_device = Mustache.to_html(device_template,
                            args);
                        rendered_devices.push(rendered_device);
                    }
                    return rendered_devices
                }

                function is_collapsed(id){
                    if ($home_page === undefined){
                        return false;
                    }
                    var selector = '#section-body-'+id;
                    var body_element = $org_bodies.find(selector);
                    if (body_element.size() === 0){
                        // not able to find the body, probably because this is the first time we show it
                        // default to having it open
                        var open = true;
                    }
                    else {
                        var open = body_element.hasClass('in');
                    }
                    return !open;
                }

                var rendered_sections = [];
                var section_template = $templates.find(
                    '#section-season-passes-template').html();
                for (var s_index in sections){
                    var section = sections[s_index];
                    var devices = section.devices;
                    // maintain the collapse state it currently has
                    if (is_collapsed(section.id)){
                        section.in = '';
                    }
                    else{
                        section.in = ' in';
                    }
                    section.rendered_devices = render_devices(devices, org_id);
                    var args = add_words(section);
                    var rendered_section = Mustache.to_html(section_template, args);
                    rendered_sections.push(rendered_section);
                }
                return rendered_sections
            }
            var rendered_farms = [];
            var farm_template = $templates.find(
                '#farm-season-passes-template').html();
            for (var f_index in farms) {
                var farm = farms[f_index];
                var sections = farm.sections;
                farm.rendered_sections = render_sections(sections, org_id);
                var args = add_words(farm);
                var rendered_farm = Mustache.to_html(farm_template, args);
                rendered_farms.push(rendered_farm);
            }
            return rendered_farms
        }

        var org_template = $templates.find(
            '#organization-season-passes-template').html();
        var org_id = org.id;
        var farms = org.farms;
        org.rendered_farms = render_farms(farms, org_id);
        var args = add_words(org);
        var rendered_org = Mustache.to_html(org_template, args);
        return rendered_org;
    },

    refresh_accept_button: function () {
        // Adds quantity of changes queued to the modal's accept button
        var btn = season_pass_modal.accept_button;
        // btn.empty()
        var count = 0;
        for (var did in home.devices){
            var device = home.devices[did];
            for (var p_index in device.parts ){
                var part = device.parts[p_index];
                // not a credit or in cart
                if ((part === true) || (part === false) || (part === null)){

                }
                else {
                    count += 1;
                }
            }
        }
        if (count === 0){
            btn.text('Review');
        }
        else {
            btn.text('Review ('+count+')');
        }
    },

    is_tax_exempt: function(org_id) {
        org_id = parseInt(org_id);
        for (var i in home.orgs){
            var org = home.orgs[i];
            if (org.id === org_id){
                return org.tax_exempt;
            }
        }
    }
};

var voucher = {
    // this describes the state of the voucher page
    code:null,
    left: null,
    part_num: null,
    passes: [],
    credits: {
        //org_id: {quantity, name}
    },
    devices: {
        // did: true
    }
};

var voucher_actions = {
    // Functions that are called from the voucher page
    show_page: function(){
        hide_pages();
        $voucher_page.show();
        active_tab('voucher');
        change_modal_buttons('voucher');
        // voucher_actions.build_options();
        tours.start('voucher');
    },

    update_description_section: function(){
        var left = voucher.left;
        var passes = voucher.passes;
        var part_num = voucher.part_num;
        var description = $voucher_page.find('#voucher-description');
        description.empty();
        if (is_empty(passes)){
            var part_name = null;
            description.hide();
        }
        else {
            var type = home.pass_types[part_num];
            var part_name = type.name;
            description.show();
        }
        var description_template = $templates.find(
            '#voucher-description-template').html();
        var args = {
            part_name:part_name,
            max:passes.length,
            left:left
        };
        args = add_words(args);
        var rendered_section = Mustache.to_html(
            description_template, args);
        var orgs = {};
        for (var i in home.orgs){
            var org = home.orgs[i];
            orgs[org.id] = org.name;
        }
        description.append(rendered_section);
        // voucher_actions.update_dropdown_quantites();
    },

    build_options: function(){
        // builds the option list to attach passes for a voucher to devices/sites
        var $wrapper = $voucher_page.find("#voucher-cart-builder");
        var template = $templates.find('#voucher-device-tree').html();
        var org_ids = dropdowns.values('voucher_org', true);
        var org_dicts = {};
        for (var org_index in home.orgs){
            var org = home.orgs[org_index];
            if (org_ids.includes(org.id)){
                org_dicts[org.id] = org;
            }
        }
        var part_num = voucher.part_num;
        var devices_by_org = [];
        for (var org_id in org_dicts){
            var org = org_dicts[org_id];
            var farms = org.farms;
            var devices_to_show = [];
            for (var farm_index in farms){
                var farm = farms[farm_index];
                var sections = farm.sections;
                for (var section_index in sections){
                    var section = sections[section_index];
                    var devices = section.devices;
                    for (var device_index in devices){
                        var device = devices[device_index];
                        var status = device.parts[part_num];
                        var needs = !([true, null, undefined].includes(status));
                        if (needs){
                            // this device requires this pass type and does not have it yet
                            devices_to_show.push(device)
                        }
                    }
                }
            }
            devices_by_org.push({
                name: org.name,
                id: org.id,
                devices: devices_to_show
            });
        }
        var rendered = Mustache.to_html(template, {orgs:devices_by_org});
        $wrapper.empty().append(rendered);
        $voucher_page.find('#voucher-org-dropdown').show();
        $wrapper.show();
        voucher_actions.update_dropdown_quantites();
        devices = voucher.devices;
        for (var did in devices){
            // highlight the device buttons which should be
            var $button = $voucher_page.find('#voucher-device-'+did);
            $button.removeClass('add');
        }
    },

    hide_sections: function(){
        $voucher_page.find('#voucher-org-dropdown').hide();
        $voucher_page.find('#voucher-cart-builder').hide();
    },

    blank_org_dropdown: function(){
        // unchecks all boxes in the dropdown, to reset it to a blank state
        var dropdown = dropdowns.get('voucher_org');
        var checks = dropdown.find('.item-checkbox:checkbox:checked');
        checks.prop('checked', false);
    },

    check_code: function() {
        // check if the voucher code that the user entered is valid.
        // update the page with relevant info if it is
        var input_text = $voucher_page.find('#voucher-code-input')[0].value;

        if (input_text === '') {
            voucher = {
                code: null,
                left: null,
                passes: [],
                credits: {},
                devices: {}
            };
            voucher_actions.update_description_section();
            voucher_actions.hide_sections();
        }
        else {
            $.ajax({
                url: '/api/1.0/redeem_voucher/',
                type: 'get',
                contentType: 'application/json',
                data: {code: input_text},
                success: function (response) {
                    // valid code
                    var passes = response.items;
                    var part_num = passes[0];
                    voucher.code = input_text;
                    voucher.part_num = part_num;
                    voucher.passes = passes;
                    voucher.left = passes.length;
                    voucher = {
                        code:input_text,
                        left: passes.length,
                        part_num: part_num,
                        passes: passes,
                        credits: {},
                        devices: {}
                    };
                    voucher_actions.update_description_section();
                    voucher_actions.blank_org_dropdown();
                    voucher_actions.build_options();
                    history_actions.refresh();
                },
                error: function (arg1, arg2) {
                    // invalid code, already redeemed, or server error
                    voucher = {
                        code: null,
                        left: null,
                        passes: [],
                        credits: {},
                        devices: {}
                    };
                    voucher_actions.update_description_section();
                    voucher_actions.hide_sections();
                    var resp = arg1.responseJSON;
                    var text = 'Voucher not found';
                    if ((resp) && (resp.message)){
                        text = resp.message;
                    }
                    modalErrorFlash(text);
                }
            });
        }
    },

    toggle_pass: function(did){
        var device = home.devices[did];
        if (voucher.devices[did] !== undefined){
            voucher_actions.remove_pass(device);
        }
        else{
            voucher_actions.add_pass(device);
        }
        voucher_actions.update_description_section();
        voucher_actions.update_dropdown_quantites();
    },

    add_pass: function(device){
        if (voucher.left === 0){
            modalErrorFlash('No remaining passes');
            var $check = $voucher_page.find("#voucher-checkbox-"+device.did);
            // since checking the box is not allowed, uncheck it
            $check.prop('checked', false);
            return;
        }
        voucher.devices[device.did] = true;
        voucher.left -= 1;
        var $button = $voucher_page.find('#voucher-device-'+device.did);
        $button.removeClass('add');
    },

    remove_pass: function(device){
        delete voucher.devices[device.did];
        voucher.left += 1;
        var $button = $voucher_page.find('#voucher-device-'+device.did);
        $button.addClass('add');
    },

    queue_credits: function(quant, org_id){
        quant = parseInt(quant);
        var credits = voucher.credits;
        if (credits[org_id] === undefined){
            var before = 0;
        }
        else{
            var before = credits[org_id];
        }
        var num_added = quant - before;
        if (num_added > voucher.left){
            modalErrorFlash('Not enough remaining passes');
            return;
        }
        credits[org_id] = quant;
        if (quant === 0){
            delete credits[org_id];
        }
        voucher.left -= num_added;
        voucher_actions.update_description_section();
        voucher_actions.update_dropdown_quantites();
    },

    update_dropdown_quantites: function(){
        function make_dropdown(choices, wrapper, start_val, org_id){
            var optional= {sort_by_text: true};
            var dropdown = new ZCDropdown.dropdown(
                choices,
                optional
            );
            start_val = String(start_val);
            dropdown.value(start_val);
            wrapper.empty();
            dropdown.parent(wrapper);
            wrapper.find('a').on("click", function () {
                voucher_actions.queue_credits(dropdown.value(), org_id);
            });
        }
        var left = voucher.left;
        var credits = voucher.credits;
        var org_ids = dropdowns.values('voucher_org');
        for (var i in org_ids){
            var org_id = org_ids[i];
            if (credits[org_id] === undefined){
                var quant = 0;
            }
            else{
                var quant = credits[org_id];
            }
            var choices = [];
            var max_choice = left + quant;
            for (var num = 0; num <= max_choice; num++){
                choices.push(num);
            }
            var wrapper = $voucher_page.find('#credit-quantity-'+org_id);
            make_dropdown(choices, wrapper, quant, org_id);
        }
    },

    redeem: function(){
        var data = voucher;
        if (is_empty(voucher.passes)){
            modalErrorFlash('No valid voucher to redeem');
        }
        else if (voucher.left < 0){
            modalErrorFlash("Invalid quantity");
        }
        else if (voucher.left === voucher.passes.length){
            modalErrorFlash("Must redeem at least 1 Season Pass");
        }
        else{
            modalSuccessFlash('Submitting...');
            $.ajax({
                url: '/api/1.0/redeem_voucher/',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (response) {
                    modalSuccessFlash('Redeemed voucher');
                    voucher = {
                        code: null,
                        left: null,
                        passes: [],
                        redeem: {}
                    };
                    populate_season_pass_modal(season_pass_modal);
                },
                error: function (arg1, arg2){
                    modalErrorFlash('Error while redeeming');
                },
                always: function(data, text_status, error_thrown){
                    // makes the session visible in LogRocket for review
                    LogRocket.log('Voucher redemption event');
                }
            });
        }
    },

    use_voucher: function(code){
        // triggered from the history page. User wants to use the rest of
        // the passes for a partially redeemed voucher
        voucher_actions.show_page();
        $voucher_page.find('#voucher-code-input').val(code);
        voucher_actions.check_code();
    }
};

// this describes the state of the buy page
var buy_cart = {}; // org_id:{name, parts, devices

var buy_actions = {
    // Functions that are called from the buy page
    show_page: function(){
        hide_pages();
        $buy_page.show();
        active_tab('buy');
        if (is_superuser) {
            change_modal_buttons('trial_or_buy');
        }
        else {
            change_modal_buttons('buy');
        }
        buy_actions.refresh_cart();
        tours.start('buy');
    },

    add_to_device: function(org_id, device, part_num) {
        /* add a part to the cart, which will be attached to the given
        device when ordered */
        var org;
        for (var o_index in home.orgs){
            if (home.orgs[o_index].id == org_id){
                org = home.orgs[o_index];
                break;
            }
        }
        if (org.m3_id === null){
            modalErrorFlash("Can't buy for this site right now");
            return;
        }
        if (buy_cart[org_id] === undefined){
            var name = org_names[org_id];
            buy_cart[org_id] = {
                name: name,
                parts: {},
                devices: {}
            }
        }
        var devices = buy_cart[org_id].devices;
        var did = device.did;
        if (devices[did] === undefined){
            devices[did] = {};
        }
        devices[did][part_num] = true;
        device.parts[part_num] = 'cart';
        return true;
    },

    remove_from_device: function(org_id, device, part_num){
        var devices = buy_cart[org_id].devices;
        var parts = buy_cart[org_id].parts;
        var did = device.did;
        delete devices[did][part_num];
        // if we just deleted the last part
        if (is_empty(devices[did])){
            delete devices[did];
        }
        if (is_empty(devices) && is_empty(parts)){
            delete buy_cart[org_id];
        }
        device.parts[part_num] = false;
        return true;
    },

    refresh_cart: function(){
        // after a change to the buy_cart object, re-render the UI of the cart
        // var discount_template = $templates.find(
        //     '#buy-cart-discount-template').html();
        var cart = $buy_page.find('#buy-cart-body');
        var cart_footer = $buy_page.find('#cart-footer');
        cart.empty();
        devices_in_cart = [];
        var cart_item_template = $templates.find(
            '#buy-cart-item-template').html();
        var discount_template = $templates.find(
            '#buy-cart-discount-template').html();
        var total = 0;
        var credits = 0;
        // keep track of quantities for bulk discounts
        var pass_counts = {};
        for (var part_num in home.pass_types){
            pass_counts[part_num] = 0;
        }
        var parts_2019 = ['50095', '50103', '50104', '50105', '50106'];
        for (var o_index in home.orgs){
            // var devices = org.devices;
            var org = home.orgs[o_index];
            var org_id = org.id;
            var device_dicts = [];
            for (var did in org.devices){
                var device = org.devices[did];
                var parts = device.parts;
                var items = [];
                if (['cart', true].includes(parts[50097])){
                    // If they are buying/have bought 2020, they get 2019 for free, so add it to the cart
                    for (var p_index in parts_2019){
                        var part_num = parts_2019[p_index];
                        if (parts[part_num] === false){
                            buy_actions.add_to_device(org_id, device, part_num);
                        }
                    }
                }
                for (var part_num in parts){
                    var type = home.pass_types[part_num];
                    var has_part = parts[part_num];
                    if ([true, false, null].includes(has_part)){
                        continue;
                    }
                    if (parts_2019.includes(part_num) &&
                        [true, 'cart'].includes(parts[50097])){
                        // If they are buying/have bought 2020, they get 2019 for free
                        var cost = '$0 (Free with 2020)';
                    }
                    else if (has_part === 'cart'){
                        pass_counts[part_num] += 1;
                        var cost = dollars(type.cost);
                        total += type.cost;
                    }
                    else if (typeof has_part === 'object'){
                        // using a credit
                        credits += 1;
                        var cost = '$0 (credit)';
                    }
                    else{
                        //should never happen
                    }
                    items.push({
                        part_name: type.name,
                        subtotal: cost,
                        part_num: part_num
                    });
                }
                if (items.length > 0){
                    device_dicts.push({
                        device_name:device.pretty_name,
                        sn: device.sn,
                        did: device.did,
                        items: items
                    });
                    devices_in_cart.push(did) ;
                }
            }
            if (is_empty(device_dicts)){
                // The org has nothing in the cart and no credit
                // assignments. Skip it.
                continue;
            }
            var args = {
                org_id:org_id,
                org_name: org.name,
                devices:device_dicts
            };
            args = add_words(args);
            var rendered_item = Mustache.to_html(cart_item_template, args);
            cart.append(rendered_item);
        }
        if ((credits === 0) && is_empty(buy_cart)){
            var phrase = translations[user_language].CART_IS_EMPTY;
            cart.append(phrase);
        }
        var first_discount = true;
        // will be used for bulk discounts, but not right now
        for (var part_num in pass_counts) {
            var count = pass_counts[part_num];
            var type = home.pass_types[part_num];
            var total_price = type.cost * count;
            for (var index in bulk_discounts) {
                var val = bulk_discounts[index];
                var min = val[0];
                var max = val[1];
                var percent = val[2];
                if (percent === 0) {
                    continue;
                }
                var decimal = percent / 100.0;
                var meets_min = (count >= min);
                var meets_max = ((max === null) || (count <= max));
                if (meets_min && meets_max) {
                    if (first_discount) {
                        // want this in front of the first discount item, if any
                        cart.append('<div class="row buy-cart-org"><b>Bulk Discounts</b></div>');
                        first_discount = false;
                    }

                    var discount_amount = total_price * decimal;
                    total -= discount_amount;
                    var args = {
                        text: type.name,
                        percent: percent,
                        amount: dollars(discount_amount),
                        quantity: count
                    };
                    args = add_words(args);
                    var rendered = Mustache.to_html(discount_template, args);
                    cart.append(rendered);
                    break;
                }
            }
        }
        var $total = $buy_page.find('#buy-cart-total');
        $total.text(dollars(total)+' USD');
        contact_actions.update_tax_amount();
        cart_subtotal = total;
        return total;
    },

    elements_order: function() {
        var payment_method = dropdowns.value('payment_methods');
        if (payment_method === '1') {
            modalSuccessFlash('Checking card info.');
            // gets a token to charge their card into our account
            stripe.createToken(card).then(function (result) {
                if (result.error) {
                    // Inform the user if there was an error.
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                    return null;
                }
                // Send the token to your server.
                var token = result.token.id;
                buy_actions.place_order(token);
            });
        }
        else {
            buy_actions.place_order(null);
        }
    },

    place_order: function(token) {
        // submits queued changes to server
        function build_order_json() {
            var json = {};
            for (var org_id in buy_cart) {
                var org = buy_cart[org_id];
                var parts = {};
                for (var part_num in org.parts) {
                    var quantity = org.parts[part_num].quantity;
                    parts[part_num] = quantity;
                }
                var devices = {};
                for (var did in org.devices) {
                    devices[did] = [];
                    var parts_for_device = org.devices[did];
                    for (var part_num in parts_for_device) {
                        devices[did].push(part_num);
                    }
                }
                json[org_id] = {
                    parts: parts,
                    devices: devices
                }
            }
            return {order: json};
        }

        // submit the order to the server
        var json = build_order_json();
        if (is_empty(json.order)) {
            modalErrorFlash('Cart is empty.');
            return null;
        }
        // gets a token to charge their card into our account
        //     print(result);
        // print('token : ', token);
        json.token = token;
        var contact = contact_actions.build_json();
        if (contact === false) {
            return false;
        }
        /* since this call can take awhile, we disable the buttons while
         we make it, to stop the user from sending other api calls or
         clicking it repeatedly */
        var accept = season_pass_modal.accept_button;
        var cancel = season_pass_modal.cancel_button;
        accept.prop('disabled', true);
        cancel.prop('disabled', true);
        json.contact = contact;
        modalSuccessFlash("Submitting order. This may take a minute.");
        loading.show_page();
        var call = $.ajax({
            url: '/api/1.0/order_passes/',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(json),
            success: function (response) {
                accept.prop('disabled', false);
                cancel.prop('disabled', false);
                var success = response.success;
                var message = response.message;
                var status = response.status;
                if (success) {
                    buy_cart = {};
                    var order_id = response.order_id;
                    var salesforce_id = response.salesforce_id;
                    var email = response.email;
                    var cc_order = response.is_cc_order;
                    modalSuccessFlash("Order submitted successfully");
                    confirmation_actions.confirmation_message(
                        order_id, salesforce_id, email, cc_order);
                }
                else {
                    contact_actions.show_page();
                    modalErrorFlash(message);
                }

            },
            error: function (jqXHR, exception) {
                contact_actions.show_page();
                accept.prop('disabled', false);
                cancel.prop('disabled', false);
                var status = jqXHR.status;
                var text = jqXHR.responseJSON.message;
                // times out after 20 seconds;
                modalErrorFlash(text, 20);
            },
            always: function(){
                // makes the session visible in LogRocket for review
                Logrocket.log('Attempted to place order');
            }
        });
        return call;
    }
};

var history_actions = {
    show_page: function(){
        hide_pages();
        $history_page.show();
        active_tab('history');
        change_modal_buttons('history');
        this.update_buttons();
        tours.start('history');
    },

    collapse_all: function(selector){
        var bodies = $history_page.find(selector).find('.history-body');
        bodies.collapse('hide');
        history_actions.update_buttons();
    },

    expand_all: function(selector){
        var bodies = $history_page.find(selector).find('.history-body');
        bodies.collapse('show');
        history_actions.update_buttons();
    },

    update_buttons: function(){
        var section_selectors = ['#history-orders', '#history-vouchers'];
        for (var s_index in section_selectors){
            var selector = section_selectors[s_index];
            var section = $history_page.find(selector);
            var big_button = section.find('.toggle-all-button');
            var big_icon = big_button.find('.toggle-icon');
            var items = section.find('.history-item');
            var bodies = items.find('.history-body');
            var num = items.length;
            var open = bodies.filter("[aria-expanded*='true']");
            var num_open = open.length;
            if (num_open === num){
                // If all sections are open, the big button is expand all
                var action = 'history_actions.collapse_all("'+selector+'");';
                big_button.attr('onclick', action);
                big_icon.addClass('rotate');
            }
            else {
                // at least 1 section is collapsed. The big button is expand all
                var action = 'history_actions.expand_all("'+selector+'");';
                big_button.attr('onclick', action);
                big_icon.removeClass('rotate');
            }
            for (var i = 0; i < num; i++){
                var item = items[i];
                item = $(item);
                var button = item.find('.toggle-button');
                var icon = button.find('.toggle-icon');
                var body = item.find('.history-body');
                // No idea why this works. Black magic I found on Google.
                var status = body.filter("[aria-expanded*='true']").length;
                if (status === 0){
                    // closed
                    icon.removeClass('rotate');
                }
                else {
                    // open
                    icon.addClass('rotate');
                }
            }
        }
    },

    refresh: function(){
        var ro = this.render_orders;
        var rv = this.render_vouchers;
        $history_page.empty();
        $.ajax({
            url: '/api/1.0/season_pass_history/',
            type: 'get',
            contentType: 'application/json',
            data: {},
            success: function(response){
                $history_page.empty();
                var page_template = $templates.find(
                '#history-page-template').html();
                var orders = response.orders;
                var vouchers = response.vouchers;
                var rendered_orders = ro(orders);
                var rendered_vouchers = rv(vouchers);
                var args = {
                    orders: rendered_orders,
                    vouchers: rendered_vouchers
                };
                args = add_words(args);
                var rendered_page = Mustache.to_html(page_template, args);
                $history_page.append(rendered_page);
            }
        });
    },

    render_vouchers: function(vouchers){
        // build the HTML for the voucher part of history tab
        var rendered_vouchers = [];
        var template = $templates.find('#history-voucher-template').html();
        for (var index in vouchers){
            var voucher = vouchers[index];
            var passes = voucher.passes;
            var code = voucher.code;
            var created = voucher.created;
            var redeemed = voucher.redeemed;
            var num_unredeemed = 0;
            var first = passes[0];
            if (first === undefined){
                // should only happen if you monkey with the database
                continue;
            }
            // Right now, we assume that each voucher only has one type of pass
            var part_num = first.type;
            var type = home.pass_types[part_num];
            var type_text = type.name;
            var orgs = {};
            for (var p_index in passes){
                var pass = passes[p_index];
                var org_id = pass.owner;
                var device_id = pass.device;
                var redemption_id = pass.redemption;
                if (redemption_id === null){
                    num_unredeemed ++;
                    continue;
                }
                if (device_id !== null){
                    // the device has been attached to a device
                    var device = home.devices[device_id];
                    if (device === undefined){
                        // The device was moved to an organization this user cant see
                        var d_name = 'Hidden device';
                    }
                    else {
                        var d_name = device.pretty_name;
                    }
                }
                else{
                    var d_name = null;
                }
                if (orgs[org_id] === undefined){
                    orgs[org_id] = [];
                }
                orgs[org_id].push(d_name);
            }
            var org_list =[];
            for (var org_id in orgs){
                var name = null;
                var d_names = orgs[org_id];
                var count = d_names.length;
                org_id = parseInt(org_id);
                for (var index in home.orgs){
                    var org = home.orgs[index];
                    if (org.id === org_id){
                        name = org.name;
                    }
                }
                if (name === null){
                    // The user no longer has access to that org
                    name = 'Hidden site';
                }
                var d_strings = [];
                var num_unassigned = 0;
                for (var i in d_names){
                    var d_name = d_names[i];
                    if (d_name === null){
                        num_unassigned ++;
                    }
                    else{
                        d_strings.push(d_name);
                    }
                }
                if (num_unassigned > 0){
                    d_strings.push('Credits ('+num_unassigned+')');
                }
                org_list.push({name:name, quantity:count, devices:d_strings});
            }
            var args = {
                id: voucher.id,
                code: code,
                created: created,
                redeemed: redeemed,
                title: type_text,
                total: passes.length,
                items: org_list,
                num_unredeemed: num_unredeemed
            };
            args = add_words(args);
            var rendered_voucher = Mustache.to_html(template, args);
            rendered_vouchers.push(rendered_voucher);
        }
        return rendered_vouchers;
    },

    render_orders: function(order_history){
        // build the HTML for the order part of history tab
        // populate the page with the data struct
        var item_template = $templates.find(
                '#history-item-template').html();
        var order_template = $templates.find(
                '#history-order-template').html();
        var rendered_orders = [];
        for (var order_index in order_history){
            var order = order_history[order_index];
            order.rendered_items = [];
            for (var org_id in order.items){
                var org = order.items[org_id];
                org.items = [];
                for (var part_num in org.parts){
                    var part = org.parts[part_num];
                    var quantity = part.count;
                    var devices = part.devices;
                    var dev_list = [];
                    for (var d_index in devices){
                        var did = devices[d_index];
                        if (did !== null){
                            var device = home.devices[did];
                            if (device === undefined){
                                // shouldn't happen unless you monkey with the db
                                continue
                            }
                            dev_list.push(device.pretty_name);
                        }
                    }
                    var part = home.pass_types[part_num];
                    var part_name = part.name;
                    org.items.push(
                        {
                            part_name:part_name,
                            devices:dev_list,
                            quantity:quantity
                        });
                }
                // print(org);
                var args = add_words(org);
                var rendered_item =  Mustache.to_html(item_template, args);
                order.rendered_items.push(rendered_item);
            }
            if (order.amount){
                order.amount = dollars(order.amount);
            }
            if (order.amount_estimate){
                order.amount_estimate = dollars(order.amount_estimate);
            }
            var args = add_words(order);
            var rendered_order = Mustache.to_html(order_template, args);
            rendered_orders.push(rendered_order);
        }
        return rendered_orders;
    }
};

var confirmation_actions = {
    show_page: function(){
        hide_pages();
        $confirmation_page.show();
        active_tab('home', true);
        change_modal_buttons('confirmation');
    },

        // displays confirmation message with details about the new order
    confirmation_message: function(zentra_id, salesforce_id, email, cc_order){
        var $message = $confirmation_page.find('#confirmation-message');
        var words = add_words({});
        var cc_message = 'Your order has been processed.';
        var po_message = words.A_SALES_REPRESENTATIVE_WILL_CONTACT_YOU;
        // show the appropriate text for the type of order they submitted
        if (cc_order){
            $message.empty().append(cc_message);
        }
        else {
            $message.empty().append(po_message);
        }
        // Insert the details about the new order
        var id_elem = $confirmation_page.find('#confirmation-id');
        var salesforce_id_elem = $confirmation_page.find('#confirmation-sf-id');
        var email_elem = $confirmation_page.find('#confirmation-email');
        id_elem.empty().append(zentra_id);
        salesforce_id_elem.empty().append(salesforce_id);
        email_elem.empty().append(email);
        confirmation_actions.show_page();
    }
};

var trial_actions = {
    show_page: function(){
        hide_pages();
        $confirmation_page.show();
        active_tab('home', true);
        change_modal_buttons('trial_confirmation');
    },

    trial_confirmation_message: function(){
        let content = $confirmation_page.find('.season-pass-content-section');
        let $message = $confirmation_page.find('#confirmation-message');
        let trial_message = "The trial will expire on "
            + moment().add(30, 'days').format('L');
        content.hide();
        $message.empty().append(trial_message);
        trial_actions.show_page();
    },

    activate_trial: function(){
        if (devices_in_cart === undefined || devices_in_cart.length == 0){
            modalErrorFlash('No devices to activate');
            return;
        }

        let confirm_trial = confirm("Are you sure you would like to start a 30 day trial for these devices?");
        if (confirm_trial) {
            var json = {trial_devices: devices_in_cart};

            /* since this call can take awhile, we disable the buttons while
             we make it, to stop the user from sending other api calls or
             clicking it repeatedly */
            var accept = season_pass_modal.accept_button;
            var cancel = season_pass_modal.cancel_button;
            accept.prop('disabled', true);
            cancel.prop('disabled', true);
            modalSuccessFlash("Activating trial. This may take a minute.");
            trial_loading.show_page();

            var call = $.ajax({
                url: '/api/1.0/trial_passes/',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(json),
                success: function (response) {
                    accept.prop('disabled', false);
                    cancel.prop('disabled', false);
                    var success = response.success;
                    var message = response.message;
                    var status = response.status;
                    if (success) {
                        buy_cart = {};
                        devices_in_cart = [];
                        modalSuccessFlash("30 day trial activated successfully");
                        trial_actions.trial_confirmation_message();
                    }
                    else {
                        buy_actions.show_page();
                        modalErrorFlash(message);
                    }
                },
                error: function (jqXHR, exception) {
                    accept.prop('disabled', false);
                    cancel.prop('disabled', false);
                    var status = jqXHR.status;
                    var text = jqXHR.responseJSON.message;
                    buy_actions.show_page();
                    // times out after 20 seconds;
                    modalErrorFlash(text, 20);
                }
            });
            return call;
        }
    }
};

var new_voucher_code;

var voucher_builder_actions = {
    show_page: function(){
        hide_pages();
        $voucher_builder_page.show();
        active_tab('voucher_builder');
        change_modal_buttons('voucher_builder');
    },

    request_voucher: function(){
        // requests a voucher with the desired features be generated by the server
        var p = $voucher_builder_page;
        var $quant = p.find("#request-voucher-quantity");
        var $notes = p.find("#request-voucher-notes");
        var $code = p.find('#voucher-builder-code');
        var $email = p.find("#request-voucher-email");
        var $so_id = p.find("#request-voucher-m3-id");
        $code.empty();
        var quantity = parseInt($quant.val());
        var so_id = $so_id.val()
        if (so_id === ''){
            so_id = null;
        }
        if (isNaN(quantity) || quantity<1){
            modalErrorFlash('Invalid quantity');
            return;
        }
        var pass_type = dropdowns.value('create_part');
        var email = $email.val();
        if (email === ''){
            email = null;
        }
        var notes = $notes.val();
        var data = {
            quantity: quantity,
            part_num: pass_type,
            notes: notes,
            email: email,
            so_id: so_id
        };
        $quant.val('');
        $notes.val('');
        $.ajax({
            url: '/api/1.0/create_voucher/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                var data = response.items;
                new_voucher_code = data.code;
                $code.val(new_voucher_code);
            },
            error: function(jqXHR, exception){
                modalErrorFlash('Could not complete');
                var text = jqXHR.responseJSON.message;
                modalErrorFlash(text);
            }
        });
    }
};

var contact_actions = {
    show_page: function(){
        hide_pages();
        $contact_page.show();
        active_tab('buy', true);
        change_modal_buttons('contact');
        tours.start('contact');
        var payment_method = dropdowns.value('payment_methods');
        contact_actions.manage_payment_methods(payment_method);
    },

    refresh_fields: function(){
        function place_in_fields(info){
            var p = $contact_page;
            p.find('.first-name').val(info.first);
            p.find('.last-name').val(info.last);
            p.find('.email').val(info.email);
            p.find('.phone').val(info.phone);
            p.find('.mobile').val(info.mobile);
            p.find('.company-name').val(info.company);
            p.find('.company-address1').val(info.street1);
            p.find('.company-address2').val(info.street2);
            p.find('.city').val(info.city);
            p.find('.zip').val(info.zip);
            p.find('.state').val(info.state);
            var country = info.country;
            if ((has([undefined, null, ''], country)) ||
                (COUNTRIES[country] === undefined)){
                // defaults to United States.
                country = 'US';
            }
            dropdowns.make({
                name:'country_dropdown',
                options:COUNTRIES,
                value:country,
                label:'Select Country',
                action: contact_actions.refresh_tax_rate
            });
            if (info.billing_email){
                // billing email has priority over regular email for this page
                p.find('.email').val(info.billing_email);
            }
        }
        $.ajax({
            url: '/api/1.0/contact_info/',
            type: 'get',
            contentType: 'application/json',
            data: {},
            success: function(response){
                var contact_info = response.items[0];
                place_in_fields(contact_info);
                contact_actions.refresh_tax_rate();
            }
        });
    },

    build_json: function(suppress_flash) {
        // builds the JSON that for the user's given contact info
        if (suppress_flash === undefined){
            suppress_flash = false;
        }
        var fields = {
            first: [1, 80, '.first-name'],
            last: [1, 80, '.last-name'],
            address1: [5, 80, '.company-address1'],
            address2: [null, 80, '.company-address2'],
            city: [3, 60, '.city'],
            state: [2, 40, '.state'],
            zip: [3, 40, '.zip'],
            phone: [7,40, '.phone'],
            mobile:[null, 40, '.mobile'],
            company_name: [5, 80, '.company-name'],
            email:[5, 254, '.email']
        };
        var country = dropdowns.value('country_dropdown');
        if (country.length!== 2) {
            modalErrorFlash('Country invalid');
            return false;
        }
        var json = {
            country: country
        };
        for (var key in fields){
            var args = fields[key];
            var min = args[0];
            var max = args[1];
            var selector = args[2];
            var text = $contact_page.find(selector).val();
            var len = text.length;
            if (len > max){
                if (!suppress_flash) {
                    modalErrorFlash('Field too long: ' + key);
                }
                return false;
            }
            else if (min!==null && len<min){
                if (!suppress_flash) {
                    modalErrorFlash('Required field missing or too short : ' + key);
                }
                return false;
            }
            json[key] = text;
        }
        json.save = $contact_page.find('#save-contact-info')[0].checked;
        // print(json);
        return json;
    },

    refresh_tax_rate: function(give_flash){
        var contact = contact_actions.build_json(!give_flash);
        if (contact === false){
            return false;
        }
        var data = contact;
        if (give_flash === true){
            modalSuccessFlash('Updating tax information.');
        }
        var call = $.ajax({
            url: '/api/1.0/tax_rate/',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response){
                tax_rate = response.tax_rate;
                // var subtotal = buy_actions.refresh_cart();
                contact_actions.update_tax_amount();
            },
            error: function(a1, a2){
                var response = a1.responseJSON;
                // if (give_flash){
                    // modalErrorFlash('Could not compute tax rate from state and country');
                    modalErrorFlash(response.message);
                // }
            }
        });
        return call;
    },

    update_tax_amount: function(){
        var taxable_amount = 0.0;
        var subtotal = 0.0;
        var parts_2019 = ['50095', '50103', '50104', '50105', '50106'];
        var counts = {};
        for (var org_id in buy_cart){
            var org = buy_cart[org_id];
            var tax_exempt = home_actions.is_tax_exempt(org_id);
            for (var did in org.devices){
                var device = org.devices[did];
                for (var part_num in device){
                    var in_cart = device[part_num];
                    if (in_cart === true){
                        if (parts_2019.includes(part_num)){
                            var device_parts = home.devices[did].parts;
                            if ([true, 'cart'].includes(device_parts[50097])){
                                // If they are buying/have bought 2020, they get 2019 for free,
                                // so don't count it in their total
                                continue;
                            }
                        }
                        if (counts[part_num] === undefined){
                            counts[part_num] = 0;
                        }
                        counts[part_num]++;
                        var cost = home.pass_types[part_num].cost;
                        subtotal += cost;
                        if (tax_exempt === false){
                            taxable_amount += cost;
                        }
                    }
                }
            }
        }
        var total_discount = 0.0;
        for (part_num in counts){
            var quant = counts[part_num];
            cost = home.pass_types[part_num].cost;
            for (var i in bulk_discounts){
                var val = bulk_discounts[i];
                var min = val[0];
                var max = val[1];
                var percent = val[2];
                if ((quant>=min) && ((quant<=max) || (max===null))){
                    var discount = (quant * cost) * percent/100.0;
                    total_discount += discount;
                }
            }
        }
        if (total_discount <= taxable_amount){
            // don't charge tax on discounts
            taxable_amount -= total_discount;
        }
        else {
            taxable_amount = 0.0
        }
        subtotal -= total_discount;
        var tax_percent = tax_rate * 100.0;
        var tax_amount = taxable_amount * tax_rate;
        var total = subtotal + tax_amount;
        var $subtotal = $contact_page.find('#tax-subtotal');
        var $taxable = $contact_page.find('#tax-taxable');
        var $tax = $contact_page.find('#tax-amount');
        var $tax_total = $contact_page.find('#tax-total');
        $tax.text(dollars(tax_amount));
        var $tax_percent = $contact_page.find('#tax-percent');
        // round the tax percent to 0 or 2 decimal places
        if (tax_percent.toFixed(0) == tax_percent){
            tax_percent = tax_percent.toFixed(0);
        }
        else{
            tax_percent = tax_percent.toFixed(2)
        }
        var percent_text = '(' + tax_percent + '%)';
        $tax_percent.text(percent_text);
        $taxable.text(dollars(taxable_amount));
        $subtotal.text(dollars(subtotal));
        $tax_total.text(dollars(total));
        var div = $contact_page.find('#tax-hideable-div');
        if (tax_amount === 0){
            // if tax is zero, just hide the section to avoid confusion
            div.hide();
        }
        else {
            div.show();
        }
        var answer = {
            subtotal: subtotal,
            taxable: taxable_amount,
            tax: tax_amount,
            rate: tax_rate,
            total: total
        };
        return answer;
    },

    manage_payment_methods: function(value){
        var cc_row = $contact_page.find("#credit-card-row");
        if (value == 1){
            //they selected credit card
            cc_row.show();
        } else if (value == 2){
            //they selected purchase order
            cc_row.hide();
        } else {
            // not valid :
            print('else', value);
        }
    }
};

var req_actions = {
    changes: {add:{}, remove:{}},

    show_page: function(){
        active_tab('req');
        hide_pages();
        $req_page.show();
        change_modal_buttons('req');
        dropdowns.set_value('req_org', home.active_org);
    },

    save_changes: function (){
        // submits queued changes in requirements to server
        var changes = req_actions.changes;
        var add = [];
        var remove = [];
        for (var did in changes.add){
            var adds = changes.add[did];
            for (var req in adds){
                add.push({
                    did: did,
                    type: req
                });
            }
        }
        for (var did in changes.remove){
            var removes = changes.remove[did];
            for (var req in removes){
                remove.push({
                    did: did,
                    type: req
                });
            }
        }
        if (add.length + remove.length === 0){
            modalErrorFlash('No changes to save');
            return;
        }
        $.ajax({
            url: '/api/1.0/device_requirement/',
            method: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                add:add,
                remove:remove
            }),
            success: function (response) {
                req_actions.changes = {add:[], remove:[]};
                modalSuccessFlash('Saved changes');
            },
            error: function(arg1, arg2){
                populate_season_pass_modal(season_pass_modal);
            }
        })
    },

    search_sn_by_text: function () {
          //using the text box, lookup the given SN
          var text = $req_page.find('#req-sn-text');
          var sn = text.val();
          var org_id = req_actions.search_by_sn(sn);
          if (org_id){
              // dropdowns.set_value('req_org', org_id);
          }
    },

    search_by_sn: function (sn) {
        function req_buttons(device){
            var template = $templates.find('#req-buttons-template').html();
            var args = {
                sn: device.sn,
                reqs: [],
                add_reqs: []
            };
            var reqs = device.requirements;
            var parts = home.pass_types;
            for (var part_num in parts){
                var part = parts[part_num];
                var name = part.name;
                if (reqs.includes(part_num)){
                    args.reqs.push({
                        text: part_num + ' | ' + name,
                        id: part_num,
                        needs:true
                    });
                }
                else{
                    args.reqs.push({
                        text: part_num + ' | ' + name,
                        id: part_num
                    });
                }
            }
            args.reqs.sort(function(a,b){
                return a.name > b.name;
            });
            // print(args);
            args = add_words(args);
            var rendered = Mustache.to_html(template, args);
            return rendered;
        }

        sn = sn.toUpperCase();
        var device = home.devices_by_sn[sn];
        if (device === undefined){
            modalErrorFlash('Device not found');
            return;
        }
        $req_page.find('#req-sn-text').empty();
        var $name = $req_page.find('#req-dev-name');
        var $sn = $req_page.find('#req-dev-sn');
        var $org = $req_page.find('#req-dev-org');
        var $reqs = $req_page.find('#req-dev-requirements');
        var buttons = req_buttons(device);
        var org_name = org_names[device.org_id];
        $name.empty();
        $sn.empty();
        $reqs.empty();
        $org.empty();
        $name.append(device.name);
        $sn.append(device.sn);
        $reqs.append(buttons);
        var $dev_buttons = $req_page.find('.req-device');
        var $active_dev = $dev_buttons.filter('#req-device-'+sn);
        $dev_buttons.addClass('add');
        $active_dev.removeClass('add');
        $org.append(org_name);
        return device.org_id;
    },

    add_requirement: function(sn, part_num){
        // queues a new requirement to be added to a device or unqueues removal
        sn = sn.toUpperCase();
        // var type = home.pass_types[part_num];
        var dev = home.devices_by_sn[sn];
        var reqs = dev.requirements;
        var did = dev.did;
        var remove = req_actions.changes.remove;
        var removed = ((remove[did] !== undefined) &&
            (remove[did][part_num] !== undefined));
        var has = false;
        for (var index in reqs){
            var val = reqs[index];
            if (val === part_num){
                has = true;
            }
        }
        if (has){
            // the device already has this. Can't add again
            return;
        }
        else if (removed){
            // this req has been queued to be removed. Cancel that out
            delete remove[did][part_num];
            var empty = true;
            for(var i in remove[did]){
                empty = false;
                break;
            }
            if (empty){
                delete remove[did];
            }
        }
        else {
            // we need to queue it to be added
            var add = req_actions.changes.add;
            if (add[did] === undefined){
                add[did] = {};
            }
            add[did][part_num] = true;
        }
        // add it to the devices reqs
        reqs.push(part_num);
        req_actions.search_by_sn(sn);
    },

    remove_requirement: function(sn, part_num){
        // queues a requirement to be removed from a device or unqueues addition
        sn = sn.toUpperCase();
        var dev = home.devices_by_sn[sn];
        var did = dev.did;
        var reqs = dev.requirements;
        var has = false;
        var at_index;
        for (var index in reqs){
            var val = reqs[index];
            if (val === part_num){
                has = true;
                at_index = index;
            }
        }
        if (!has){
            // cant remove a requirement that it doesn't have
            return;
        }
        var add = req_actions.changes.add;
        var added = ((add[did] !== undefined) &&
            (add[did][part_num] !== undefined));
        var remove = req_actions.changes.remove;
        if (added){
            // it's been queued to be added. Cancel that out
            delete add[did][part_num];
            var empty = true;
            for (var i in add[did]){
                empty = false;
            }
            if (empty){
                delete add[did];
            }
        }
        else {
            // queue it to be removed
            if (remove[did] === undefined){
                remove[did] = {};
            }
            remove[did][part_num] = true;
        }
        reqs.splice(at_index, 1);
        req_actions.search_by_sn(sn);
    }
};

var account_actions = {
    accounts: {},
    contacts: {},

    show_page: function(){
        hide_pages();
        $account_page.show();
        active_tab('account');
        change_modal_buttons('account');
        dropdowns.set_value('account_org', home.active_org);
    },

    load: function(is_superuser){
        if (!is_superuser){
            return;
        }
        var data = {};
        var call = $.ajax({
            url: '/api/1.0/customer_account/',
            type: 'get',
            contentType: 'application/json',
            data: data,
            success: function (response) {
                var items = response.items;
                account_actions.accounts = items;
                account_actions.build_page();
            }
        });
    },

    build_page: function(){
        var accounts = account_actions.accounts;
        var orgs = home.orgs;
        var org_template = $templates.find('#account-org-template').html();
        var div = $account_page.find('#account-org-wrapper');
        for (var org_index in orgs){
            var org = orgs[org_index];
            var org_id = org.id;
            var m3_id = org.m3_id;
            var args = {
                org_name: org.name,
                org_id: org_id
            };
            if (m3_id !== null){
                // no account this customersite is tied to
                // {name, m3_id, is_rep}
                var account = accounts[m3_id];
                args.account = account;
            }
            else {
                args.account = {
                    m3_id: null,
                    name: null,
                    is_rep: null,
                    auto_assign: null
                }
            }
            var rendered = Mustache.to_html(org_template, args);
            div.append(rendered);
        }
        var text_boxes = $account_page.find('.m3-id-text');
        enter(text_boxes, function(e){
            // hitting enter with one of the text boxes selected searches for that ID
            account_actions.search();
        });
        account_actions.show_org(home.active_org);
    },

    show_org: function(org_id){
        // var org = home.orgs[org_id];
        $account_page.find('.account-org').hide();
        $account_page.find('#account-org-'+ org_id).show();
        home.active_org = org_id;
        account_actions.load_and_show_contacts(org_id);
        // var m3_id = org.m3_id;
        // var account = account_actions.accounts[m3_id];
    },

    load_and_show_contacts: function(org_id){
        function show_contacts(contacts){
            var template = $templates.find('#account-contact-template').html();
            var rendered = Mustache.to_html(template, contacts);
            var div = $account_page.find('#account-contacts');
            div.empty();
            div.append(rendered);
        }
        var contacts = account_actions.contacts[org_id];
        if (contacts !== undefined){
            // we've already loaded these contacts, so just use the saved values
            show_contacts(contacts);
            return
        }
        // load the contacts and then show them
        $.ajax({
            url: '/api/1.0/contact_info/',
            type: 'get',
            contentType: 'application/json',
            data: {org_id: org_id},
            success: function (response) {
                var contact_infos = response.items;
                account_actions.contacts[org_id] = contact_infos;
                show_contacts(contact_infos);
            }
        });
    },

    save_change: function(){
        var org_id = parseInt(dropdowns.value('account_org'));
        var m3_text = $account_page.find('#m3-id-text-'+org_id);
        var m3_id = parseInt(m3_text.val());
        var rep_check = $account_page.find("#m3-account-rep-check-"+org_id);
        var rep_checked = rep_check.prop('checked');
        var assign_check = $account_page.find("#m3-account-assign-check-"+org_id);
        var assign_checked = assign_check.prop('checked');
        var data = [{
            cust_id: m3_id,
            org_id: org_id,
            is_rep: rep_checked,
            auto_assign: assign_checked
        }];
        var call = $.ajax({
            url: '/api/1.0/customer_account/',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                modalSuccessFlash('Saved to account');
                // the updated dict of accounts
                account_actions.accounts = response.items;
                $account_page.find('#account-org-wrapper').empty();
                for (var o_index in home.orgs){
                    var org = home.orgs[o_index];
                    if (org.id === org_id){
                        org.m3_id = m3_id;
                    }
                }
                account_actions.build_page();
            }
        });
    },

    search: function(){
        var org_id = parseInt(dropdowns.value('account_org'));
        var m3_text = $account_page.find('#m3-id-text-'+org_id);
        var m3_id = parseInt(m3_text.val());
        var account = account_actions.accounts[m3_id];
        var name_div = $account_page.find("#m3-account-name-"+org_id);
        var rep_check = $account_page.find("#m3-account-rep-check-"+org_id);
        var assign_check = $account_page.find("#m3-account-assign-check-"+org_id);
        if (account === undefined){
            var data = {m3_id: m3_id};
            modalSuccessFlash('Getting account from M3');
            // make a call to the server, which will get it from M3
            $.ajax({
                url: '/api/1.0/customer_account/',
                type: 'get',
                contentType: 'application/json',
                data: data,
                success: function (response) {
                    var items = response.items;
                    for (var m3_id in items){
                        account = items[m3_id];
                        break;
                    }
                    account_actions.accounts[m3_id] = account;
                    name_div.text(account.name);
                    rep_check.prop('checked', account.is_rep);
                    assign_check.prop('checked', account.auto_assign);
                },
                error: function(arg1, arg2){
                    modalErrorFlash("Couldn't find that ID :(")
                }
            });
        }
        else {
            name_div.text(account.name);
            rep_check.prop('checked', account.is_rep);
        }
    },
};

var loading = {
    // just a page with a loading icon. We display when we are making lengthy ajax calls
    show_page: function () {
        hide_pages();
        $loading_page.show();
        active_tab('home', true);
        change_modal_buttons('loading');
    }
};

var trial_loading = {
    show_page: function () {
        hide_pages();
        $loading_page.show();
        active_tab('home', true);
        change_modal_buttons('trial_loading');
    }
};

