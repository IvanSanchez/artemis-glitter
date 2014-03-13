
// Main artemis low(ish)-level network interface

var net = require('net');
var fs  = require('fs');
var reader = require('./artemisBufferReader').artemisBufferReader;
// Server Address, will only be set if connected.
var serverAddr = null;

// Whether to retry connections to the server
var retry = false;



var eventHandlers = {
	"connect": [],
	"disconnect": [],
	"connectError": [],
	"packet": []
};


// Connect to the server.
// Params: server address (string) and whether to retry connections to this
//   server (boolean)
function connect (addr, r) {
	
	console.log('Connecting to server: ', addr);
	
	retry = r;
	
	sock = net.connect({host: addr, port:2010}, function(){
		console.log('Connected to server: ', addr);
		sock.on('data', onPacket);
		sock.on('end', onDisconnect);
		fireEvents('connect');
	}).on('error', function(){
		fireEvents('connectError');
		console.error('Connection refused');
		if (r) {
			console.error('Trying to reconnect');
			setTimeout(function(){connect(addr,r)}, 1000);
		}
	});
}


// Aux function to fire all event handlers of the given event.
// The event handler will be passed 'data', a generic object 
//   containing the human-readable contents of the packet.
// In the special case of the 'packet' event, a 'packetType' 
//   is added to the struct.
function fireEvents(eventType, data, packetType) {
	for (var i in eventHandlers[eventType]) {
		eventHandlers[eventType][i](data, packetType);
	}
}

// Attach an event listener
function on(eventType, fn) {
	eventHandlers[eventType].push(fn);
}

// Detach an event listener
function off(eventType, fn) {
	var i = eventHandlers[eventType].indexOf(fn);
	if (i != -1) {
		delete(eventHandlers[eventType][i]);
	}
}


// When a packet is received, parse its header and delegate further
//   parsing depending on the packet type.
function onPacket(buffer) {
	var header = {};
	var data = new reader(buffer);
	
	header.magic          = data.readLong();
	header.packetLength   = data.readLong();
	header.origin         = data.readLong();
	header.unknown        = data.readLong();
	header.bytesRemaining = data.readLong();
	header.type           = data.readLong();
	header.subtype        = null;
	
// 	console.log(header);
	
	if (header.magic != 0xdeadbeef) {
		console.error('Bad magic number!!');
		return;
	}
	if (header.packetLength != (header.bytesRemaining + 20)) {
		console.error('Packet length and remaining bytes mismatch!!');
		return;
	}
	
	var packetDef = null;
	if (knownPackets.hasOwnProperty( header.type )) {
		if (knownPackets[header.type].subpackets) {
			var subtypeLength = knownPackets[header.type].subtypeLength;
			if (subtypeLength == 1) {
				header.subtype = data.readByte();
			} else if (subtypeLength == 4) {
				header.subtype = data.readLong();
			}
			if (knownSubPackets[header.type].hasOwnProperty(header.subtype)) {
				packetDef = knownSubPackets[header.type][header.subtype];
			}
		} else {
			packetDef = knownPackets[header.type];
		}
	}
	
	if (packetDef) {
		var packet = packetDef.unpack(data);
		var packetType = packetDef.name;
		
		// Show contents of packet, for debugging
// 		if (packet)
// 		{
// 			if (packetType == 'unknownUpdate') {} // Ignore empty updates, at least for now
// 		 
// // 			else if (packetType == 'playerUpdate' && Object.keys(packet).length > 5) {
// // 				console.log('Player packet: ', packetType, packet);
// // 			}
// // 			else if (packetType == 'npcUpdate' && Object.keys(packet).length > 6) {
// // 				console.log('NPC packet: ', packetType, packet);
// // 			}
// // 			else if (packetType == 'playerUpdate') {} // ignore
// // 			else if (packetType == 'npcUpdate') {} // ignore
// 			else {
// 				console.log('Known packet: ', packetType, packet);
// 			}
// 		}
		
		fireEvents(packetType, packet);
		fireEvents('packet', packet, packetType);
	} else {
		console.error('Unknown packet type: ', header.type.toString(16), ', subtype: ', header.subtype);
		
		// Display the unknown payload if it's not a magic word
		//   marking the start of the next packet.
		if (data.length) {
			if (data.buffer.readLong(0) != 0xdeadbeef) {
				console.log('Unknown payload: ', data.buffer.slice(0,header.packetLength));
			}
		}
		fireEvents('packet', header);
	}
	

	// Perhaps we still have some data in the same TCP packet, so let's use a bit of recursivity...
	if (data.buffer.length > header.packetLength) {
		onPacket( data.buffer.slice(header.packetLength) );
	}
}


function onDisconnect(){
	console.log('Disconnected from server!');
	fireEvents('disconnect');
	if (retry) {
		console.error('Trying to reconnect');
		setTimeout(function(){connect(serverAddr,true)}, 1000);
	}
};


var knownPackets = {};
var knownSubPackets = {};

// Register a new packet type (usually from an external file).
// Expects an object with properties:
//   - name (string)
//   - type (int32)
//   - subtype (either null or int8)
//   - pack (an optional function for custom packing)
//   - unpack (an optional function for custom unpacking)
function registerPacketType( packet ) {
	if (packet.subtype === null) {
		knownPackets[ packet.type ] = packet;
		knownPackets[ packet.type ].subpackets = false;
	} else {
		knownPackets[ packet.type ] = {
			type: packet.type,
			name: "subpacket",
			subpackets: true,
		        subtypeLength: packet.subtypeLength
		};
		
		if (!knownSubPackets.hasOwnProperty(packet.type)) {
			knownSubPackets[ packet.type ] = {};
		}
		
		knownSubPackets[ packet.type ][ packet.subtype ] = 
			packet;
	}
	
	if (!eventHandlers.hasOwnProperty(packet.name)) {
		eventHandlers[ packet.name ] = [];
	}
}


// Import known packet types. Their definitions are scattered
//   across two levels of subdirectories to make editing a bit saner.

function recursiveRegisterPacket(dirname) {
	
	var packetFiles = fs.readdirSync(dirname);
	
	for (i in packetFiles) {
		
		var fullname = dirname + '/' + packetFiles[i];
		
		if (fs.statSync(fullname).isDirectory()) {
			recursiveRegisterPacket(fullname);
		} else {
			console.log('Registering packet: ' + fullname);
			registerPacketType( require(fullname) );
		}
	}
}

recursiveRegisterPacket(__dirname + '/packets');





exports.connect = connect;
exports.on      = on;
exports.off     = off;



