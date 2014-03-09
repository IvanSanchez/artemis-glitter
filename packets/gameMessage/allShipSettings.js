
exports.name = 'allShipsSettings';

exports.type = 0xf754c8fe;

exports.subtype = 0x0f;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	var unpacked = {};
	
	// All playerShips around are 1-based and not 0-based
	for (var playerShip = 1; playerShip <= 8; playerShip++) {
		
		var driveType = data.readUInt32LE(0);
		var shipType  = data.readUInt32LE(4);
		var unknown   = data.readUInt32LE(8);
		var strLen    = data.readUInt32LE(12) * 2;
		var name      = data.toString('utf16le', 16, 16+strLen-2);
		data = data.slice(16 + strLen);
		
		unpacked[playerShip] = {
			shipType: shipType,
			driveType: driveType,
			unknown: unknown,
			name: name
		}
	}
	
	return unpacked;
	

}


