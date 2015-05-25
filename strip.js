/*
* Strips
* This is a util module that enables updatable or nonupdatable log in console.
* 
* @desc: 
* By default logs are not updatable in console. That is,
* for(var i = 0; i < 11; i++){console.log(i)} creates 10 different lines of log in console.
* There is no way to show these all logs in the one line. Now what if the user wants to create 
* an console application that shows processing speed, in that case the log has to be updated 
* in one line.
* In these scenario Strips comes for resque. From very high level, it divides the console into
* many strips. The user defines whether its updatable or non-updatable. For the above mentioned 
* problem Strips provides updatable region where user can write his/her own progressive stuff.
* 
* There can be multiple Strips operating on application. Each Strips redirect output to one 
* output stream. If you create two separate Strips with one single outstream then you will get 
* weird result.
* 
* @api:
* One Strips for one output stream :- 
* var masterLog = new Strips(process.out);
* var slaveLog = new Strips(slave.out);
* 
* Describe updatable strip or non-updatable
* var _mLog = masterLog.nonupdatable;
* var __mLogupdatable = masterLog.updatable;
* 
* Strat logging
* _mLog("Non-updatable log");
* __mLogupdatable("Updatable log");
*
* @version: 1.0.0
*
* @ref:
* ANSI CSI code : http://en.wikipedia.org/wiki/ANSI_escape_code
* UUID : http://jsfiddle.net/briguy37/2MVFd/
*
* @author: akash.goswami
*/

var util = require("util"),
		stream = require("stream"),
		controlSeq = Buffer([0x1b, 0x5b]);
		
/*
* Strips
* One Strips to work with one single output stream.
* Two separate Stripts with same output stream is discouraged.
* @param: outputstream {{OutputStream}} : Output stream where the result to be displayed
*/
function Strips(outputstream){
	stream.Readable.call(this);
	
	this.pipe(outputstream);
	this.positionHistory = {}
	this.stripIndex = 0;
	this.x = 1;
	
	Object.defineProperty(this.positionHistory, "totalCount", {
		configurable : false,
		enumerable : false,
		get : function(){ return Object.keys(this).length; }
	});
}

util.inherits(Strips, stream.Readable);
Strips.prototype.constructor = Strips;

Strips.prototype._read = function(){}

/*
* Executes CSI commands. The code available are
* MoveCursor : Move the cursor to the [x,y] coordinate
* ClearStrip : Clear the current line
* You can add any more CSI command from you need to extend the module
* @ref: http://en.wikipedia.org/wiki/ANSI_escape_code
* @param: controlCode {{String}} : code available in codeMap object
* @param: params {{Array}} : parameter of for the command
*/
Strips.prototype.commandControl = function(controlCode, params){
	var codeMap = {
		"MoveCursor" 			: { code : "H", def : function(){ return [1, 1]}},
		"ClearStrip" 			: { code : "K", def : function(){ return 2}}
		}, _mappedCode, _params;
	
	if(controlCode in codeMap){
		_mappedCode = codeMap[controlCode];
		_params = params || _mappedCode.def();
		this.push(controlSeq);
		if(_params && _params.length){
			this.push(params.join(";"));
		}
		this.push(_mappedCode.code);
	}
}

/*
* Write text in output stream.
* @param : text {{String}} : Text to be written in Stream
*/
Strips.prototype.text = function(text){
	this.push(text + "\r\n");
	this.commandControl("MoveCursor", [this.x, 1]); // Move cursor to the end
}

/*
* Provides non updatable strips.
* Asking for multiple nonupdatable strips does not make sense as after using one strip 
* thet next is initialized automatically
*/
Object.defineProperty(Strips.prototype, "nonupdatable", {
	configurable : false,
	enumerable : false,
	get : function(){
		var that = this;
		return function(obj){
			var uId = new UniqueObj(),
					_x = that.x++;
			that.commandControl("MoveCursor", [_x, 1]);
			that.commandControl("ClearStrip");
			that.text(obj);
		}
	}
});

/*
* Provides updatable strips.
* You can ask for as many updatable strips as you want.
*/
Object.defineProperty(Strip.prototype, "updatable", {
	configurable : false,
	enumerable : false,
	get : function(){
		var that = this,
				uId = new UniqueObj();
		return function(obj){			
			if(!(uId.id in that.positionHistory)){
				that.positionHistory[uId.id] = {x : that.x++, y : 1};
			}
			that.commandControl("MoveCursor", [that.positionHistory[uId.id].x , 1]);
			that.commandControl("ClearStrip");
			that.text(obj);
		}
	}
});


function UniqueObj(){
	this._id = (function(){
		// Taken from - http://jsfiddle.net/briguy37/2MVFd/
		var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		});
	})();
}

UniqueObj.prototype.constructor = UniqueObj;
Object.defineProperty(UniqueObj.prototype, "id", {
	configurable : false,
	enumerable : false,
	get : function() { return this._id; }
});


module.exports = Strip;