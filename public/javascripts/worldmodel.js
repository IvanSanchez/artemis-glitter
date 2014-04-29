
// Implements a persistent world model on top of the low-level network
//   interface.

var iface;
var onBrowser = true;

try {
	// Running on browser, "io" is defined
	iface = io.connect();
}
catch(e) {
	// Runnint on node.js
	iface = require('../../artemisNet');
	onBrowser = false;
}


// Holds all known data for all known entities.
// The key of each one is the numeric ID of the entity.
var model = {
	connected: false,
	serverVersion: null,
	
	// Holds all known data for all known entities.
	// The key of each one is the numeric ID of the entity.
	entities: {},
	comms: {},
	incomingAudio: {},
	intel: {},
	
	playerShipID: null,	// Tipically around 1010 or so.
	playerShipIndex: null,	// From 0 to 7
	engineering: {id: null},	// Status of own engineering console
	weapons: {id: null},	// Status of own weapons console
	allShipSettings: [],	// Used only during pre-game during ship selection screen
	gameStarted: false,
	gamePaused: 0,	// 0 means playing, 1 means pausing, 2 means paused.

	
	damconNodes:{},
	damconTeams:{},
	
	skybox: null,
	difficulty: null,
	
	eventHandlers: {
		newEntity: [],
		updateEntity: [],
		destroyEntity: [],
		newOrUpdateEntity: []
	}
};

// Most events are really socket.io messages, but for a simpler
//   behaviour of the map, we'll wrap up some update functions and
//   provide some extra event handlers

// Aux function to fire all event handlers of the given event.
// The event handler will be passed 'data', a generic object 
//   containing the human-readable contents of the packet.
// In the special case of the 'packet' event, a 'packetType' 
//   is added to the struct.
model.fireEvents = function (eventType, data) {
	for (var i in model.eventHandlers[eventType]) {
		model.eventHandlers[eventType][i](data);
	}
}

// Attach an event listener
model.on = function(eventType, fn) {
	model.eventHandlers[eventType].push(fn);
}

// Detach an event listener
function off(eventType, fn) {
	var i = model.eventHandlers[eventType].indexOf(fn);
	if (i != -1) {
		delete(model.eventHandlers[eventType][i]);
	}
}


iface.on('connected', function(){
	model.connected = true;
});

iface.on('disconnected', function(){
	model.connected = false;
});

iface.on('version', function(data){
	model.serverVersion = data.version;
});


iface.on('gameOver', function(){
	/// TODO: Decide whether to call the destroyEntity event,
	///   or if the game server sending the destroyObject packet
	///   will be enough.
	model.entities = {};
	model.comms = {};
	model.intel = {};
	model.playerShipID = null;
	model.engineering  = {id: null};
	model.weapons      = {id: null};
	model.gameStarted  = false;
	console.log('Game over, clearing world model');
});

iface.on('gameStart', function(){
	model.gameStarted  = true;
	console.log('Game started.');
});

iface.on('gameRestart', function(){
	model.gameStarted  = true;
	console.log('Game (re)started.');
});


function updateEntity(data, type){
	if (!data) {return;}
// 	console.log(data);
	
	if (!model.entities.hasOwnProperty(data.id)) {
		model.entities[data.id] = data;
		model.entities[data.id].entityType = type;
		model.fireEvents('newEntity', data);
		
// 		console.log('New contact: ', data.id, type, data.shipName);
	} else {
		for (var key in data) {
			/// TODO: Log to console if some unknown value changes, 
			///   to help identify more fields.
			model.entities[data.id][key] = data[key];
		}
		model.fireEvents('updateEntity', model.entities[data.id]);
	}
	model.entities[data.id].timestampUpdated = (new Date()).getTime();
	
	model.fireEvents('newOrUpdateEntity', model.entities[data.id]);
};

iface.on('playerUpdate', function (data) {
	// Entity type 1 = Player ship
	
	// Update playerShipID if data matches with playerShipIndex
	if (data.shipNumber == model.playerShipIndex+1) {
		model.playerShipID = data.id;
	}	
	
	updateEntity(data, 1);
});

