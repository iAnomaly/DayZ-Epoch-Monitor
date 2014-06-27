//Unit tests for DiffEngine

var assert = require('assert');
var diffEngine = require('../lib/diff');
var fixtures = require('./fixtures')

var diff = new diffEngine();


describe('DiffEngine', function (){
	it('returns the diff of two DBClient results', function (done){
		diff.diffPoll(fixtures.first_poll);
		diff.diffPoll(fixtures.second_poll, function (diff){
			assert(diff[0].player === 'Friache');
			assert(diff[0].column === 'KillsZ');
			assert(diff[0].previous === fixtures.first_poll[0].KillsZ);
			assert(diff[0].updated === fixtures.second_poll[0].KillsZ);
			done();
		});
	}),
	it('returns the diff of an arbitrary array', function (done){
		diff.diffArrays(fixtures.random_ary1, fixtures.random_ary2, function (diff){
			assert(diff[0].column === 'status');
			assert(diff[0].previous === 'alive');
			assert(diff[0].updated === 'dead');
			assert(diff[1].column === 'age');
			assert(diff[1].previous === 54);
			assert(diff[1].updated === 55);
			done();	
		})
	}),
	it('returns the diff of an arbitrary object', function (done){
		diff.diffObjects(fixtures.random_obj1, fixtures.random_obj2, function (diff){
			assert(diff.column === 'status');
			assert(diff.previous === 'alive');
			assert(diff.updated === 'dead');
			done();
		});
	});
});