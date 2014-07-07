
// Main artemis low(ish)-level network interface

var net = require('net');
var fs  = require('fs');
var reader = require('./artemisBufferReader').artemisBufferReader;
// Server Address, will only be set if connected.
var serverAddr = null;

// How many times to retry connecting to a server. 0 disables.
var retries = 0;

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
	
	if (r !== null) {
		retries = r;
	}
	serverAddr = addr;
	
	sock = net.connect({host: addr, port:2010}, function(){
		console.log('Connected to server: ', addr);
		sock.on('data', onPacket);
		sock.on('end', onDisconnect);
		fireEvents('connected');
	}).on('error', function(){
		if (retries >= 0) {
			console.error('Trying to reconnect, ' + retries + ' attempts left');
			setTimeout(function(){connect(serverAddr,retries-1)}, 1000);
		} else {
			console.error('Connection refused');
			fireEvents('disconnected');
		}
	});
}

function disconnect (addr, r) {
	retries = 0;
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


var previousBuffer = null;

// When a packet is received, parse its header and delegate further
//   parsing depending on the packet type.
function onPacket(buffer) {
	var header = {};
	
	if (previousBuffer) {
		buffer = Buffer.concat([previousBuffer, buffer]);
// 		console.log('Concatenating previously received data, now is ',buffer);
		previousBuffer = null;
	}
	var data = new reader(buffer);
	
	if (buffer.length < 24) {
// 		console.log('End of TCP datagram reached while parsing packet headers');
		previousBuffer = buffer;
		return;
	}
	
	header.magic          = data.readLong();
	header.packetLength   = data.readLong();
	header.origin         = data.readLong();
	header.unknown        = data.readLong();
	header.bytesRemaining = data.readLong();
	header.type           = data.readLong();
	header.subtype        = null;
	
// 	console.log(header);
	
	if (header.magic != 0xdeadbeef) {
		console.error('Bad magic number!!', header.magic);
// 		console.log(buffer);
		return;
	}
	if (header.packetLength != (header.bytesRemaining + 20)) {
		console.error('Packet length and remaining bytes mismatch!!');
		return;
	}
	
	if (buffer.length < header.packetLength) {
// 		console.log('End of TCP datagram before end of packet');
		previousBuffer = buffer;
		return;
	}
	
	var packetDef = null;
	if (knownPackets.hasOwnProperty( header.type )) {
		var packets = [];
		var packetTypes = [];
		var subtypeLength = 0;
		var packetDef;
		if (knownPackets[header.type].subpackets) {
			subtypeLength = knownPackets[header.type].subtypeLength;
		}
		
		// One packet may contain several subpackets, just concatenated.
		while(data.pointer < header.packetLength)
		{
			if (subtypeLength == 1) {
				header.subtype = data.readByte();
			} else if (subtypeLength == 4) {
				header.subtype = data.readLong();
			}
			if (!subtypeLength) {
				packetDef = knownPackets[header.type];
			}
			if (subtypeLength) {
				if (!header.subtype) {
// 					console.log('End of subpackets');
					break;
				}
				
				if ( knownSubPackets[header.type].hasOwnProperty(header.subtype)) {
					packetDef = knownSubPackets[header.type][header.subtype];
				}
			}

			var packetType;
			if (packetDef) {
				packetType = packetDef.name;
			} else {
				console.error('Unknown packet!', header.type, header.subtype);
			}

			// Unfortunately, there might be some bugs still present
			//   with random crashes involving reading outside the
			//   recv buffer, so let's wrap this into a try-catch...
			try {
				packetTypes.push(packetType);
				var unpacked = packetDef.unpack(data);
				packets.push(unpacked);
				
				// Debug: log non-entity-update, non-usually-seen packets
				if (header.type != 0x80803df9 &&
// 					packetType != 'togglePause' &&
					packetType != 'intel' &&
					packetType != 'damcon' &&
					packetType != 'beamFired' &&
					packetType != 'allShipSettings' &&
					packetType != 'consoleStatus' &&
// 					packetType != 'gameRestart' &&
					packetType != 'soundEffect' &&
					packetType != 'commsIncoming' &&
					packetType != 'playerShipDamage' &&
// 					packetType != 'weaponsUpdate' &&
					packetType != 'destroyObject') {
					console.log(packetType, unpacked);
				}
				
			} catch(e) {
				console.error('Aaaaiiieeeee, something went wrong while parsing a packet of type ' + packetType + '!');
				var str = '';
				for (var i = 0; i<header.packetLength && i<data.buffer.length; i++) {
					var hex = data.buffer.readUInt8(i).toString(16);
					if (hex.length < 2) {
						hex = "0" + hex;
					}
					str += hex + ' ';
				}
				console.log('Data was:');
				console.log(str);
				break;
			}
		}
		
		// Some packets, particularly the stationUpdate one,
		//  may return more than one payload.
// 		if (Array.isArray(packet)) {
		for (i in packets) {
// 			console.log(packetTypes[i], packets[i]);
			fireEvents(packetTypes[i], packets[i]);
			fireEvents('packet', packets[i], packetTypes[i]);
		}
		
		
		// Packets with 1-byte subtype are packed to 4 bytes.
		// This means the last 00 is really the last 00000000 and
		//   we need to advance the pointer a little bit.
		if (subtypeLength == 1) {
			data.pointer+=3;
		}
		
		// Code to debug unknown/weird/mishandled packets
		if (data.pointer != header.packetLength) {
			console.log('Mismatching read length and packet length: ', data.pointer, header.packetLength, ' , data size: ', data.buffer.length);
			console.log('Last packet was: ', packetTypes[packets.length-1], packets[packets.length-1]);
			
			var str = '';
			for (var i = 0; i<data.pointer && i<data.buffer.length; i++) {
				var hex = data.buffer.readUInt8(i).toString(16);
				if (hex.length < 2) {
					hex = "0" + hex;
				}
				str += hex + ' ';
			}
			console.log('Data was:');
			console.log(str);
			
			var str = '';
			for (var i = data.pointer; i<=header.packetLength && i<data.buffer.length; i++) {
				var hex = data.buffer.readUInt8(i).toString(16);
				if (hex.length < 2) {
					hex = "0" + hex;
				}
				str += hex + ' ';
			}
			console.log('Data ahead is:');
			console.log(str);
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
	if (retries) {
		console.error('Trying to reconnect');
		setTimeout(function(){connect(serverAddr,retries-1)}, 1000);
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



