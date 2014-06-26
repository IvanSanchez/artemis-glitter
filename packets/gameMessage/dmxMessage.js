
exports.name = 'dmxMessage';

exports.type = 0xf754c8fe;

exports.subtype = 0x10;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	var unpacked = {};
	
	unpacked.str = data.readString();
	unpacked.on  = data.readLong();
	
	console.log(unpacked);
	
	return unpacked;
}


