//Unit tests for application logging
var assert = require('assert');
var fs = require('fs');
var logger = require('../../lib/logger');
var logFilePath = './log/server.log';

describe('Logger', function (){
	beforeEach(function (done){
		fs.unlink(logFilePath, function (err){
			done();
		});
	});
	it('creates a log file', function (done){
		logger.info('test');
		fs.exists(logFilePath, function (exists){
			assert(exists);
			done();
		});
	});
	it('writes a message to the log file', function (done){
		logger.info('Test Message');
		fs.readFile(logFilePath, function (err, data){
			var text = data.toString().split('-')[1].trim();
			assert(!err);
			assert(text === 'info: Test Message');
			done();
		});
	})
	it('writes message to different log levels', function (done){
		logger.info('This is the info level.');
		logger.error('Errors only!');
		fs.readFile(logFilePath, function (err, data){
			var text = data.toString();
			assert(!err);
			assert(text.search('info') !== -1);
			assert(text.search('error')!== -1);
			done();
		});
	})
});