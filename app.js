
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



// Set up the socket.io stuff
// This basically will relay all artemis server packets to any browser
//   listening to the appropiate socket.io sockets.
// Socket.io is clever enough to not send unneeded messages to
//   clients

var server = require('http').Server(app);
var io = require('socket.io').listen(server);

io.set('log level', 1); // reduce logging

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

artemisNet.on('welcome', function(){
	console.log('We seem to have been welcomed.')
	
	
	/// FIXME!!! This is the console selection code, and should not
	///   be placed here.
	artemisNet.emit('setStation', {station:0, selected:1});	// Main Scr
// 	artemisNet.emit('setStation', {station:1, selected:1}); // Helm
// 	artemisNet.emit('setStation', {station:2, selected:1}); // Weap
// 	artemisNet.emit('setStation', {station:3, selected:1}); // Engine
	artemisNet.emit('setStation', {station:4, selected:1}); // Sci
	artemisNet.emit('setStation', {station:5, selected:1}); // Comms
	artemisNet.emit('setStation', {station:6, selected:1}); // Observ
	artemisNet.emit('setStation', {station:7, selected:1}); // Capt
// 	artemisNet.emit('setStation', {station:8, selected:1}); // GM
	
	
	
	console.log('Consoles have been requested.')
	
	});

/// FIXME: Allow connecting to somewhere else than localhost
artemisNet.connect('localhost', true);


