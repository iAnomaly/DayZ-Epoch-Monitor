//Unit tests for individual database functions.
//Currently only placeholders for BDD

var assert = require('assert')
var db = require('../app/lib/db')

// describe('db.findOnePlayer', function (){
// 	it('returns one player and their current state', function (){
// 		//test goes here
// 	})
// })

describe('db.findAllPlayers', function (){
	it('returns and array object of players', function (done){
		db.findAllPlayers(function (data){
			assert(typeof(data) === 'object')
		});
		done()
	}),
	it('should have more than 0', function (done){
		db.findAllPlayers(function (data){
			assert(data.length > 0)
		})
		done()
	})
})