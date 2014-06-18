var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    db = require('../../lib/db');

//Export for integration testing
exports.app = app;

// Express
app.use(express.static(__dirname + '/../client/'));
app.use(express.logger('dev'));

// Client
app.get('/', function(req, res) {
    res.sendfile('../client/index.html');
});


server.listen(process.argv[2] || 1337);

// API
//app.all('/api/', blarg);
app.get('/api/players', function (req, res){
	db.getAllPlayers(function (data){
		res.send(data);
	})
})

app.get('/api/players/:name', function (req, res){
	var player_name = req.param('name')
	db.getPlayerByName(player_name, function (data){
		res.send(data)
	})
})