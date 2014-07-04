var assert = require('assert');
var fixtures = require('./fixtures');
var LocalDB = require('../lib/localdb');

var localdb = new LocalDB();

describe('localdb', function (){
	it('should create an sqlite database on initialize', function (done){
		localdb.init();
		done();
	}),
	it('should log inventory changes to the databse', function (done){
		localdb.logInventory({player: 'Friache', column: 'Inventory', previous: fixtures.inventory1, updated: fixtures.inventory2});
		done();
	}),
	it('should return an array of inventory states for a player', function (done){
		localdb.inventoryHistory('Friache', function (data){
			console.log(data);
		});
		done();
	});
});