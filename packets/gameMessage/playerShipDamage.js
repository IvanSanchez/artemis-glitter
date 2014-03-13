
// Perhaps this is not about the player ship being damaged,
// but about the screen shaking.


exports.name = 'playerShipDamage';

exports.type = 0xf754c8fe;

exports.subtype = 0x05;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	var unknown1 = data.readLong();
	
	// Seems to be around 1 for shield hits, and around 2 for hull hits.
	var unknown2 = data.readFloat();
	
	return {
		unknown1: unknown1,
		unknown2: unknown2
	}
}


