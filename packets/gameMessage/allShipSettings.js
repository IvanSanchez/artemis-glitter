
exports.name = 'allShipsSettings';

exports.type = 0xf754c8fe;

exports.subtype = 0x0f;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	var unpacked = {};
	
	// All playerShips around are 1-based and not 0-based
	for (var playerShip = 1; playerShip <= 8; playerShip++) {
		
		var driveType = data.readLong();
		var shipType  = data.readLong();
		var unknown   = data.readLong();
		var name      = data.readString();
		
		unpacked[playerShip] = {
			shipType: shipType,
			driveType: driveType,
			unknown: unknown,
			name: name
		}
	}
	
	return unpacked;
	

}


