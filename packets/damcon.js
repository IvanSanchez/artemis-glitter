
// Updates damage to the various system grids on the ship and DAMCON team locations and status.

exports.name = 'damcon';

exports.type = 0x077e9f3c;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	var unpacked = { 
		unknown: data.readByte(),
		nodes: [], 
		teams: [] 
	};
	
	var byte;
	while ((byte = data.readByte() ) != 0xff) {
		var node = {
			x: byte,
			y: data.readByte(),
			z: data.readByte(),
			damage: data.readFloat()
		}
		unpacked.nodes.push(node);
	}
	
	while ((byte = data.readByte() ) != 0xfe) {
		var team = {
			teamID: byte,
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


