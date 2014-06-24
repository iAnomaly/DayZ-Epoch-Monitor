//Unit tests for DiffEngine

var assert = require('assert');
var diffEngine = require('../lib/diff');
var fixtures = require('./fixtures')

var diff = new diffEngine();


describe('DiffEngine', function (){
	it('returns the diff of two DBClient results', function (done){
		diff.consume(fixtures.first_poll);
		diff.consume(fixtures.second_poll, function (diff){
			assert(diff[0].column === 'KillsZ');
			assert(diff[0].previous === fixtures.first_poll[0].KillsZ);
			assert(diff[0].updated === fixtures.second_poll[0].KillsZ);
			done();
		});
	}),
	it('returns the diff of a random array', function (done){
		diff.diffObjects(fixtures.random_ary1, fixtures.random_ary2, function (diff){
			assert(diff.column === 'status');
			assert(diff.previous === 'alive');
			assert(diff.updated === 'dead');
			done();
		})
	})
});