
exports.name = 'gameMessage';

exports.type = 0xf754c8fe;

exports.subtype = 0x0a;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	return {
		msg: data.readString()
	}
}


