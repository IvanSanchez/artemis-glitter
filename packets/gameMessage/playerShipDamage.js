
// Perhaps this is not about the player ship being damaged,
// but about the screen shaking.


exports.name = 'playerShipDamage';

exports.type = 0xf754c8fe;

exports.subtype = 0x05;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	return {
		unknown1: data.readUInt32LE(0),
		
		// Seems to be around 1 for shield hits, and around
		//   2 for hull hits.
		unknown2: data.readFloatLE(4)
	}
}


