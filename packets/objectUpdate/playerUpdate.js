
// Provides an update on the status of the player ship.


exports.name = 'playerUpdate';

exports.type = 0x80803df9;

exports.subtype = 0x01;
exports.subtypeLength = 1;	// 1 byte -> UInt8

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	var unpacked = {};
	
	unpacked.id = data.readUInt32LE(0);
	
	var bits1 = data.readUInt8(4);
	var bits2 = data.readUInt8(5);
	var bits3 = data.readUInt8(6);
	var bits4 = data.readUInt8(7);
	var bits5 = data.readUInt8(8);
	
	data = data.slice(9);
	

	if (bits1 & 1<<0) {
		unpacked.weaponsTarget = data.readUInt32LE(0);
		data = data.slice(4);
	}
		
	if (bits1 & 1<<1) {
		unpacked.impulse = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	if (bits1 & 1<<2) {
		unpacked.rudder = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	if (bits1 & 1<<3) {
		unpacked.maxImpulse = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	if (bits1 & 1<<4) {
		unpacked.turnRate = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	if (bits1 & 1<<5) {
		unpacked.autoBeams = data.readUInt8(0);
		data = data.slice(1);
	}
	
	if (bits1 & 1<<6) {
		unpacked.warp = data.readUInt8(0);
		data = data.slice(1);
	}
	
	if (bits1 & 1<<7) {
		unpacked.energy = data.readFloatLE(0);
		data = data.slice(4);
	}
	

	
	if (bits2 & 1<<0) {
		unpacked.shieldState = data.readUInt16LE(0);
		data = data.slice(2);
	}
		
	if (bits2 & 1<<1) {
		unpacked.shipNumber = data.readUInt32LE(0);
		data = data.slice(4);
	}
	
	if (bits2 & 1<<2) {
		unpacked.shipType = data.readUInt32LE(0);
		data = data.slice(4);
	}
	
	if (bits2 & 1<<3) {
		unpacked.posX = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	if (bits2 & 1<<4) {
		unpacked.posY = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	if (bits2 & 1<<5) {
		unpacked.posZ = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	if (bits2 & 1<<6) {
		unpacked.pitch = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	if (bits2 & 1<<7) {
		unpacked.roll = data.readFloatLE(0);
		data = data.slice(4);
	}
	

	
	if (bits3 & 1<<0) {
		unpacked.heading = data.readFloatLE(0);
		data = data.slice(4);
	}
		
	if (bits3 & 1<<1) {
		unpacked.velocity = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	if (bits3 & 1<<2) {
		unpacked.unknown1 = data.readUInt16LE(0);
		data = data.slice(2);
	}
	
	if (bits3 & 1<<3) {
		var strLen = data.readUInt32LE(0) * 2;
		if (strLen) {
			unpacked.shipName = data.toString('utf16le', 4, 4+strLen-2);
		}
		data = data.slice(4 + strLen);
	}
	
	if (bits3 & 1<<4) {
		unpacked.forShields = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	if (bits3 & 1<<5) {
		unpacked.forShieldsMax = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	if (bits3 & 1<<6) {
		unpacked.aftShields = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	if (bits3 & 1<<7) {
		unpacked.aftShieldsMax = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	
	if (bits4 & 1<<0) {
		// ID of the station I'm docking with.
		unpacked.docking = data.readUInt32LE(0);
		data = data.slice(4);
	}
		
	if (bits4 & 1<<1) {
		unpacked.redAlert = data.readUInt8(0);
		data = data.slice(1);
	}
	
	if (bits4 & 1<<2) {
		unpacked.unknown2 = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	if (bits4 & 1<<3) {
		unpacked.mainScreen = data.readUInt8(0);
		data = data.slice(1);
	}
	
	if (bits4 & 1<<4) {
		unpacked.beamFrequency = data.readUInt8(0);
		data = data.slice(1);
	}
	
	if (bits4 & 1<<5) {
		unpacked.coolantAvailable = data.readUInt8(0);
		data = data.slice(1);
	}
	
	if (bits4 & 1<<6) {
		unpacked.scienceTarget = data.readUInt32LE(0);
		data = data.slice(4);
	}
	
	if (bits4 & 1<<7) {
		unpacked.captainTarget = data.readUInt32LE(0);
		data = data.slice(4);
	}
	
	
	if (bits5 & 1<<0) {
		unpacked.driveType = data.readUInt8(0);
		data = data.slice(1);
	}
		
	if (bits5 & 1<<1) {
		unpacked.scanningTarget = data.readUInt32LE(0);
		data = data.slice(4);
	}
	
	if (bits5 & 1<<2) {
		unpacked.scanningProgress = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	if (bits5 & 1<<3) {
		unpacked.reverse = data.readUInt8(0);
		data = data.slice(1);
	}
	
	if (bits5 & 1<<4) {
		unpacked.unknown3 = data.readUInt32LE(0);
		data = data.slice(4);
	}
	
	if (bits5 & 1<<5) {
		unpacked.unknown4 = data.readUInt8(0);
		data = data.slice(1);
	}
	
	if (bits5 & 1<<6) {
		unpacked.unknown5 = data.readUInt32LE(0);
		data = data.slice(4);
	}
	
	if (bits5 & 1<<7) {
		// Not used
	}
	

	return unpacked;
}


