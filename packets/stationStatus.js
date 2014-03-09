
exports.name = 'stationStatus';

exports.type = 0x19c6e2d4;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
// 	Values for playerShip are 1 to 8
// 	Values for availability are: 0 = available, 1 = mine, 2 = unavailable
	
	return {
		playerShip: data.readUInt32LE(0),
		
		mainScreen:     data.readUInt8(4),
		helm:           data.readUInt8(5),
		weapons:        data.readUInt8(6),
		engineering:    data.readUInt8(7),
		science:        data.readUInt8(8),
		communications: data.readUInt8(9),
		observer:       data.readUInt8(10),
		gameMaster:     data.readUInt8(11)
	}
}


