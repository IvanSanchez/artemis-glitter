


// Main artemis low(ish)-level network interface
// The Game Connection is a singleton of a subclass of an EventEmitter.

// This implements the client connection, as well as proxy capabilities to 
//   act as an Artemis server.



var net  = require('net');
var fs   = require('fs');
var util = require('util');
require('events').EventEmitter

var packetHeader = require('../lib/packet-header');
var packetDefs   = require('../lib/packet-defs');
var packetDefsByType = packetDefs.packetDefsByType;
var packetDefsByName = packetDefs.packetDefsByName;
var dataTypes    = require('../lib/data-types');



function GameConnection() {
	
	// Client side
	this._sock;
	this._maxRetries = 5;
	this._retries = 0;
	this._artemisHost = null;
	this._artemisPort = null;
	this._buffer = null;
	
	this._status = 'disconnected';	// 'disconnected','connecting' or 'connected'
	
	// Proxy server side
	this._proxyPort = null;
	this._server = null;
}

var EventEmitter = require('events').EventEmitter;
util.inherits(GameConnection, EventEmitter);


GameConnection.prototype.connect = function(host,port) {
	this._status = 'connecting';
	this._retries = 0;
	this._artemisHost = host;
	this._artemisPort = port;
	this._reconnect();
}


GameConnection.prototype._reconnect = function(host,port) {
	if (this._status !== 'connecting') {
		// Just in case the user hits connect/disconnect too quick, or the timeouts 
		//   create a race condition
		return;
	}
	
	this._sock = net.connect({host: this._artemisHost, port:this._artemisPort});
	this._sock.on('connect', this._onArtemisConnect.bind(this));
	this._sock.on('error',   this._onArtemisError.bind(this));
	this._sock.on('end',     this._onArtemisError.bind(this));
}


GameConnection.prototype._onArtemisError = function() {
	this._retries += 1;
	if (this._retries >= this._maxRetries) {
		this._status = 'disconnected';
		return;
	}
	setTimeout(this._reconnect, 500 * retries * retries);
}


GameConnection.prototype._onArtemisConnect = function() {
	this._status = 'connected';
	this._retries = 0;	// For fresh reconnects in case of error
	
	console.log('Connected to Artemis game server at ', this._artemisHost, this._artemisPort);
	
	this._sock.on('data', this._onArtemisData.bind(this));
	
	
	// Immediatly request control over some consoles.
	
	this.sendPacket('setConsole', {console:0, selected:1});	// Main Scr
// 	this.sendPacket('setConsole', {console:1, selected:1}); // Helm
// 	this.sendPacket('setConsole', {console:2, selected:1}); // Weap
	this.sendPacket('setConsole', {console:3, selected:1}); // Engine
// 	this.sendPacket('setConsole', {console:4, selected:1}); // Sci
// 	this.sendPacket('setConsole', {console:5, selected:1}); // Comms
// 	this.sendPacket('setConsole', {console:6, selected:1}); // Data
	this.sendPacket('setConsole', {console:7, selected:1}); // Observ
// 	this.sendPacket('setConsole', {console:8, selected:1}); // Capt
	this.sendPacket('setConsole', {console:9, selected:1}); // GM
	
}



