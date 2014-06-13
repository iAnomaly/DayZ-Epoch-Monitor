//Functions for polling Mysql database and emitting updates

var config = require('./config')
var db = require('./db')


var playerPoll = setInterval(function (){
	db.findAllPlayers(function (data){
		//console.log(data)
	})
}, 5000)