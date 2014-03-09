
// Notifies the client that beam weapon has been fired.

exports.name = 'beamFired';

exports.type = 0xb83fd2c4;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	return {
		// Beams fired have an ID, in the same range as all the other
		//   objects (ships, stations, missiles/drones, etc)
		id: data.readUInt32LE(0),
		unknown2: data.readUInt32LE(4),
		unknown3: data.readUInt32LE(8),
		
		// Possible X-coord of the target engGrid?
		// Possible beam battery ID?
		unknown4: data.readUInt32LE(12),
		// Possible Y-coord of the target engGrid
		unknown5: data.readUInt32LE(16),
		// Possible Z-coord of the target engGrid
		unknown6: data.readUInt32LE(20),

		source:   data.readUInt32LE(24),
		target:   data.readUInt32LE(28),
		
		// Possible manual-fire heading
		unknown7: data.readFloatLE(32),
		// Possible manual-fire aximuth
		unknown8: data.readFloatLE(36),
		
		unknown9: data.readUInt32LE(40),
		unknown10: data.readUInt32LE(44)
	}

}


