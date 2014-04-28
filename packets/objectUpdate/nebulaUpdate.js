
// Provides an update on the status of an anomaly.


exports.name = 'nebulaUpdate';

exports.type = 0x80803df9;

exports.subtype = 0x09;
exports.subtypeLength = 1;	// 1 byte -> UInt8

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	var unpacked = {};
	
// 	return unpacked;
	
	
// 	console.log(data.buffer.slice(data.pointer));
	
// 	return unpacked;
	
	unpacked.id = data.readLong(0);
	
	var bits = data.readBitArray(1);
	
	// The bits are in big-endian, and the docs are in little-endian!
	// This is why this seems backwards :-(
	if (bits.get(7)) { unpacked.posX           = data.readFloat();}
	if (bits.get(6)) { unpacked.poxY           = data.readFloat();}
	if (bits.get(5)) { unpacked.posZ           = data.readFloat();}
	if (bits.get(4)) { unpacked.colorRed       = data.readFloat();}
	if (bits.get(3)) { unpacked.colorGreen     = data.readFloat();}
	if (bits.get(2)) { unpacked.colorBlue      = data.readFloat();}
	if (bits.get(1)) { /* unused */ }
	if (bits.get(0)) { /* unused */ }
	
	return unpacked;
}
