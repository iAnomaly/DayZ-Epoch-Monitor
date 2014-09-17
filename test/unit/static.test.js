var request = require('supertest')
var server = require('../../app/server/server.js')

describe('Static Routes', function (){
	describe('/', function (){
		it('responds with html', function (done){
			request(server.app)
				.get('/')
				.expect('Content-type', /html/)
				.expect(200, done);
		});
	});
});