//Functions for interactions with 
//the pre-existing Dayz Epoch Mysql Database

var mysql = require('mysql');
var crypto = require('crypto');
var events = require('events');
var util = require('util');

module.exports = DBClient;
util.inherits(DBClient, events.EventEmitter);
function DBClient() {
	events.EventEmitter.call(this);

	this._lastPlayersHash = null;
}

DBClient.prototype.createConnection = function(config)
{
	this._connection = mysql.createConnection(config);
};

DBClient.prototype.connect = function(callback) {
	var self = this;
	this._connection.connect(function(err) {
		if (err) {
	    	console.error('error connecting: ' + err.stack);
	    	return;
		}

		setInterval(function() {
			self._pollPlayers();
		}, 5000);

		if (callback) {
			callback();
		}
	});
}

//Returns all alive players
//Usage: db.getAllPlayers(function (players) {...})
DBClient.prototype.getAllPlayers = function(callback){
	var query = 'SELECT * FROM Character_DATA \
			    JOIN Player_DATA ON Character_DATA.PlayerUID = Player_DATA.PlayerUID \
			    JOIN (SELECT Datestamp AS LoginDate, Action, PlayerUID FROM Player_LOGIN ORDER BY Datestamp DESC) AS Player_LOGIN \
			    ON Character_DATA.PlayerUID = Player_LOGIN.PlayerUID \
				WHERE Alive = 1 AND DistanceFoot > 0 \
				GROUP BY Player_DATA.PlayerName';	
	this._connection.query(query, function (err, rows, fields){
		if (err) throw err;
		callback(rows);
	});
};

//Returns a single alive player found by name
//***Note: This function returns a single object, NOT an array like getAllPlayers
//Usage: db.getPlayerByName('Friache', function (player) {...})
DBClient.prototype.getPlayerByName = function (player, callback){
	var sql = 'SELECT * FROM \
				(Player_DATA INNER JOIN Character_DATA ON \
				Character_DATA.PlayerUID = Player_DATA.PlayerUID) \
				JOIN (SELECT Datestamp AS LoginDate, Action, PlayerUID FROM Player_LOGIN ORDER BY Datestamp DESC) AS Player_LOGIN \
				ON Character_DATA.PlayerUID = Player_LOGIN.PlayerUID \
				WHERE Character_DATA.Alive = 1 \
				AND Player_DATA.PlayerName = ';

	var query = sql.concat('"' + player + '"');

	this._connection.query(query, function (err, rows, fields){
		if (err) throw err;
		var player = rows[0];
		callback(player);
	});
};

DBClient.prototype._pollPlayers = function(){
	var self = this;
	this.getAllPlayers(function (data){
		var hash = crypto.createHash('sha1').update(JSON.stringify(data)).digest('hex');

		if (!this._lastPlayersHash)
		this._lastPlayersHash = hash;

		if (hash != this._lastPlayersHash){
			//console.log('Data has changed! Hash was: ' + this._lastPlayersHash + ' Now: ' + hash);
			this._lastPlayersHash = hash;
			self.emit('players:changed', data);
		}
	});
};
//Writes a players inventory back into MySQL database
DBClient.prototype.writeInventory = function (characterID, inventory){
	var inventoryString = "'" + inventory + "'";
	var sql = 'UPDATE Character_DATA SET Inventory = ' + inventoryString;
	var query = sql.concat('WHERE characterID =' + characterID);

	this._connection.query(query, function (err){
		if (err) throw(err);
	});
};
