
// Provides an update on the status of any other ship.


exports.name = 'stationUpdate';

exports.type = 0x80803df9;

exports.subtype = 0x06;
exports.subtypeLength = 1;	// 1 byte -> UInt8

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	// This is a little different from other packet types. We'll actually
	//   return an array of entities instead of just one entity.
// 	var stations = [];
// 	
// 	// Little hack, rewind the reader pointer by one in order 
// 	//   to peek at the next 0x05
// 	data.pointer--;
// 	
// 	while(data.pointer < data.buffer.length)
// 	{
// 		if (data.readByte() != 5) {
// 			return stations;
// 		}
// 		
	var unpacked = {};
	
	unpacked.id = data.readLong(0);
	
	var bits = data.readBitArray(2);
	
	// The bits are in big-endian, and the docs are in little-endian!
	// This is why this seems backwards :-(
	if (bits.get(7)) { unpacked.shipName       = data.readString();}
	if (bits.get(6)) { unpacked.forShields     = data.readFloat();}
	if (bits.get(5)) { unpacked.aftShields     = data.readFloat();}
	if (bits.get(4)) { unpacked.unknown1       = data.readLong(); }
	if (bits.get(3)) { unpacked.shipType       = data.readLong(); }
	if (bits.get(2)) { unpacked.posX           = data.readFloat();}
	if (bits.get(1)) { unpacked.posY           = data.readFloat();}
	if (bits.get(0)) { unpacked.posZ           = data.readFloat();}
	
	if (bits.get(15)) { unpacked.unknown2       = data.readLong(); }
	if (bits.get(14)) { unpacked.unknown3       = data.readLong(); }
	if (bits.get(13)) { unpacked.unknown4       = data.readLong(); }
	if (bits.get(12)) { unpacked.unknown5       = data.readShort(); }
	if (bits.get(11)) { unpacked.unknown6       = data.readShort(); }
	if (bits.get(10)) { unpacked.unknown7       = data.readShort(); }
	if (bits.get(9))  { unpacked.unknown8       = data.readShort(); }
	if (bits.get(8))  { unpacked.unknown9       = data.readShort(); }	// Unused

	return unpacked;
		
// 		stations.push(unpacked);
// 	}
// 	return stations;
}


