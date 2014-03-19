
// This is named "StationStatus" in the original artemisLib documentation,
//   but "console status" sounds better to me. "Station" may refer to
//   a DeepSpaceStation instead.

exports.name = 'consoleStatus';

exports.type = 0x19c6e2d4;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
// 	Values for playerShip are 1 to 8
// 	Values for availability are: 0 = available, 1 = mine, 2 = unavailable
	
	return {
		playerShip:     data.readLong(),
		
		mainScreen:     data.readByte(),
		helm:           data.readByte(),
		weapons:        data.readByte(),
		engineering:    data.readByte(),
		science:        data.readByte(),
		communications: data.readByte(),
		observer:       data.readByte(),
		gameMaster:     data.readByte()
	}
}


