
// Provides an update on the status of any other ship.


exports.name = 'npcUpdate';

exports.type = 0x80803df9;

exports.subtype = 0x04;
exports.subtypeLength = 1;	// 1 byte -> UInt8

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	var unpacked = {};
	
	unpacked.id = data.readLong(0);
	
	var bits = data.readBitArray(6);
	
	// The bits are in big-endian, and the docs are in little-endian!
	// This is why this seems backwards :-(
	if (bits.get(7)) { unpacked.shipName       = data.readString();}
	if (bits.get(6)) { unpacked.unknown1       = data.readFloat();}
	if (bits.get(5)) { unpacked.rudder         = data.readFloat();}
	if (bits.get(4)) { unpacked.impulseMax     = data.readFloat();}
	if (bits.get(3)) { unpacked.turnRateMax    = data.readFloat();}
	if (bits.get(2)) { unpacked.isEnemy        = data.readLong(); }
	if (bits.get(1)) { unpacked.shipType       = data.readLong(); }
	if (bits.get(0)) { unpacked.posX           = data.readFloat();}
	
	if (bits.get(15)) { unpacked.posY           = data.readFloat();}
	if (bits.get(14)) { unpacked.posZ           = data.readFloat();}
	if (bits.get(13)) { unpacked.pitch          = data.readFloat();}
	if (bits.get(12)) { unpacked.roll           = data.readFloat();}
	if (bits.get(11)) { unpacked.heading        = data.readFloat();}
	if (bits.get(10)) { unpacked.velocity       = data.readFloat();}
	if (bits.get(9))  { unpacked.surrendered    = data.readByte(); }
	if (bits.get(8))  { unpacked.unknown4       = data.readShort();}
	
	if (bits.get(23)) { unpacked.forShields     = data.readFloat();}
	if (bits.get(22)) { unpacked.forShieldsMax  = data.readFloat();}
	if (bits.get(21)) { unpacked.aftShields     = data.readFloat();}
	if (bits.get(20)) { unpacked.aftShieldsMax  = data.readFloat();}
	if (bits.get(19)) { unpacked.unknown5       = data.readShort();}
	if (bits.get(18)) { unpacked.unknown6       = data.readByte(); }
	if (bits.get(17)) { unpacked.eliteBits      = data.readLong(); }
	if (bits.get(16)) { unpacked.eliteBitsActive= data.readLong();}  
	
	if (bits.get(31)) { unpacked.scanned        = data.readLong(); }
	if (bits.get(30)) { unpacked.faction        = data.readLong(); }
	if (bits.get(29)) { unpacked.unknown7       = data.readLong(); }  
	if (bits.get(28)) { unpacked.unknown8       = data.readByte(); }
	if (bits.get(27)) { unpacked.unknown9       = data.readByte(); }
	if (bits.get(26)) { unpacked.unknown10      = data.readByte(); }
	if (bits.get(25)) { unpacked.unknown11      = data.readByte(); }
	if (bits.get(24)) { unpacked.unknown12      = data.readFloat();}
	
	if (bits.get(39)) { unpacked.unknown13      = data.readLong(); }
	if (bits.get(38)) { unpacked.unknown14      = data.readLong(); }
	if (bits.get(37)) { unpacked.damageBeams    = data.readFloat();}  
	if (bits.get(36)) { unpacked.damageTorpedoes= data.readFloat();}
	if (bits.get(35)) { unpacked.damageSensors  = data.readFloat();}
	if (bits.get(34)) { unpacked.damageManeuver = data.readFloat();}
	if (bits.get(33)) { unpacked.damageImpulse  = data.readFloat();}
	if (bits.get(32)) { unpacked.damageWarp     = data.readFloat();}
	
	if (bits.get(47)) { unpacked.damageForShield= data.readFloat();}
	if (bits.get(46)) { unpacked.damageAftShield= data.readFloat();}
	if (bits.get(45)) { unpacked.shieldFreqA    = data.readFloat();}  
	if (bits.get(44)) { unpacked.shieldFreqB    = data.readFloat();}
	if (bits.get(43)) { unpacked.shieldFreqC    = data.readFloat();}
	if (bits.get(42)) { unpacked.shieldFreqD    = data.readFloat();}
	if (bits.get(41)) { unpacked.shieldFreqE    = data.readFloat();}
	if (bits.get(40)) { /* Unused */ }
	
	return unpacked;
}


