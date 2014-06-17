//Functions for interactions with 
//the pre-existing Dayz Epoch Mysql Database


var config =  require('./config');
var mysql = require('mysql');

var connection = mysql.createConnection(config.db);

connection.connect();

//Returns all alive players
//Usage: db.findAllPlayers(function (players) {...})
exports.getAllPlayers = function (callback){
	var query = 'SELECT * FROM \
				(Player_DATA INNER JOIN Character_DATA ON \
				Character_DATA.PlayerUID = Player_DATA.PlayerUID) WHERE Alive = 1';
	connection.query(query, function (err, rows, fields){
		if (err) throw err;
		callback(rows);
	});
};

//Returns a single alive player found by name
//***Note: This function returns a signle object, NOT an array like getAllPlayers
//Usage: db.findPlayerByName('Friache', function (player) {...})
exports.getPlayerByName = function (player, callback){
	var sql = 'SELECT * FROM \
				(Player_DATA INNER JOIN Character_DATA ON \
				Character_DATA.PlayerUID = Player_DATA.PlayerUID) \
				WHERE Character_DATA.Alive = 1 \
				AND Player_DATA.PlayerName = ';

	var query = sql.concat('"' + player + '"');

	connection.query(query, function (err, rows, fields){
		if (err) throw err;
		var player = rows[0];
		callback(player);
	});
};
