var Strip = require("./strips");

var s = new Strip(process.stdout);
var _log = s.nonupdatable;
var _ulog = s.updatable;
var _uulog = s.updatable;

_log("Application using Strip");

_uulog("Application Status: Download in progress");
var i=0;
var _interval = setInterval(function(){
	if(i >= 100){
		_log("Completed");
		_uulog("Application Status: Processing in progress");
		setTimeout(function(){
			_uulog("Application Status: Processing completed");
		}, 3000);
		clearInterval(_interval);
	}
	_ulog("Download status: " + i + "%");
	i++;
}, 50);
