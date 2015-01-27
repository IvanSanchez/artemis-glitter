
// Provides an update on the status of a player-fired torpedo.

exports.name = 'torpedoUpdate';

exports.type = 0x80803df9;

// exports.subtype = 0x0b;
exports.subtype = 0xfb;
exports.subtypeLength = 1;	// 1 byte -> UInt8

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	var unpacked = {};
	
	unpacked.id = data.readLong(0);
	
	var bits = data.readBitArray(1);

	unpacked.unknown1 = data.readByte(0);
	
	// The bits are in big-endian, and the docs are in little-endian!
	// This is why this seems backwards :-(
	if (bits.get(7)) { unpacked.posX           = data.readFloat();}
	if (bits.get(6)) { unpacked.poxY           = data.readFloat();}
	if (bits.get(5)) { unpacked.posZ           = data.readFloat();}
	if (bits.get(4)) { unpacked.speedX         = data.readFloat();}
	if (bits.get(3)) { unpacked.speedY         = data.readFloat();}
	if (bits.get(2)) { unpacked.speedZ         = data.readFloat();}
	if (bits.get(1)) { unpacked.ordnanceType   = data.readLong(); } // Std, Nuke, Mine, or EMP.
	if (bits.get(0)) { unpacked.unknown6       = data.readLong(); }
	
	return unpacked;
}


