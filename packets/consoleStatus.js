
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
	
	var unpacked = {};
	
	unpacked.playerShip    = data.readLong();
	unpacked.mainScreen    = data.readByte();
	unpacked.helm          = data.readByte();
	unpacked.weapons       = data.readByte();
	unpacked.engineering   = data.readByte();
	unpacked.science       = data.readByte();
	unpacked.communications= data.readByte();
	unpacked.data          = data.readByte();
	unpacked.observer      = data.readByte();
	unpacked.captainsmap   = data.readByte();
	unpacked.gameMaster    = data.readByte();
	
	return unpacked;
}


