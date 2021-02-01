
// NOTE(brett): pad a string to given max size 'n' with character 'c'
// '34'.pad(4, '0') => 0034
String.prototype.pad = function(n, c) {
	return (Array(n - this.length+1).join(c)+this);
}


String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
};


String.prototype.strip = function() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
};


function getRandomInt( min, max ) { 
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


var invert = function (obj) {
	var new_obj = {};
	for (var prop in obj) {
		if(obj.hasOwnProperty(prop)) {
  			new_obj[obj[prop]] = prop;
		}
	}

	return new_obj;
};


function bind_input_to_data($input_element, data_store) {
	var f = {
		"checkbox": function() {
			$input_element.on('change', function(evt) {
				data_store[$input_element.attr('name')] = $(this).is(':checked');
			});
		}
	}
	f[$input_element[0].type]();
}


function get_local_storage_stats() {
	// https://stackoverflow.com/questions/4391575/how-to-find-the-size-of-localstorage
	var _lsTotal=0, _xLen,_x;
	for(_x in localStorage){
		_xLen= ((localStorage[_x].length + _x.length)* 2);
		_lsTotal+=_xLen;
		console.log(_x.substr(0,50)+" = "+ (_xLen/1024).toFixed(2)+" KB")
	}
	console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");
}


// NOTE(Brett): This is fromt he calibration_settings.js file
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}


function getUrlParameter(param_name) {
	let urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(param_name);
}