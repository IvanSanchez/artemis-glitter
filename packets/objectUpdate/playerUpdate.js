
// Provides an update on the status of the player ship.


exports.name = 'playerUpdate';

exports.type = 0x80803df9;

exports.subtype = 0x01;
exports.subtypeLength = 1;	// 1 byte -> UInt8

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	var unpacked = {};
	unpacked.id = data.readLong(0);

	var bits = data.readBitArray(5);
	
	// The bits are in big-endian, and the docs are in little-endian!
	// This is why this seems backwards :-(
	if (bits.get(7)) { unpacked.weaponsTarget = data.readLong(); }
	if (bits.get(6)) { unpacked.impulse       = data.readFloat();}
	if (bits.get(5)) { unpacked.rudder        = data.readFloat();}
	if (bits.get(4)) { unpacked.maxImpulse    = data.readFloat();}
	if (bits.get(3)) { unpacked.turnRate      = data.readFloat();}
	if (bits.get(2)) { unpacked.autoBeams     = data.readByte(); }
	if (bits.get(1)) { unpacked.warp          = data.readByte(); }
	if (bits.get(0)) { unpacked.energy        = data.readFloat();}
	
	if (bits.get(15)) { unpacked.shieldState   = data.readShort();}
	if (bits.get(14)) { unpacked.shipNumber    = data.readLong(); }
	if (bits.get(13)) { unpacked.shipType      = data.readLong(); }
	if (bits.get(12)) { unpacked.posX          = data.readFloat();}
	if (bits.get(11)) { unpacked.posY          = data.readFloat();}
	if (bits.get(10)) { unpacked.posZ          = data.readFloat();}
	if (bits.get(9))  { unpacked.pitch         = data.readFloat();}
	if (bits.get(8))  { unpacked.roll          = data.readFloat();}
	
	if (bits.get(23)) { unpacked.heading       = data.readFloat();}
	if (bits.get(22)) { unpacked.velocity      = data.readFloat();}
	if (bits.get(21)) { unpacked.unknown1      = data.readShort();}
	if (bits.get(20)) { unpacked.shipName      = data.readString();}
	if (bits.get(19)) { unpacked.forShields    = data.readFloat();}
	if (bits.get(18)) { unpacked.forShieldsMax = data.readFloat();}
	if (bits.get(17)) { unpacked.aftShields    = data.readFloat();}
	if (bits.get(16)) { unpacked.aftShieldsMax = data.readFloat();}  
	
	// ID of the station I'm docking with
	if (bits.get(31)) { unpacked.docking       = data.readLong(); }
	if (bits.get(30)) { unpacked.redAlert      = data.readByte(); }
	if (bits.get(29)) { unpacked.unknown2      = data.readFloat();}  
	if (bits.get(28)) { unpacked.mainScreen    = data.readByte(); }
	if (bits.get(27)) { unpacked.beamFrequency = data.readByte(); }
	if (bits.get(26)) { unpacked.coolantAvailable = data.readByte(); }
	if (bits.get(25)) { unpacked.scienceTarget = data.readLong(); }
	if (bits.get(24)) { unpacked.captainTarget = data.readLong(); }
	
	if (bits.get(39)) { unpacked.driveType     = data.readLong(); }
	if (bits.get(38)) { unpacked.scanningTarget= data.readByte(); }
	if (bits.get(37)) { unpacked.scanningProgress= data.readFloat();}  
	if (bits.get(36)) { unpacked.reverse       = data.readByte(); }
	if (bits.get(35)) { unpacked.unknown3      = data.readFloat(); } // Updated every time the dive/rise control is changed.
	if (bits.get(34)) { unpacked.unknown4      = data.readByte(); }
	if (bits.get(33)) { unpacked.unknown5      = data.readLong(); }
	if (bits.get(32)) { /* Unused */ }
	
	return unpacked;
}


