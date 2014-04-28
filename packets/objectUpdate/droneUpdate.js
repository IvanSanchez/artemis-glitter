
// Provides an update on the status of a drone.


exports.name = 'droneUpdate';

exports.type = 0x80803df9;

exports.subtype = 0x10;
exports.subtypeLength = 1;	// 1 byte -> UInt8

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	var unpacked = {};
	
// 	console.log(data.buffer.slice(data.pointer-5));
// 	console.log(data.buffer.slice(data.pointer-5+51));
// 	console.log(data.buffer.slice(data.pointer-5+102));
// 	console.log(data.buffer.slice(data.pointer-5+153));
	var initialPointer = data.pointer;

	unpacked.id = data.readLong(0);
	
	var bits = data.readBitArray(2);
	
	// The bits are in big-endian, and the docs are in little-endian!
	// This is why this seems backwards :-(
	if (bits.get(7)) { unpacked.unknown1       = data.readLong(); }
	if (bits.get(6)) { unpacked.posX           = data.readFloat();}
	if (bits.get(5)) { unpacked.unknown2       = data.readFloat();}
	if (bits.get(4)) { unpacked.posZ           = data.readFloat();}
	if (bits.get(3)) { unpacked.unknown3       = data.readFloat();}
	if (bits.get(2)) { unpacked.posY           = data.readFloat();}
	if (bits.get(1)) { unpacked.heading        = data.readFloat();}
	if (bits.get(0)) { unpacked.unknown4       = data.readLong(); }	// Looks like some kind of flags?
	
	if (bits.get(15)) { /* Unused */ }
	if (bits.get(14)) { /* Unused */ }
	if (bits.get(13)) { /* Unused */ }
	if (bits.get(12)) { /* Unused */ }
	if (bits.get(11)) { /* Unused */ }
	if (bits.get(10)) { /* Unused */ }
	if (bits.get(9))  { /* Unused */ }
	if (bits.get(8))  { /* Unused */ }
	
	return unpacked;
}