iface.on('npcUpdate', function (data) {
	// Entity type 4 = NPC
	updateEntity(data, 4);
});

iface.on('stationUpdate', function (data) {
	// Entity type 5 = Deep Space Station
	updateEntity(data, 5);
});

iface.on('mineUpdate', function (data) {
	// Entity type 6 = Mine
	updateEntity(data, 6);
});

iface.on('anomalyUpdate', function (data) {
	// Entity type 7 = Anomaly
	updateEntity(data, 7);
});

iface.on('nebulaUpdate', function (data) {
	// Entity type 9 = Nebula
	updateEntity(data, 9);
});

iface.on('torpedoUpdate', function (data) {
	// Entity type 10 = Torpedo
	updateEntity(data, 10);
});

iface.on('blackHoleUpdate', function (data) {
	// Entity type 11 = Black Hole
	updateEntity(data, 11);
});

iface.on('asteroidUpdate', function (data) {
	// Entity type 12 = Asteroid
	updateEntity(data, 12);
});

iface.on('monsterUpdate', function (data) {
	// Entity type 14 = Monster
	updateEntity(data, 14);
});

iface.on('whaleUpdate', function (data) {
	// Entity type 15 = Space Whales
	updateEntity(data, 15);
});

iface.on('droneUpdate', function (data) {
	// Entity type 16 = Drones
	updateEntity(data, 16);
});

iface.on('beamFired', function (data) {
	// Protocol doesn't cover beams, so let's arbitrarily set -1
	updateEntity(data, -1);
});

var cloakingFlashCount = 1000000;
iface.on('cloakFlash', function (data) {
	// This weird packet seems to have coordinates for jumps, but dunno
	//   what it means.
	data.id = unknownGameMessageCount++;
	data.shipName = 'Cloak';
	updateEntity(data, -2);
});

var commsCounter = 0;
iface.on('commsIncoming', function (data) {
	model.comms[commsCounter] = data;
	if (data.sender.indexOf('\u0000') !== -1) {
		console.log('Malformed sender string in comms! :', data.sender);
		data.sender = data.sender.split('\u0000')[0];
	}
	if (data.msg.indexOf('\u0000') !== -1) {
		console.log('Malformed message string in comms! :', data.msg);
		data.msg = data.msg.split('\u0000')[0];
	}
	
	model.comms[commsCounter].timestampUpdated = (new Date()).getTime();
	commsCounter++;
});

iface.on('destroyObject', function (data) {
	model.fireEvents('destroyEntity', data);
	delete(model.entities[data.id]);
});


// The consoleStatus packet only is sent for the current vessel,
//   and we won't interactively select the consoles, so...
iface.on('consoleStatus', function(data){
	// The index received here is 1-based, whereas everywhere else is 0-based
	model.playerShipIndex = data.playerShip - 1;
// 	console.log('Received: ', data.playerShip, ', set: ', model.playerShipIndex);
});

iface.on('allShipSettings', function (data) {
	model.allShipSettings = data;
});

iface.on('skybox', function (data) {
	model.skybox = data.skyboxID;
	model.gameStarted = true;
});

iface.on('intel', function (data) {
	model.intel[data.id] = [data.unknown, data.msg];
});

iface.on('togglePause', function (data) {
	model.gamePaused++;
	if (model.gamePaused >= 3) model.gamePaused = 0;
	// 0 = playing, 1 = pausing, 2 = paused
});

iface.on('difficulty', function (data) {
	model.difficulty = data.difficulty;
});


iface.on('damcon', function (data) {
	
	for (var i in data.nodes) {
		var node = data.nodes[i];
		if (!model.damconNodes.hasOwnProperty(node.x)) {
			model.damconNodes[node.x] = {};
		}
		if (!model.damconNodes[node.x].hasOwnProperty(node.y)) {
			model.damconNodes[node.x][node.y] = {};
		}
		model.damconNodes[node.x][node.y][node.z] = node.damage;
	}
	
	for (var i in data.teams) {
		
		model.damconTeams[data.teams[i].teamID] = data.teams[i];
	}
});

