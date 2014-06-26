
// Provides an update on the status of the player ship.


exports.name = 'weaponsUpdate';

exports.type = 0x80803df9;

exports.subtype = 0x02;
exports.subtypeLength = 1;	// 1 byte -> UInt8

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	var unpacked = {};
	
	unpacked.id = data.readLong(0);
	
	var bits = data.readBitArray(3);
	
	// The bits are in big-endian, and the docs are in little-endian!
	// This is why this seems backwards :-(
	if (bits.get(7)) { unpacked.storesHoming  = data.readByte();}
	if (bits.get(6)) { unpacked.storesNukes   = data.readByte();}
	if (bits.get(5)) { unpacked.storesMines   = data.readByte();}
	if (bits.get(4)) { unpacked.storesEMPs    = data.readByte();}
	if (bits.get(3)) { unpacked.unknown1      = data.readByte();}
	if (bits.get(2)) { unpacked.unloadTime1   = data.readFloat();}
	if (bits.get(1)) { unpacked.unloadTime2   = data.readFloat();}
	if (bits.get(0)) { unpacked.unloadTime3   = data.readFloat();}
	
	if (bits.get(15)) { unpacked.unloadTime4  = data.readFloat();}
	if (bits.get(14)) { unpacked.unloadTime5  = data.readFloat();}
	if (bits.get(13)) { unpacked.unloadTime6  = data.readFloat();}
	if (bits.get(12)) { unpacked.tubeUsed1    = data.readByte();}
	if (bits.get(11)) { unpacked.tubeUsed2    = data.readByte();}
	if (bits.get(10)) { unpacked.tubeUsed3    = data.readByte();}
	if (bits.get(9))  { unpacked.tubeUsed4    = data.readByte();}
	if (bits.get(8))  { unpacked.tubeUsed5    = data.readByte();}
	
	if (bits.get(23)) { unpacked.tubeUsed6    = data.readByte();}
	if (bits.get(22)) { unpacked.tubeContents1 = data.readByte();}
	if (bits.get(21)) { unpacked.tubeContents2 = data.readByte();}
	if (bits.get(20)) { unpacked.tubeContents3 = data.readByte();}
	if (bits.get(19)) { unpacked.tubeContents4 = data.readByte();}
	if (bits.get(18)) { unpacked.tubeContents5 = data.readByte();}
	if (bits.get(17)) { unpacked.tubeContents6 = data.readByte(); }
	if (bits.get(16)) { /* Unused */ }
	
	console.log('Weapons update: ',unpacked);	
	
	return unpacked;
}


