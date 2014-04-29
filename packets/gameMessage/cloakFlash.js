
// This looks like the coordinates of enemy vessels when activating special abilities.

exports.name = 'cloakFlash';

exports.type = 0xf754c8fe;

exports.subtype = 0x07;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	var unpacked = {};
	
	unpacked.posX = data.readFloat(); 
	unpacked.posY = data.readFloat();
	unpacked.posZ = data.readFloat();

	return unpacked;
}


