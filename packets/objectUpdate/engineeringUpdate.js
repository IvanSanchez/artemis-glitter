
// Provides an update on the status of the player ship.


exports.name = 'engineeringUpdate';

exports.type = 0x80803df9;

exports.subtype = 0x03;
exports.subtypeLength = 1;	// 1 byte -> UInt8

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	var unpacked = {};
	
	unpacked.id = data.readLong(0);
	
	var bits = data.readBitArray(4);
	
	// The bits are in big-endian, and the docs are in little-endian!
	// This is why this seems backwards :-(
	if (bits.get(7)) { unpacked.heatBeams     = data.readFloat();}
	if (bits.get(6)) { unpacked.heatTorpedoes = data.readFloat();}
	if (bits.get(5)) { unpacked.heatSensors   = data.readFloat();}
	if (bits.get(4)) { unpacked.heatManeuver  = data.readFloat();}
	if (bits.get(3)) { unpacked.heatImpulse   = data.readFloat();}
	if (bits.get(2)) { unpacked.heatWarp      = data.readFloat();}
	if (bits.get(1)) { unpacked.heatForShields= data.readFloat();}
	if (bits.get(0)) { unpacked.heatAftShields= data.readFloat();}
	
	if (bits.get(15)) { unpacked.energyBeams     = data.readFloat();}
	if (bits.get(14)) { unpacked.energyTorpedoes = data.readFloat();}
	if (bits.get(13)) { unpacked.energySensors   = data.readFloat();}
	if (bits.get(12)) { unpacked.energyManeuver  = data.readFloat();}
	if (bits.get(11)) { unpacked.energyImpulse   = data.readFloat();}
	if (bits.get(10)) { unpacked.energyWarp      = data.readFloat();}
	if (bits.get(9))  { unpacked.energyForShields= data.readFloat();}
	if (bits.get(8))  { unpacked.energyAftShields= data.readFloat();}
	
	if (bits.get(23)) { unpacked.coolantBeams     = data.readByte();}
	if (bits.get(22)) { unpacked.coolantTorpedoes = data.readByte();}
	if (bits.get(21)) { unpacked.coolantSensors   = data.readByte();}
	if (bits.get(20)) { unpacked.coolantManeuver  = data.readByte();}
	if (bits.get(19)) { unpacked.coolantImpulse   = data.readByte();}
	if (bits.get(18)) { unpacked.coolantWarp      = data.readByte();}
	if (bits.get(17)) { unpacked.coolantForShields= data.readByte();}
	if (bits.get(16)) { unpacked.coolantAftShields= data.readByte();}  
	
	// Last byte of the bytefield seems to be unused.
// 	if (bits.get(31)) { unpacked.heatBeams     = data.readLong(); }
// 	if (bits.get(30)) { unpacked.heatTorpedoes = data.readByte(); }
// 	if (bits.get(29)) { unpacked.heatSensors   = data.readFloat();}  
// 	if (bits.get(28)) { unpacked.heatManeuver  = data.readByte(); }
// 	if (bits.get(27)) { unpacked.heatImpulse   = data.readByte(); }
// 	if (bits.get(26)) { unpacked.heatWarp      = data.readByte(); }
// 	if (bits.get(25)) { unpacked.heatForShields= data.readLong(); }
// 	if (bits.get(24)) { unpacked.heatAftShields= data.readLong(); }
	
	console.log('Engineering update: ',unpacked);
	
	return unpacked;
}


