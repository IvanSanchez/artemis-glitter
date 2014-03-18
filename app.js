
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , artemisNet = require('./artemisNet')
//   , artemisModel = require('./artemisModel');
  , artemisModel = require('./public/javascripts/worldmodel');

var app = module.exports = express();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
console.log(routes.index);
app.get('/', routes.index);
app.get('/model', artemisModel.returnModelAsJSON);
app.get('/map', routes.map);
app.get('/bearing-table', routes.bearingTable);

// app.listen(3000, function(){
//   console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
// });






// Set up the socket.io stuff
// This basically will relay all artemis server packets to any browser
//   listening to the appropiate socket.io sockets.
// Socket.io is clever enough to not send unneeded messages to
//   clients

// console.log(io);

var server = require('http').Server(app);
var io = require('socket.io').listen(server);
// io.on('connection', function(){ // … });
server.listen(3000);


io.sockets.on('connection', function (s){
	artemisNet.on('packet', function(data, packetType){
		if (packetType == 'unknownUpdate') {return;}
// 		console.log('received data, preparing to emit socket: ', data);
		s.emit(packetType, data);
	});
});


artemisNet.on('connect', function(){console.log('We seem to have connected.')});

artemisNet.on('welcome', function(){console.log('We seem to have been welcomed.')});

/// FIXME: Allow connecting to somewhere else than localhost
artemisNet.connect('localhost', true);


