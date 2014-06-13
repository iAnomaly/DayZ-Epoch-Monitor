var express = require('express'),
    app = express(),
    server = require('http').createServer(app);

// Express
app.use(express.static(__dirname + '/../client/'));

// Client
app.get('/', function(req, res) {
    res.sendfile('../client/index.html');
});

// API
//app.all('/api/', blarg);

server.listen(process.argv[2] || 1337);