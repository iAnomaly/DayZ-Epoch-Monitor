var fs = require('fs');
var assert = require('assert');
var fixtures = require('../fixtures');
var LocalDB = require('../../lib/localdb');

var localdb = new LocalDB();

describe('localdb', function (){
	it('should create an sqlite database on initialize', function (done){
		localdb.init();
		fs.exists('app/db/local.db', function (exists){
			assert(exists === true)
			done();
		});
	}),
	it('should log inventory changes to the databse', function (done){
		localdb.logInventory({player: 'Friache', character: 14, column: 'Inventory', previous: fixtures.inventory1, updated: fixtures.inventory2});
		done();
	}),
	it('should log changes to backpack inventory', function (done){
		//
		done();
	}),
	it('should return an array of inventory states for a player', function (done){
		localdb.inventoryHistory('Friache', function (data){
			assert(data[0].PlayerName !== undefined);
			assert(data[0].PlayerName === 'Friache');
			assert(data[0].Inventory === fixtures.inventory2);
			done();
		});
	}),
	it('has CharacterID defined', function (done){
		localdb.inventoryHistory('Friache', function (data){
			assert(data[0].CharacterID === 14);
			done();
		});
	}),
	it('should only keep 10 records per user', function (done){
		//
		done();
	});
});