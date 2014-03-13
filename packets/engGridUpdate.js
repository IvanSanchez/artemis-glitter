
// Updates damage to the various system grids on the ship and DAMCON team locations and status.

exports.name = 'engGridUpdate';

exports.type = 0x077e9f3c;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	/// FIXME!!!
	var unpacked = { 
		unknown: data.readByte(),
		nodes: [], 
		teams: [] 
	};
	
	if (data.peekByte() != 0xff) {
		var node = {
			x: data.readByte(),
			y: data.readByte(),
			z: data.readByte(),
			damage: data.readFloat()
		}
		unpacked.nodes.push(node);
	}
	
	// Consume the array boundary into the void.
	data.readByte();
	
	if (data.peekByte() != 0xfe) {
		var team = {
			teamID: data.readByte(),
			goalX: data.readLong(),
			goalY: data.readLong(),
			goalZ: data.readLong(),
			x: data.readLong(),
			y: data.readLong(),
			z: data.readLong(),
			progress: data.readFloat(),
			members:  data.readLong()
		}
		unpacked.teams.push(team);
	}

	return unpacked;
}


