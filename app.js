
// Artemis-glitter. See README.md for details.



// Set config directories first, so other modules can use the proper config.
// Config directory is a problem when packaging with node-webkit, as the path
//   where the node-webkit executable was launched is not the path where it
//   is being run (it has been decompressed in some temporal location, etc)

var path    = require('path')
  , fs      = require('fs');

// Set a default configuration directory if one does not exist.
// process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || (path.dirname(module.uri) + '/config');

if (fs.existsSync(path.dirname(process.execPath) + '/config/')) {
    // Running from node-webkit
    process.env.NODE_CONFIG_DIR = path.dirname(process.execPath) + '/config/';

} else if (fs.existsSync(path.dirname(module.uri) + '/config/')) {
    // Running from source
    process.env.NODE_CONFIG_DIR = path.dirname(module.uri) + '/config/';
}

console.log('Module files are at ', path.dirname(module.uri));

console.log('Executable files are at ', path.dirname(process.execPath));

console.log('Using config file(s) at ', process.env.NODE_CONFIG_DIR);
var config = require('config');
// Contains:
// config.tcpPort
// config.artemisServerAddr
// config.shipIndex
// config.headless
// config.datDir




// Module dependencies.
var express = require('express')
  , opener  = require('opener')
  , path    = require('path')
  , routes  = require('./routes')
  , artemisNet = require('./artemisNet')
  , artemisModel = require('./public/javascripts/worldmodel');

var app = module.exports = express();




// Express.js configuration
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
app.get('/map',           routes.map);
app.get('/bearing-table', routes.bearingTable);
app.get('/proximity',     routes.proximity);
app.get('/tubes',         routes.tubes);



// Set up the socket.io stuff
// This basically will relay all artemis server packets to any browser
//   listening to the appropiate socket.io sockets.
// Socket.io is clever enough to not send unneeded messages to
//   clients

var server = require('http').Server(app);
var io = require('socket.io').listen(server);
io.set('log level', 1); // reduce logging

server.listen(config.tcpPort);


// When socket.io is ready: for every packet we receive from the
//   Artemis server, send a websocket to all connected browsers.
io.sockets.on('connection', function (s){
	artemisNet.on('packet', function(data, packetType){
		if (packetType == 'unknownUpdate') {return;}
		s.emit(packetType, data);
	});
});


// Inform the browsers of connections/disconnections to/from Artemis server
artemisNet.on('connected', function(){
	console.log('We seem to have connected.')
	io.sockets.emit('connected');
});
artemisNet.on('disconnected', function(){
	io.sockets.emit('disconnected');
});

function grabStations() {
	/// FIXME!!! This is the console selection code, and perhaps should not
	///   be placed here.
  	artemisNet.emit('shipSelect', {shipIndex:config.playerShipIndex});
  
	artemisNet.emit('setStation', {station:0, selected:1});	// Main Scr
// 	artemisNet.emit('setStation', {station:1, selected:1}); // Helm
// 	artemisNet.emit('setStation', {station:2, selected:1}); // Weap
// 	artemisNet.emit('setStation', {station:3, selected:1}); // Engine
// 	artemisNet.emit('setStation', {station:4, selected:1}); // Sci
// 	artemisNet.emit('setStation', {station:5, selected:1}); // Comms
// 	artemisNet.emit('setStation', {station:6, selected:1}); // Data
	artemisNet.emit('setStation', {station:7, selected:1}); // Observ
// 	artemisNet.emit('setStation', {station:8, selected:1}); // Capt
	artemisNet.emit('setStation', {station:9, selected:1}); // GM
	
	artemisNet.emit('ready'); 
	console.log('Consoles have been requested.')
}

artemisNet.on('welcome', function(){
	console.log('We seem to have been welcomed.')
	
	grabStations();
});



// Functionality for connecting/disconnecting to/from the server
//   and knowing our own public IP address (which is different from
//   'localhost', which is used in the internal web browser).
app.get('/connect/:server', function(req,res){
	config.artemisServerAddr = req.params.server;
	artemisNet.connect(config.artemisServerAddr, 10);
	artemisNet.emit('shipSelect', {shipIndex:config.shipIndex});
// 	grabStations();
	res.end();
});
app.get('/disconnect', function(req,res){
	artemisNet.disconnect();
	res.end();
});
app.get('/artemis-server', function(req,res){
	if (config.artemisServerAddr) {
		res.write(config.artemisServerAddr);
	}
	res.end();
});
app.get('/glitter-address', function(req,res){

	// Note this code is duplicated in the worldmodel.

	var publicIPs = [];
	// Network interface detection is done every time, so that
	//   the glitter server can accommodate changes to its
	//   network profile, e.g. connect to a wifi network
	// With inspiration from https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
	var os=require('os');
	var ifaces=os.networkInterfaces();
	for (var dev in ifaces) {
		ifaces[dev].forEach(function(details){
			if (details.family=='IPv4') {
				if (details.address.toString().substr(0,3)!=="127") {
					publicIPs.push(details.address);
				}
			}
		});
	}

	res.write(JSON.stringify(publicIPs));
	res.end();
});


app.get('/ship-select/:playerShipIndex', function(req,res){
	config.playerShipIndex = req.params.playerShipIndex;
	artemisNet.emit('shipSelect', {shipIndex:config.playerShipIndex});
	grabStations();
	res.end();
});

app.get('/unload-tube/:tube', function(req,res){
	// This expects a tube from 1 to 6, but the server expects a tube from 0 to 5
	artemisNet.emit('unloadTube', {tube:req.params.tube-1});
	res.end();
});
app.get('/fire-tube/:tube', function(req,res){
	// This expects a tube from 1 to 6, but the server expects a tube from 0 to 5
	artemisNet.emit('fireTube', {tube:req.params.tube-1});
	res.end();
});
app.get('/load-tube/:tube/:ordnance', function(req,res){
	// This expects a tube from 1 to 6, but the server expects a tube from 0 to 5
	artemisNet.emit('loadTube', {tube:req.params.tube-1, ordnance: req.params.ordnance});
	res.end();
});


for (var i in process.argv) {
	if (process.argv[i] == '--headless') {
		config.headless = true;
	}
	if (process.argv[i] == '--server' && process.argv.length > i) {
		config.artemisServerAddr = process.argv[parseInt(i)+1];
		console.log('Will autoconnect to server at ' + config.artemisServerAddr);
	}
}

if (config.artemisServerAddr) {
	artemisNet.connect(config.artemisServerAddr,5);
}

// Once everything's ready, try open the default browser with the main page.
if (!config.headless) {
	opener('http://localhost:' + config.tcpPort);
}
