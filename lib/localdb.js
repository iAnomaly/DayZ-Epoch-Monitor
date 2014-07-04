var fs = require("fs");
var dbfile = "../db/local.db";
var exists = fs.existsSync(dbfile);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbfile);

module.exports = LocalDB;

function LocalDB () {

}

db.serialize(function (){
	//Creates a db file and sets up tables
	LocalDB.prototype.init = function (callback){
			if (!exists){
				console.log('No local database detected. Creating tables...');
				db.exec('CREATE TABLE player_states(PlayerName varchar(255), Inventory text, Datestamp date)', function (){
						console.log('player_states table created.');
				});
			}else{
				console.log("Existing local database found: " + dbfile);
			};

	};

	//Logs to the player_states table if the inventory is changed
	//Usage: logInventory({player: 'Friache', column: 'Inventory', previous: [...], updated: [...]})
	LocalDB.prototype.logInventory = function (obj, callback){
		db.run("INSERT INTO player_states (PlayerName, Inventory) VALUES ($name, $inventory)", {
			$name: obj.player, 
			$inventory: obj.updated});
		console.log('Writing to local db: ' + obj.player, obj.updated);
	};

	LocalDB.prototype.inventoryHistory = function (playerName, callback){
		db.all("SELECT * FROM player_states WHERE PlayerName = " + playerName, function (err, data){
			callback(data);
		});
	};
});