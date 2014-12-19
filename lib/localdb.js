//SQLite client used for storing player states. It also returns the historical player states. 
//This client consumes an object from the DiffEngine and writes the parameters to SQLite.
//The write is triggered when a player:changed event is fired.
var fs = require("fs");
var dbfile = "app/db/local.db";
var exists = fs.existsSync(dbfile);
var sqlite3 = require('sqlite3').verbose();
var epochdb = require('./db')
var dbconfig = require('../app/server/database.config').db;
var logger = require('./logger');

var db = new sqlite3.Database(dbfile); //loads sqlite client
var epoch = new epochdb(); //loads MySQL client

db.serialize(function (){

	exports.init = function (){
		if (!exists){
			logger.info('No local database detected. Creating tables...');
			db.run('CREATE TABLE player_states( \
					PlayerName varchar(255), \
					CharacterID int(11), \
					Inventory text, \
					Container varchar(255), \
					Datestamp date)', function (err){
					if (err){
						if (err) logger.error(err);
					}else{
						logger.info('player_states table created.');
					}
			});
		}else{
			logger.info("Existing local database found: " + dbfile);
		};		
	};
	//Logs to the player_states table if the inventory is changed
	//Usage: logInventory({player: 'Friache', column: 'Inventory', previous: [...], updated: [...]})
	exports.logInventory = function (obj){
		var now = new Date();
		db.run("INSERT INTO player_states (PlayerName, CharacterID, Inventory, Container, Datestamp) VALUES ($name, $character, $inventory, $container, $date)", {
			$name: obj.player, 
			$character: obj.character,
			$inventory: obj.updated,
			$container: obj.column,
			$date: now.toDateString() + " " + now.getHours() + ":" + now.getMinutes()
		}, function (err){
			if (err) logger.error(err);
			logger.info('Writing inventory change for ' + obj.player);
			trimRecords(obj.player); //deletes old records from player_states
		});
	};
	//Returns an array of inventory states for a given players
	//Usage: inventoryHistory('Friache', function (data){...})
	exports.inventoryHistory = function (playerName, callback){
		var sql = "SELECT * FROM player_states WHERE PlayerName = ";
		var query = sql.concat('"' + playerName + '" ORDER BY Datestamp DESC LIMIT 10');

		db.all(query, function (err, data){
			if (err) logger.error(err);
			callback(data);
		});
	};
	//Writes a player inventory from sqlite to the epoch Mysql database; should fail if the player is logged in
	exports.restoreInventory = function (characterID, dateStamp){
		var date = "'" + dateStamp + "'"
		var sql = "SELECT PlayerName, CharacterID, Inventory FROM player_states WHERE characterID = ";
		var query = sql.concat(characterID + ' AND dateStamp = ' + date);
		db.get(query, function (err, data){
			if (err) logger.error(err);
			epoch.createConnection(dbconfig);
			epoch.writeInventory(data.CharacterID, data.Inventory);
			logger.info('Restoring inventory for character: ' + data.CharacterID);
			epoch._connection.end();
		});
	};
	//Ensures that only 10 records per player are kept (to limit file size). Private.
	function trimRecords (playerName){
		var playerString = '"' + playerName + '"';
		var query ='DELETE FROM player_states WHERE rowid NOT IN \
					 (SELECT rowid FROM (SELECT rowid FROM player_states WHERE PlayerName = ' + playerString + ' \
					 ORDER BY rowid DESC LIMIT 10));'
		db.run(query, function (err){
			if (err) logger.error(err);
			logger.info('Removed old player states for: ' + playerName);
		});
	};
});