GameConnection.prototype._onArtemisData = function(buffer) {
	
	if (this._buffer) {
		buffer = Buffer.concat([this._buffer, buffer]);
		this._buffer = null;
	}
	
	if (buffer.length < 24) {
		this._buffer = buffer;
		return;
	}
	
	if (!buffer.hasOwnProperty('pointer')){
		buffer.pointer = 0;
	}
	
	var initialPointer = buffer.pointer;
	var header = packetHeader.unpack(buffer);
	
// 	console.log(header);
	
	if (header.magic != 0xdeadbeef) {
		console.error('Bad magic number!!', header.magic);
		return this._debugBuffer(buffer);;
	}
	if (header.packetLength != (header.bytesRemaining + 20)) {
		console.error('Packet length and remaining bytes mismatch!!');
		return this._debugBuffer(buffer);;
	}
	
	// Packet too short, rewind and wait for more data to come in.
	if (buffer.length < header.packetLength) {
		buffer.pointer = initialPointer;
		this._buffer = buffer;
		return;
	}
	
	// Contents of the buffer *after* current packet. Will be used after packet has been parsed
	//   or an error was encountered.
	var remainingBuffer = buffer.slice(initialPointer + header.packetLength);
	this._buffer = null;
	
	if (!packetDefsByType.hasOwnProperty( header.type )) {
		console.warn ('Unknown packet type: ', header.type.toString(16), ' skipping.');
		return this._onArtemisData( remainingBuffer );
	}
	
	var subtypeLength = packetDefsByType[header.type].subtypeLength;
	var subtype = -1;	// "Subtype not read yet"
	
	
	while(subtype != 0 && buffer.pointer < initialPointer + header.packetLength) {
		if (subtypeLength === 0) {
			subtype = 0;
		} else if (subtypeLength === 1) {
			subtype = dataTypes.int8.unpack(buffer);
			if (subtype == 0 && buffer.pointer+3 == initialPointer + header.packetLength) {
				buffer.pointer += 3;	// Run when a multi-subtype packet is received and has 4-byte padding at the end.
			}
		} else if (subtypeLength === 2) {
			subtype = dataTypes.int16.unpack(buffer);
		} else if (subtypeLength === 4) {
			subtype = dataTypes.int32.unpack(buffer);
		}
		
		if (!packetDefsByType[ header.type ].hasOwnProperty( subtype )) {
			console.warn ('Unknown packet subtype: ', header.type.toString(16),subtype.toString(16), ' skipping.');
			buffer.pointer = initialPointer;
			this._debugBuffer(buffer);
			return this._onArtemisData( remainingBuffer );
		}
		
		var packetName = packetDefsByType[header.type][subtype].name;
		var packet = null;
		try {
			packet       = packetDefsByType[header.type][subtype].fields.unpack(buffer);
		} catch(e) {
			console.log('Packet parser: ', packetDefsByType[header.type][subtype]);
			console.warn ('Could not parse packet (',header.type.toString(16),subtype.toString(16),'): ', e);
			this._debugBuffer(buffer);
			return this._onArtemisData( remainingBuffer );
		}
		
		/// FIXME: Do stuff with the received packet!!
		
		// Display "interesting" packets on console.
		if (packetName !== 'noUpdate'   && 
		    packetName !== 'upgrades'   &&
		    packetName !== 'weapons'    &&
		    packetName !== 'playerShip' &&
				true
			) {
		
		
			console.log(packetName, packet);
		
		}
		
		
	}
	
	
	if (buffer.pointer !== initialPointer + header.packetLength) {
		var bytesRead = buffer.pointer - initialPointer;
		console.warn('Packet length mismatch! ( expected ' , header.packetLength, ' read ', bytesRead, ')');
		this._debugBuffer(buffer);
	}
	
	return this._onArtemisData( remainingBuffer );
}



// Called when there has been a parsing error, so we can keep on guessing how the
//   protocol looks like.
GameConnection.prototype._debugBuffer = function(buffer) {
// 	var str = '';
// 	for (var i = 0; i<buffer.length; i++) {
// 		var hex = buffer.readUInt8(i).toString(16);
// 		if (hex.length < 2) {
// 			hex = "0" + hex;
// 		}
// 		str += hex + ' ';
// 	}
// 	console.log('Whole packet was:', str);
	console.log('Whole packet was:', buffer.toString('hex'));
}




// Packs the given data and sends a packet to the Artemis game server
////// TODO: Test this!!!
// TODO: Allow sending several subtypes at once???
GameConnection.prototype.sendPacket = function(packetName, packetData) {
	if (this._status !== 'connected') {
		console.error('Cannot send packet while disconnected!');
		return;
	}
	
	if (!packetDefsByName.hasOwnProperty(packetName)) {
		console.error('Do not know how to pack data for packet named ', packetName);
		return;
	}
	var def = packetDefsByName[packetName];
	
	var buffer = new Buffer(2048);
	// Skip 24 bytes for the header plus as many as the subtype.
	buffer.pointer = 24 + def.subtypeLength;
	
	// The magic happens here:
	def.fields.pack(buffer,packetData);
	
	var length = buffer.pointer;
	
	// Reset pointer so the header is written at the beginning of the buffer
	buffer.pointer = 0;
	var header = packetHeader.pack(buffer, {
		magic: 0xdeadbeef,
		packetLength: length,
		origin: 2,	// 2 = "from client"
		bytesRemaining: length - 20,
		type: def.type
	});
	
	if (def.subtypeLength == 1) {
		dataTypes.int8.pack(buffer, def.subtype );
	} else if (def.subtypeLength == 2) {
		dataTypes.int16.pack(buffer, def.subtype );
	} else if (def.subtypeLength == 4) {
		dataTypes.int32.pack(buffer, def.subtype );
	}
	
// 	this._debugBuffer(buffer.slice(0,length));
	
	this._sock.write( buffer.slice(0,length) );
}






var instance = new GameConnection();

module.exports = instance;
