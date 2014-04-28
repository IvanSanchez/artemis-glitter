
// Notifies the client that beam weapon has been fired.

exports.name = 'beamFired';

exports.type = 0xb83fd2c4;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	return {
		// Beams fired have an ID, in the same range as all the other
		//   objects (ships, stations, missiles/drones, etc)
		id:       data.readLong(),
		
		// Observerd 0 when fired from enemy, 1 when fired from own ship
		unknown2: data.readLong(),
		
		// Possibly related to beam strenght.
		// Perhaps 1200 = light cruiser's 12 damage * 100%
		// Perhaps enemy 100 = kralien's 1 damage * 100%
		unknown3: data.readLong(),
		
		// Usually 0 is starboard arc and 1 is portside arc
		beamPort: data.readLong(),
		
		// Observed 4
		unknown5: data.readLong(),
		
		// Observed 1 and 4.
		unknown6: data.readLong(),

		source:   data.readLong(),
		target:   data.readLong(),
		
		impactX: data.readFloat(),
		impactZ: data.readFloat(),
		impactY: data.readFloat(),
		
		unknown10: data.readLong()
	}
}


