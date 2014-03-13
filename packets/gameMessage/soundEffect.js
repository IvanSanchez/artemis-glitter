

exports.name = 'soundEffect';

exports.type = 0xf754c8fe;

exports.subtype = 0x03;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	var filename = data.readString();
	
	return {
		filename: filename,
	}
}


