
/// TODO: Provide some capability to fetch the known world model from the Glitter server.



var socket = io.connect();


var model = {
	// Holds all known data for all known entities.
	// The key of each one is the numeric ID of the entity.
	entities: {},

	comms: {},	/// FIXME
	intel: {},	/// FIXME
	
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



socket.on('gameOver', function(){
	/// TODO: Decide whether to call the destroyEntity event,
	///   or if the game server sending the destroyObject packet
	///   will be enough.
	model.entities = {};
	model.comms = {};
	model.intel = {};
	/// TODO: Write all info to a file for forensics and/or post-mortem data mining.
	console.log('Game over, clearing world model');
});


socket.on('destroyObject', function(data){
	/// TODO: Somehow log this
	delete(model.entities[data.id]);
	model.fireEvents('destroyEntity', data);
});


function updateEntity(data, type) {
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



socket.on('playerUpdate', function (data) {
	// Entity type 1 = Player ship
	updateEntity(data, 1);
});

socket.on('npcUpdate', function (data) {
	// Entity type 4 = NPC
	updateEntity(data, 4);
});

socket.on('stationUpdate', function (data) {
	// Entity type 5 = Deep Space Station
	updateEntity(data, 5);
});

socket.on('beamFired', function (data) {
	// Protocol doesn't cover beams, so let's arbitrarily set -1
	updateEntity(data, -1);
});



