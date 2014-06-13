
var assert = require('assert')
var db = require('../app/lib/db')


describe('db.findPlayerByName', function (){
	it('returns a player named Friache', function (done){
		db.findPlayerByName('Friache', function (data){
			assert(data.PlayerName === 'Friache');
		});
		done();		
	}),
	it('returns an object', function (done){
		db.findPlayerByName('Friache', function (data){
			assert(typeof data === 'object')
		})
		done()
	})
});