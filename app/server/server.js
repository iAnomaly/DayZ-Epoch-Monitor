var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    epochdb = require('../../lib/db');

var dbconfig = require('./database.config').db;

//Export for integration testing
exports.app = app;

// Express
app.use(express.static(__dirname + '/../client/'));
app.use(express.logger('dev'));

// Epoch Database
var epoch = new epochdb();
epoch.createConnection(dbconfig);
epoch.connect();

// Client
app.get('/', function(req, res) {
    res.sendfile('../client/index.html');
});

http.listen(process.argv[2] || 1337);

// API
//app.all('/api/', blarg);
app.get('/api/players', function (req, res){
	epoch.getAllPlayers(function (data){
		res.send(data);
	})
});

app.get('/api/players/:name', function (req, res){
	var player_name = req.param('name')
	epoch.getPlayerByName(player_name, function (data){
		res.send(data)
	})
});

epoch.on('playersChange', function () {
    console.log('playersChange fired!');
  });

// Socket
io.sockets.on('connection', function (socket) {
  socket.emit('connected', { connected: true });

  epoch.on('playersChange', function () {
  	socket.emit('playersChange');
  });
});