iface.on('difficulty', function (data) {
	var id = data.id;
	if (!model.incomingAudio.hasOwnProperty(id)) {
		model.incomingAudio[id] = data;
	} else {
		model.incomingAudio[id].mode = data.mode;
	}
});




// Given a pair of coords, heading (in radians), speed, and last 
//   known time, extrapolate a new position.
// This assumes that the timestamp of the last known time includes
//   coordinates and speed.
// Also, this assumes a flat world model. I'm not dealing with 3D 
//   just yet.
// I wonder why the coordinate system is X-Z based instead of X-Y based.
// TODO: Add rate-of-turn to the mix.
function extrapolatePosition(x,z,hdg,spd,timestamp) {
	var diff = 0;
	if (!model.gamePaused) {
		var now = (new Date()).getTime();
		diff = now - timestamp;	// In milliseconds
	}
	
	// Based on my back-of-the-envelope calculations, a vessel
	//   travelling at a velocity of 0.3 actually means about
	//   18.5 meters/sec.
	// So, a velocity of 1 should mean 61.7 meters per second,
	//   or 0.0617 meters per millisecond.
	var offset = 0.0617 * diff * spd;
	
	var newX = x + (offset * Math.sin(hdg));
	var newZ = z + (offset * Math.cos(hdg));
	
	return ([newX, newZ]);
}






if (onBrowser) {
	// Running on browser
	function receiveModel() {
		var receivedModel = JSON.parse(this.responseText);
		model.entities = receivedModel.entities;
		model.comms    = receivedModel.comms;
		model.intel    = receivedModel.intel;
		model.playerShipID    = receivedModel.playerShipID;
		model.playerShipIndex = receivedModel.playerShipIndex;
		model.engineering     = receivedModel.engineering;
		model.weapons         = receivedModel.weapons;
		model.allShipSettings = receivedModel.allShipSettings;
		model.gameStarted     = receivedModel.gameStarted
		for (i in model.entities) {
			model.fireEvents('newEntity', model.entities[i]);
			model.fireEvents('newOrUpdateEntity', model.entities[i]);
		}
		
		// Some socket-io hackish tricks to fire some fake events
		for (var i in iface.$events.allShipSettings) {
			iface.$events.allShipSettings[i](model.allShipSettings);
		}
		
// 		if (model.gameStarted) {
// 			iface.emit('gameRestart');
// 			iface.emit('gameStart');
// 		} else {
// 			iface.emit('gameOver');
// 		}
	}

	var oReq = new XMLHttpRequest();
	oReq.onload = receiveModel;
	oReq.open("get", "./model", true);
	oReq.send();
	
	
	
	
	// Automatically extrapolate vessel positions, for vessels
	//   with a non-zero speed which haven't moved for the 
	//   last 10 seconds.
	/// FIXME: This doesn't take into account pausing the server!!!
	var extrapolationTime = 1500;
	setInterval(function(){
		
		var now = (new Date()).getTime();

		
		for (i in model.entities) {
			var entity = model.entities[i];
			
			if (entity.velocity && 
			    (now - entity.timestampUpdated > extrapolationTime)) {
				
				var newCoords = extrapolatePosition(
					entity.posX,
					entity.posZ,
					entity.heading,
					entity.velocity,
					entity.timestampUpdated);
				model.entities[i].posX = newCoords[0];
				model.entities[i].posZ = newCoords[1];
				model.entities[i].timestampUpdated = now;
				model.fireEvents('updateEntity', model.entities[i]);
				model.fireEvents('newOrUpdateEntity', model.entities[i]);
			}
		} 
		
	}, extrapolationTime);
		
	
	
} else {
	// Runnint on node.js
	exports.model = model;
	exports.returnModelAsJSON = function(req, res){
		res.write(JSON.stringify(model));
		res.end();
	};

	
	// Import angles & trigonometry helper library.
// 	var angles = require('./angles');
	
}



