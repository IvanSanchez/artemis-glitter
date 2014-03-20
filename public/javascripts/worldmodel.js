
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
	// Holds all known data for all known entities.
	// The key of each one is the numeric ID of the entity.
	entities: {},
	comms: {},	/// FIXME
	intel: {},	/// FIXME
	
	playerShipID: null,	// Tipically around 1010 or so.
	playerShipIndex: null,	// From 0 to 7
	engineering: {id: null},	// Status of own engineering console
	weapons: {id: null},	// Status of own weapons console
	allShipSettings: [],	// Used only during pre-game during ship selection screen
	gameStarted: false,
	
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
	console.log('Game restarted.');
});


function updateEntity(data, type){
	if (!data) {return;}
// 	console.log(data);
	
	if (!model.entities.hasOwnProperty(data.id)) {
		model.entities[data.id] = data;
		model.entities[data.id].entityType = type;
		model.fireEvents('newEntity', data);
		model.fireEvents('newOrUpdateEntity', data);
		return;
	}
	for (var key in data) {
		/// TODO: Log to console if some unknown value changes, 
		///   to help identify more fields.
		model.entities[data.id][key] = data[key];
	}
	model.fireEvents('updateEntity', model.entities[data.id]);
	model.fireEvents('newOrUpdateEntity', model.entities[data.id]);
};





iface.on('playerUpdate', function (data) {
	// Entity type 1 = Player ship
	/// TODO: Update playerShipID if data matches with playerShipIndex
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

iface.on('beamFired', function (data) {
	// Protocol doesn't cover beams, so let's arbitrarily set -1
	updateEntity(data, -1);
});

iface.on('destroyObject', function (data) {
	delete(model.entities[data.id]);
	model.fireEvents('destroyEntity', data);
});


// The consoleStatus packet only is sent for the current vessel,
//   and we won't interactively select the consoles, so...
iface.on('consoleStatus', function(data){
	// The index received here is 1-based, whereas everywhere else is 0-based
	model.playerShipIndex = data.playerShip - 1;
	console.log('Received: ', data.playerShip, ', set: ', model.playerShipIndex);
});

iface.on('destroyObject', function (data) {
	delete(model.entities[data.id]);
	model.fireEvents('destroyEntity', data);
});


iface.on('allShipSettings', function (data) {
	model.allShipSettings = data;
});




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
} else {
	// Runnint on node.js
	exports.model = model;
	exports.returnModelAsJSON = function(req, res){
		res.write(JSON.stringify(model));
		res.end();
	};

}



