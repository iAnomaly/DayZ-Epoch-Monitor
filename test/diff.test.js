//Unit tests for DiffEngine

var assert = require('assert');
var diffEngine = require('../lib/diff');
var fixtures = require('./fixtures')

var diff = new diffEngine();


describe('DiffEngine', function (){
	it('returns the diff of two DBClient results', function (done){
		diff.consume(fixtures.first_poll);
		diff.consume(fixtures.second_poll, function (diff){
			assert(typeof diff === 'object')
			assert(diff.length > 0);
			done();
		});
	});
});