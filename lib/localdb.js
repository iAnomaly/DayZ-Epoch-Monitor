var fs = require("fs");
var dbfile = "app/db/local.db";
var exists = fs.existsSync(dbfile);
var sqlite3 = require('sqlite3').verbose();
var epochdb = require('./db')
var dbconfig = require('../app/server/database.config').db;

var db = new sqlite3.Database(dbfile); //loads sqlite client
var epoch = new epochdb(); //loads MySQL client

module.exports = LocalDB;

function LocalDB () {

};

db.serialize(function (){
	//Creates a db file and sets up tables
	LocalDB.prototype.init = function (callback){
			if (!exists){
				console.log('No local database detected. Creating tables...');
				db.run('CREATE TABLE player_states(PlayerName varchar(255), \
													CharacterID int(11), \
													Inventory text, \
													Container varchar(255), \
													Datestamp date)', function (err){
						if (err){
							throw err
						}else{
							console.log('player_states table created.');
						}
				});
			}else{
				console.log("Existing local database found: " + dbfile);
			};
	};
	//Logs to the player_states table if the inventory is changed
	//Usage: logInventory({player: 'Friache', column: 'Inventory', previous: [...], updated: [...]})
	LocalDB.prototype.logInventory = function (obj, callback){
		var now = new Date();
		db.run("INSERT INTO player_states (PlayerName, CharacterID, Inventory, Container, Datestamp) VALUES ($name, $character, $inventory, $container, $date)", {
			$name: obj.player, 
			$character: obj.character,
			$inventory: obj.updated,
			$container: obj.column,
			$date: now.toDateString() + " " + now.getHours() + ":" + now.getMinutes()
		}, function (err){
			if (err) throw err;
			console.log('Writing inventory change for ' + obj.player);
		});
		this.trimRecords(obj.player); //deletes old records from player_states
	};
	//Returns an array of inventory states for a given players
	//Usage: inventoryHistory('Friache', function (data){...})
	LocalDB.prototype.inventoryHistory = function (playerName, callback){
		var sql = "SELECT * FROM player_states WHERE PlayerName = ";
		var query = sql.concat('"' + playerName + '" ORDER BY Datestamp DESC LIMIT 10');

		db.all(query, function (err, data){
			if (err) console.log(err)
			callback(data);
		});
	};
	//Writes a player inventory from sqlite to the epoch Mysql database; should fail if the player is logged in
	LocalDB.prototype.restoreInventory = function (characterID, dateStamp){
		var date = "'" + dateStamp + "'"
		var sql = "SELECT PlayerName, CharacterID, Inventory FROM player_states WHERE characterID = ";
		var query = sql.concat(characterID + ' AND dateStamp = ' + date);
		db.get(query, function (err, data){
			if (err) console.log(err)
			epoch.createConnection(dbconfig);
			epoch.writeInventory(data.CharacterID, data.Inventory);
			epoch._connection.end();
		});
	};
	//Ensures that only 10 records per player are kept (to limit file size)
	LocalDB.prototype.trimRecords = function (playerName){
		var playerString = '"' + playerName + '"';
		var query ='DELETE FROM player_states WHERE rowid NOT IN \
					 (SELECT rowid FROM (SELECT rowid FROM player_states WHERE PlayerName = ' + playerString + ' \
					 ORDER BY rowid DESC LIMIT 10));'
		db.run(query, function (err){
			if (err) throw err;
			console.log('Removed old player states for: ' + playerName);
		});
	};
});