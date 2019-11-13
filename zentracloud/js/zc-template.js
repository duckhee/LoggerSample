ZCTemplate = (function() {

	var TEMPLATE_TTL_SECONDS = (60*60)*24;

	var LocalStorage = window.localStorage;
	var TemplateTTLSeconds = TEMPLATE_TTL_SECONDS;

	var NOP = function(){};

	var templates = {};

	var loading = 0,
	    loaded  = 0,
	    to_load = 0

	var done_loading_callback = NOP;

	var SHOULD_ASYNC = false;

	function loadTemplates( name_list ) {
		SHOULD_ASYNC = true;
		name_list.forEach(function(e, i, a) {
			getTemplate(e);
		});
		// console.log('Finished loading templates');
	}

	function getTemplate( name) {
		// console.log('Getting template : ', name);
		var meta = LocalStorage.getItem(name+"-"+window.VERSION);

		var current_time = !!debug ? 0 : +new Date()

		if ( meta ) {
			meta = JSON.parse(meta);
			timeout  = meta[0];
			template = meta[1];
			
			if ( timeout < current_time ) {
				// will refresh value from server
			}
			else {
				return template
			}
		}

		to_load += 1;

		templates[name] = null;
		loading += 1;

		var file_suffix = ".html";
		if ( name.indexOf('.') >= 0 ) {
			file_suffix = "";
		}

        // NOTE(Dustin) We assume the static directory unless the name has a slash
        // In that case, we assume that the name has the expected path.
		var file_prefix = "/media/html/"
		if ( name.indexOf("/") >= 0 ) {
		    file_prefix = "";
		}
		// console.log(`Reload From Server ${name} for VER ${window.VERSION}`)
		$.ajax({
			type: 'get',
			url: file_prefix + name + file_suffix+`?version=${window.VERSION}`,
			async: SHOULD_ASYNC
		})
		.success(function( result, status, response_obj) {
			templates[name] = result;
			var content_type = response_obj.getResponseHeader('content-type');
			switch(content_type) {
				case "image/svg+xml":
					LocalStorage.setItem(name+"-"+window.VERSION, JSON.stringify([+new Date() + (TemplateTTLSeconds*1000), result.documentElement.outerHTML]));
					templates[name] = result.documentElement.outerHTML
					break;
				default:
					LocalStorage.setItem(name+"-"+window.VERSION, JSON.stringify([+new Date() + (TemplateTTLSeconds*1000), templates[name]]));
					templates[name] = templates[name]
					break;
			}
			
			loaded += 1;

			if ( loaded == to_load ) {
				SHOULD_ASYNC = false;
				done_loading_callback();
			}
		})
		.error(function ( result ) {
			templates[name] = undefined;
			loaded += 1;

			if ( loaded == to_load ) {
				SHOULD_ASYNC = false;
				done_loading_callback();
			}	
		});

		if (!SHOULD_ASYNC) {
			return templates[name];
		}
	}

	function set_done_loading_callback( cb ) {
		done_loading_callback = cb;
	}

	function is_loading() {
		return (loaded != to_load)
	}

	var debug = false;
	function toggle_debug() {
		debug = !debug;
	}
	
	function set_debug_on() {
		debug = true;
	}

	function set_debug_off() {
		debug = false;
	}

	return {
		load: loadTemplates,
		get: getTemplate,
		done_loading: set_done_loading_callback,
		is_loading: is_loading,
		start_debug: set_debug_on,
		stop_debug: set_debug_off
	};
}());