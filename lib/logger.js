//Logs application messages to file
var fs = require('fs');
var logFilePath = './log/server.log';

module.exports = {
	info: function (msg){
		checkLogFile();
		writeToLog('info', msg);
	},
	error: function (msg){
		checkLogFile();
		writeToLog('error', msg);
	}
}

function writeToLog (level, msg){
	var logString = formatMessage(level, msg);
	fs.appendFile(logFilePath, logString, function (err){
		if (err) throw err;
	});
}

function formatMessage (level, msg) {
	var now = new Date();
	var timeStamp = now.toDateString() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
	var messageString = timeStamp + " - " + level + ": " + msg + "\n";

	return messageString;
}

function checkLogFile (){
	fs.exists(logFilePath, function (exists){
		if (!exists){
			fs.writeFile(logFilePath,'', function (err){
				if (err) throw err;
			});
		}
	});
}