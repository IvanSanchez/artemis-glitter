
exports.name = 'gameMessage';

exports.type = 0xf754c8fe;

exports.subtype = 0x0a;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	var strLen = data.readUInt32LE(0) * 2;
	var msg    = data.toString('utf16le', 4, 4+strLen-2);
	
	return {
		msg: msg
	}
}


