
// Provides an update on the status of any other ship.


exports.name = 'npcUpdate';

exports.type = 0x80803df9;

exports.subtype = 0x04;
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
	var bits6 = data.readUInt8(9);
	
	data = data.slice(10);
	

	if (bits1 & 1<<0) {
		var strLen = data.readUInt32LE(0) * 2;
		if (strLen) {
			unpacked.shipName = data.toString('utf16le', 4, 4+strLen-2);
		}
		data = data.slice(4 + strLen);
	}
	if (bits1 & 1<<1) {
		unpacked.unknown1 = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits1 & 1<<2) {
		// Possible rudder / rate of turn (0.5 = ahead)
		unpacked.unknown2 = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits1 & 1<<3) {
		unpacked.impulseMax = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits1 & 1<<4) {
		unpacked.turnRateMax = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits1 & 1<<5) {
		unpacked.isEnemy = data.readUInt32LE(0);
		data = data.slice(4);
	}
	if (bits1 & 1<<6) {
		unpacked.shipType = data.readUInt32LE(0);
		data = data.slice(4);
	}
	if (bits1 & 1<<7) {
		unpacked.posX = data.readFloatLE(0);
		data = data.slice(4);
	}
	

	if (bits2 & 1<<0) {
		unpacked.posY = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits2 & 1<<1) {
		unpacked.posZ = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits2 & 1<<2) {
		unpacked.pitch = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits2 & 1<<3) {
		unpacked.roll = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits2 & 1<<4) {
		unpacked.heading = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits2 & 1<<5) {
		unpacked.velocity = data.readUInt32LE(0);
		data = data.slice(4);
	}
	if (bits2 & 1<<6) {
		unpacked.unknown3 = data.readUInt8(0);
		data = data.slice(1);
	}
	if (bits2 & 1<<7) {
		unpacked.unknown4 = data.readUInt16LE(0);
		data = data.slice(2);
	}
	
	if (bits3 & 1<<0) {
		unpacked.forShields = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits3 & 1<<1) {
		unpacked.forShieldsMax = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits3 & 1<<2) {
		unpacked.aftShields = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits3 & 1<<3) {
		unpacked.aftShieldsMax = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits3 & 1<<4) {
		unpacked.unknown5 = data.readUInt16LE(0);
		data = data.slice(2);
	}
	if (bits3 & 1<<5) {
		unpacked.unknown6 = data.readUInt8(0);
		data = data.slice(1);
	}
	if (bits3 & 1<<6) {
		unpacked.eliteBits = data.readUInt32LE(0);
		data = data.slice(4);
	}
	if (bits3 & 1<<7) {
		unpacked.eliteBitsActive = data.readUInt32LE(0);
		data = data.slice(4);
	}
	
	
	if (bits4 & 1<<0) {
		unpacked.scanned = data.readUInt32LE(0);
		data = data.slice(4);
	}
	if (bits4 & 1<<1) {
		unpacked.faction = data.readUInt32LE(0);
		data = data.slice(4);
	}
	if (bits4 & 1<<2) {
		unpacked.unknown7 = data.readUInt32LE(0);
		data = data.slice(4);
	}
	if (bits4 & 1<<3) {
		unpacked.unknown8 = data.readUInt8(0);
		data = data.slice(1);
	}
	if (bits4 & 1<<4) {
		unpacked.unknown9 = data.readUInt8(0);
		data = data.slice(1);
	}
	if (bits4 & 1<<5) {
		unpacked.unknown10 = data.readUInt8(0);
		data = data.slice(1);
	}
	if (bits4 & 1<<6) {
		unpacked.unknown11 = data.readUInt8(0);
		data = data.slice(1);
	}
	if (bits4 & 1<<7) {
		unpacked.unknown12 = data.readUInt32LE(0);
		data = data.slice(4);
	}
	
	
	if (bits5 & 1<<0) {
		unpacked.unknown13 = data.readUInt32LE(0);
		data = data.slice(4);
	}
	if (bits5 & 1<<1) {
		unpacked.unknown14 = data.readUInt32LE(0);
		data = data.slice(4);
	}
	if (bits5 & 1<<2) {
		/// TODO: update protocol docs!
		/// 0 means operational, 1 means destroyed.
		/// All systems will decrease back to 0 slowly.
		unpacked.damageBeams = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits5 & 1<<3) {
		/// TODO: update protocol docs!
		unpacked.damageTorpedoes = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits5 & 1<<4) {
		unpacked.damageSensors = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits5 & 1<<5) {
		/// TODO: update protocol docs!
		unpacked.damageManeuver = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits5 & 1<<6) {
		/// TODO: update protocol docs!
		unpacked.damageImpulse = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits5 & 1<<7) {
		/// TODO: update protocol docs!
		unpacked.damageWarp = data.readFloatLE(0);
		data = data.slice(4);
	}
	
	
	if (bits6 & 1<<0) {
		/// TODO: update protocol docs!
		unpacked.damageForShield = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits6 & 1<<1) {
		/// TODO: update protocol docs!
		unpacked.damageAftShield = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits6 & 1<<2) {
		unpacked.shieldFreqA = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits6 & 1<<3) {
		unpacked.shieldFreqB = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits6 & 1<<4) {
		unpacked.shieldFreqC = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits6 & 1<<5) {
		unpacked.shieldFreqD = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits6 & 1<<6) {
		unpacked.shieldFreqE = data.readFloatLE(0);
		data = data.slice(4);
	}
	if (bits6 & 1<<7) {
		// Unused
	}
	
	return unpacked;
}


