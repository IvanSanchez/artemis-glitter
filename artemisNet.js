
// Main artemis low(ish)-level network interface

var net = require('net');
var fs  = require('fs');
var reader = require('./artemisBufferReader').artemisBufferReader;
// Server Address, will only be set if connected.
var serverAddr = null;

// Whether to retry connections to the server
var retry = false;

// Placeholder for the socket object
var sock;


// Note that "connect" and "disconnect" would conflict on the
//   browser side with the built-in events for socket.io
var eventHandlers = {
	"connected": [],
	"disconnected": [],
	"connectError": [],
	"packet": []
};


// Connect to the server.
// Params: server address (string) and whether to retry connections to this
//   server (boolean)
function connect (addr, r) {
	
	console.log('Connecting to server: ', addr);
	
	retry = r;
	serverAddr = addr;
	
	sock = net.connect({host: addr, port:2010}, function(){
		console.log('Connected to server: ', addr);
		sock.on('data', onPacket);
		sock.on('end', onDisconnect);
		fireEvents('connected');
	}).on('error', function(){
		fireEvents('connectError');
		console.error('Connection refused');
		if (retry) {
			console.error('Trying to reconnect');
			setTimeout(function(){connect(serverAddr,retry)}, 1000);
		}
	});
}

function disconnect (addr, r) {
	retry = false;
	if (sock) {
		sock.end();
	}
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
	if (eventHandlers.hasOwnProperty(eventType)) {
		eventHandlers[eventType].push(fn);
// 		console.log('Attached event to packet type: ', eventType);
	} else {
// 		console.log('No registered packet type: ', eventType);
	}
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
	
	if (packetDef !== null) {
		var packet = {};
		var packetType = packetDef.name;
		// Unfortunately, there might be some bugs still present
		//   with random crashes involving reading outside the
		//   recv buffer, so let's wrap this into a try-catch...
		try {
			packet = packetDef.unpack(data);
		} catch(e) {
			console.error('Aaaaiiieeeee, something went wrong while parsing a packet of type ' + packetType + '!');
			console.error(e);
			console.error(data);
		}
		
		

		
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
		
		// Some packets, particularly the stationUpdate one,
		//  may return more than one payload.
		if (Array.isArray(packet)) {
			for (i in packet) {
				fireEvents(packetType, packet[i]);
				fireEvents('packet', packet[i], packetType);
			}
		} else {
			fireEvents(packetType, packet);
			fireEvents('packet', packet, packetType);
		}
		
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
	fireEvents('gameOver');
	fireEvents('disconnected');
	if (retry) {
		console.error('Trying to reconnect');
		setTimeout(function(){connect(serverAddr,true)}, 1000);
	}
}


// Given a packet name and structure, pack it into a buffer and send it.
// Will call the underlying packet 'pack' function.
function emit(packetName, data) {
	if (!packetsByName.hasOwnProperty(packetName)) {
		return false;
	}
	var packet = packetsByName[ packetName ];
	if (!packet.pack) {
		return false;
	}
	
	// Declare a buffer big enough, and wrap it with our helpers.
	var writer = new reader( new Buffer(2048) );	// Yes, yes, I know the naming doesn't make any sense.
	writer.writeLong(0xdeadbeef);	// Magic number
	writer.writeLong(0);	/// packetLength FIXME!!! Will need to re-write with real length
	writer.writeLong(2);	// Origin = client (not server)
	writer.writeLong(0);	// Unknown
	writer.writeLong(0);	/// bytesRemaining FIXME!!! Will need to re-write with real length
	writer.writeLong( packet.type );
	
	if (packet.subtypeLength == 1) {
		writer.writeByte( packet.subtype );
	} else if (packet.subtypeLength == 4) {
		writer.writeLong( packet.subtype );
	}
	
	packet.pack( writer, data );
	
	// Re-write packetLength
	writer.buffer.writeUInt32LE(writer.pointer, 4);
	
	// Re-write remainingBytes
	writer.buffer.writeUInt32LE(writer.pointer - 20, 16);
	
	// Finally, send the useful part of the buffer.
	sock.write( writer.buffer.slice(0,writer.pointer) );
}



var knownPackets = {};
var knownSubPackets = {};

var packetsByName = {};

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
	
	packetsByName[ packet.name ] = packet;
	/// TODO!!! Implement the translation of browser-side "emit"s to
	///   glitter-side "emit"s.
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
exports.disconnect = disconnect;
exports.on      = on;
exports.off     = off;
exports.emit    = emit;



