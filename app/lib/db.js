//Functions for interactions with 
//the pre-existing Dayz Epoch Mysql Database


var config =  require('./config')
var mysql = require('mysql');

var connection = mysql.createConnection(config.db);

connection.connect()

exports.findAllPlayers = function (callback){
	var query = 'SELECT * FROM (Player_DATA INNER JOIN Character_DATA ON Character_DATA.PlayerUID = Player_DATA.PlayerUID)';
	connection.query(query, function (err, rows, fields){
		if (err) throw err;
		callback(rows);
	});
};

exports.findPlayerByName = function (player, callback){
	var query = "SELECT * FROM (Player_DATA INNER JOIN Character_DATA ON Character_DATA.PlayerUID = Player_DATA.PlayerUID) WHERE Player_DATA.PlayerName = '" + player + "'";
	connection.query(query, function (err, rows, fields){
		if (err) throw err;
		callback(rows)
	})
}
