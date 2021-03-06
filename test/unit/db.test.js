//Unit tests for individual database functions.
var mysql = require('mysql');
var assert = require('assert');
var dbClient = require('../../lib/db');
var fixtures = require('../fixtures');

var dbconfig = require('../../app/server/database.config').db;

// Epoch Database
var db = new dbClient();
db.createConnection(dbconfig);
db.connect();

describe('db.findAllPlayers', function (){
	it('returns an object of players', function (done){
		db.getAllPlayers(function (data){
			assert(typeof(data) === 'object');
			done();
		});
	}),
	it('should have more than 0', function (done){
		db.getAllPlayers(function (data){
			assert(data.length > 0)
			done();
		})
	})
})

describe('db.getPlayerByName', function (){
	it('returns a player named Friache', function (done){
		db.getPlayerByName('Friache', function (data){
			assert(data.PlayerName === 'Friache');
			done();	
		});
			
	}),
	it('returns an object', function (done){
		db.getPlayerByName('Friache', function (data){
			assert(typeof data === 'object')
			done();
		})
	})
});

describe('db._pollPlayers', function (){
	it('emits an event when data changes', function (done){
		var number = Math.floor(Math.random() * (1 + 100 + 1)) + 1;

		setTimeout(function () {
			db._pollPlayers();	
		});
		setTimeout(function (){
			rawSQL("UPDATE Character_DATA SET KillsZ = " + number);	
		});
		setTimeout(function() {
			db._pollPlayers();
		})
		db.on('players:changed', function (data){
			assert(typeof data === 'object')
			assert(data.length > 0)
			assert(data[0].KillsZ === number)
			done();
		})

	});
});

describe('db.writeInventory', function (){
	beforeEach(function (done){
		db.writeInventory(14, fixtures.inventory3);
		done();
	});
	it('changes a players inventory', function (done){
		db.getPlayerByName('Friache', function (data){
			assert(data.CharacterID === 14);
			assert(data.Inventory === fixtures.inventory3);
			done();
		});	
	}),
	it('should NOT restore if a player is logged in', function (done){
		//
		done();
	});
});

function rawSQL (query, callback) {
	db._connection.query(query, function (err, rows, fields){
		if (err) throw err;
		//console.log("Query Executed: " + query)
		if (callback) callback(rows);
	});	
}