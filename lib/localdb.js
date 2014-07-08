var fs = require("fs");
var dbfile = "app/db/local.db";
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
				db.run('CREATE TABLE player_states(PlayerName varchar(255), \
													Inventory text, \
													Container varchar(255), \
													Datestamp date)', function (){
						console.log('player_states table created.');
				});
			}else{
				console.log("Existing local database found: " + dbfile);
			};

	};

	//Logs to the player_states table if the inventory is changed
	//Usage: logInventory({player: 'Friache', column: 'Inventory', previous: [...], updated: [...]})
	LocalDB.prototype.logInventory = function (obj, callback){
		db.run("INSERT INTO player_states (PlayerName, Inventory, Container, Datestamp) VALUES ($name, $inventory, $container, $date)", {
			$name: obj.player, 
			$inventory: obj.updated,
			$container: obj.column,
			$date: Date.now()});
		console.log('Writing inventory change for ' + obj.player);
	};

	//Returns an array of inventory states for a given players
	//Usage: inventoryHistory('Friache', function (data){...})
	LocalDB.prototype.inventoryHistory = function (player_name, callback){
		var sql = "SELECT * FROM player_states WHERE PlayerName = "
		var query = sql.concat('"' + player_name + '"');

		db.all(query, function (err, data){
			if (err) console.log(err)
			callback(data);
		});
	};
});