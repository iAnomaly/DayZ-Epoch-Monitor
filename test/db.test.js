//Unit tests for individual database functions.
var mysql = require('mysql');
var assert = require('assert');
var client_obj = require('../lib/db');

var dbconfig = require('../app/server/database.config').db;

// Epoch Database
var db = new client_obj();
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

describe('db.findPlayerByName', function (){
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

describe('db.setInventory', function (){
	it('sets a players inventory', function (done){
		//
		done();
	}),
	it('should NOT restore a database if a player is logged in', function (done){
		//
		done();
	});
});

function rawSQL (query) {
	db._connection.query(query, function (err, rows, fields){
		if (err) throw err;
		console.log("Query Executed: " + query)
	});	
}