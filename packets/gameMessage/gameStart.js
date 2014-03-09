
exports.name = 'gameStart';

exports.type = 0xf754c8fe;

exports.subtype = 0x00;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	return {
		unknown1: data.readUInt32LE(0),
		unknown2: data.readUInt32LE(4)
	}
}


