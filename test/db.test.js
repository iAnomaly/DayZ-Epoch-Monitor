//Unit tests for individual database functions.
//Currently only placeholders for BDD

var mocha = require('mocha')
var db = require('../lib/db')

// describe('db.findOnePlayer', function (){
// 	it('returns one player and their current state', function (){
// 		//test goes here
// 	})
// })

describe('db.findAllPlayers', function (){
	it('returns all players and their current states', function (){
		db.findAllPlayers();
	})
})