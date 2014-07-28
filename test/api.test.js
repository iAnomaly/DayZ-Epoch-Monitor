var request = require('supertest')
var server = require('../app/server/server.js')

describe('Api Routes', function (){
	describe('/api/players', function (){
		it('responds with json', function (done){
			request(server.app)
				.get('/api/players')
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(200, done);
		});
	}),
	describe('/api/players/:name', function (){
		it('responds with json', function (done){
			request(server.app)
				.get('/api/players/Friache')
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(200, done);
		});
	}),
	describe('/api/players/:name/inventory', function (){
		it('responds with json', function (done){
			request(server.app)
				.get('/api/players/Friache/inventory')
				.set('Accept', 'application/json')
				.expect('Content-type', /json/)
				.expect(200, done);
		});
	});
});