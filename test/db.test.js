//Unit tests for individual database functions.
//Currently only placeholders for BDD

var assert = require('assert');
var db = require('../lib/db');

describe('db.findAllPlayers', function (){
	it('returns and array object of players', function (done){
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

