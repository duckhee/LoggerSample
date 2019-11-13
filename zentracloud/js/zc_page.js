/**
 * Created by griggs on 2/28/2017.
 */

// NOTE(brett): requires ZCTemplate

var ZCPage = (function() {
    var page_path = "/media/js/modules/";
    var pages = {};
    
	function page_interface() { 

		this.init = function(){};

		this.show = function(){};

		this.hide = function(){};

		this.$template = null;

	}


    function get_page( page ) {

        var template = page + '.html';
        var result_template;

        var promise = {
        	success: function(callback) {
        		this.on_success = callback;
        	},
        	on_success: function(){}
        };
		if ( page === "manage_users" || page === "calibration_settings" ||
            page === "dashboard_model" || page === "my_account") {
		     // NOTE(Dustin): It's pretty lame that we have to do this, but these are currently pages that
		     // require Django views so they aren't static HTML files. Eventually, we should remove all of these.
		    $.ajax({
                type: "GET",
                url: template,
                success: function (result) {
                    result_template = result;
                    var page_controller_promise = load_page_js( page, result_template );

                    page_controller_promise.success(function(page_controller){
                    	promise.on_success(page_controller);
                    });

                }
            });
		}
		else {
		    // this checks the cache, in order to not request files we already have
		    result_template = ZCTemplate.get(page);
    		var page_controller_promise = load_page_js( page, result_template );
            page_controller_promise.success(function(page_controller){
                promise.on_success(page_controller);
            });
        }

        return promise;
    }

    function load_page_js( page, result_template ){
        
        var script_name = page + '.js';

        var promise = {
        	success: function(callback) {
        		this.on_success = callback;
        	},
        	on_success: function(){}
        };

        var script_tag = document.createElement('script');
        script_tag.type = 'text/javascript';


        script_tag.onload = function(){
            window[page].init($(result_template));
            promise.on_success(window[page]);
        };

        document.body.appendChild(script_tag);
        script_tag.src = page_path + script_name;

        return promise;
    }


    return {
		page: page_interface,
        get_page: get_page
    };




}());




