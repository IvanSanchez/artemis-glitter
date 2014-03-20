


exports.name = 'ready';

exports.type = 0x4c821d3c;

exports.subtype = 0x0f;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = function(writer, data) {
	writer.writeLong(0);
}

exports.unpack = null;	// Only from client to server


