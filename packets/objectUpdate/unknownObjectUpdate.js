
// Provides an update on the status of a space monster.


exports.name = 'upgradesUpdate';

exports.type = 0x80803df9;

exports.subtype = 0x04;
exports.subtypeLength = 1;	// 1 byte -> UInt8

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	var unpacked = {};
	
	unpacked.id = data.readLong();
	
	var bits = data.readBitArray(7);
	
	// This is all guesswork, I haven't seen any changing values in this packet.
	
	// The game UI displays 28 possible upgrades.
	// There is a 7-byte bitmask with 56 bits (28*2). 
	// Then there is a 4-byte word with 28 (out of 32) bits set to 1. Maybe upgrades possible for this ship?
	// Then, there are 28 4-byte words, all zeroed out. Are these one 4-byte or 2 2-bytes data fields per upgrade?
	// How does this map to the bitmap??
	
	// The bits are in big-endian, and the docs are in little-endian!
	// This is why this seems backwards :-(
	if (bits.get(7)) {  unpacked.unknown07 = data.readLong();}
	if (bits.get(6)) {  unpacked.unknown06 = data.readLong();}
	if (bits.get(5)) {  unpacked.unknown05 = data.readLong();}
	if (bits.get(4)) {  unpacked.unknown04 = data.readLong();}
	if (bits.get(3)) {  unpacked.unknown03 = data.readLong();}
	if (bits.get(2)) {  unpacked.unknown02 = data.readLong();}
	if (bits.get(1)) {  unpacked.unknown01 = data.readLong(); }
	if (bits.get(0)) {  unpacked.unknown00 = data.readLong(); }
	                              
	if (bits.get(15)) { unpacked.unknown15 = data.readLong();}
	if (bits.get(14)) { unpacked.unknown14 = data.readLong(); }
	if (bits.get(13)) { unpacked.unknown13 = data.readLong(); }
	if (bits.get(12)) { unpacked.unknown12 = data.readLong();}
	if (bits.get(11)) { unpacked.unknown11 = data.readLong();}
	if (bits.get(10)) { unpacked.unknown10 = data.readLong();}
	if (bits.get(9))  { unpacked.unknown09 = data.readLong();}
	if (bits.get(8))  { unpacked.unknown08 = data.readLong();}
	                              
	if (bits.get(23)) { unpacked.unknown23 = data.readLong();}
	if (bits.get(22)) { unpacked.unknown22 = data.readLong();}
	if (bits.get(21)) { unpacked.unknown21 = data.readLong();}
	if (bits.get(20)) { unpacked.unknown20 = data.readLong();}
	if (bits.get(19)) { unpacked.unknown19 = data.readLong();}
	if (bits.get(18)) { unpacked.unknown18 = data.readLong();}
	if (bits.get(17)) { unpacked.unknown17 = data.readLong();}
	if (bits.get(16)) { unpacked.unknown16 = data.readLong();}  
	                              
// 	if (bits.get(31)) { unpacked.unknown31 = data.readLong(); }
// 	if (bits.get(30)) { unpacked.unknown30 = data.readByte(); }
// 	if (bits.get(29)) { unpacked.unknown29 = data.readLong();}  
// 	if (bits.get(28)) { unpacked.unknown28 = data.readLong(); }
	if (bits.get(27)) { unpacked.unknown27 = data.readLong(); }
	if (bits.get(26)) { unpacked.unknown26 = data.readLong(); }
	if (bits.get(25)) { unpacked.unknown25 = data.readLong(); }
	if (bits.get(24)) { unpacked.unknown24 = data.readLong(); }
	                              
// 	if (bits.get(39)) { unpacked.unknown = data.readLong(); }
// 	if (bits.get(38)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(37)) { unpacked.unknown = data.readFloat();}  
// 	if (bits.get(36)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(35)) { unpacked.unknown = data.readFloat(); }
// 	if (bits.get(34)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(33)) { unpacked.unknown = data.readLong(); }
// 	if (bits.get(32)) { unpacked.unknown = data.readLong();  }
// 	
// 	if (bits.get(47)) { unpacked.unknown = data.readLong(); }
// 	if (bits.get(46)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(45)) { unpacked.unknown = data.readFloat();}  
// 	if (bits.get(44)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(43)) { unpacked.unknown = data.readFloat(); }
// 	if (bits.get(42)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(41)) { unpacked.unknown = data.readLong(); }
// 	if (bits.get(40)) { unpacked.unknown = data.readLong();  }
// 	
// 	if (bits.get(55)) { unpacked.unknown = data.readLong(); }
// 	if (bits.get(54)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(53)) { unpacked.unknown = data.readFloat();}  
// 	if (bits.get(52)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(51)) { unpacked.unknown = data.readFloat(); }
// 	if (bits.get(50)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(49)) { unpacked.unknown = data.readLong(); }
// 	if (bits.get(48)) { unpacked.unknown = data.readLong();  }
// 	
// 	if (bits.get(63)) { unpacked.unknown = data.readLong(); }
// 	if (bits.get(62)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(61)) { unpacked.unknown = data.readFloat();}  
// 	if (bits.get(60)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(59)) { unpacked.unknown = data.readFloat(); }
// 	if (bits.get(58)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(57)) { unpacked.unknown = data.readLong(); }
// 	if (bits.get(56)) { unpacked.unknown = data.readLong();  }
// 	
// 	if (bits.get(71)) { unpacked.unknown = data.readLong(); }
// 	if (bits.get(70)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(69)) { unpacked.unknown = data.readFloat();}  
// 	if (bits.get(68)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(67)) { unpacked.unknown = data.readFloat(); }
// 	if (bits.get(66)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(65)) { unpacked.unknown = data.readLong(); }
// 	if (bits.get(64)) { unpacked.unknown = data.readLong();  }
// 	
// 	if (bits.get(79)) { unpacked.unknown = data.readLong(); }
// 	if (bits.get(78)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(77)) { unpacked.unknown = data.readFloat();}  
// 	if (bits.get(76)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(75)) { unpacked.unknown = data.readFloat(); }
// 	if (bits.get(74)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(73)) { unpacked.unknown = data.readLong(); }
// 	if (bits.get(72)) { unpacked.unknown = data.readLong();  }
// 	
// 	if (bits.get(87)) { unpacked.unknown = data.readLong(); }
// 	if (bits.get(86)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(85)) { unpacked.unknown = data.readFloat();}  
// 	if (bits.get(84)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(83)) { unpacked.unknown = data.readFloat(); }
// 	if (bits.get(82)) { unpacked.unknown = data.readByte(); }
// 	if (bits.get(81)) { unpacked.unknown = data.readLong(); }
// 	if (bits.get(80)) { unpacked.unknown = data.readLong();  }
	
	console.log('Upgrades update: ', unpacked);
	
	return unpacked;
}


