
// Provides an update on the status of an anomaly.


exports.name = 'anomalyUpdate';

exports.type = 0x80803df9;

exports.subtype = 0x07;
exports.subtypeLength = 1;	// 1 byte -> UInt8

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	var unpacked = {};
	
	unpacked.id = data.readLong(0);
	
	var bits = data.readBitArray(1);
	
	// The bits are in big-endian, and the docs are in little-endian!
	// This is why this seems backwards :-(
	if (bits.get(7)) { unpacked.posX           = data.readFloat();}
	if (bits.get(6)) { unpacked.poxY           = data.readFloat();}
	if (bits.get(5)) { unpacked.posZ           = data.readFloat();}
	if (bits.get(4)) { unpacked.shipName       = data.readString();}
	if (bits.get(3)) { unpacked.unknown1       = data.readFloat();}
	if (bits.get(2)) { unpacked.unknown2       = data.readFloat();}
	if (bits.get(1)) { unpacked.unknown3       = data.readLong(); }
	if (bits.get(0)) { unpacked.unknown4       = data.readLong(); }
	
	
	return unpacked;
}


