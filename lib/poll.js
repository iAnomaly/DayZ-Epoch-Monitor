//Functions for polling Mysql database and emitting updates

var crypto = require('crypto');
var config = require('./config')
var db = require('./db')

var lastHash;

setInterval(function (){
	db.getPlayerByName('Friache', function (data){
		var hash = crypto.createHash('md5').update(data.toString()).digest('hex');
		console.log(data.Worldspace);
		console.log(hash);
		if (!lastHash)
		lastHash = hash;

		if (hash != lastHash){
			console.log('Data has changed! Hash was: ' + lastHash + ' Now: ' + hash);
			lastHash = hash;
		}
	})
}, 10000);