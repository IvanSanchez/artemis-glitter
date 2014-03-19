


exports.name = 'setStation';

exports.type = 0x4c821d3c;

exports.subtype = 0x0e;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = function(writer, data) {
	
	writer.writeLong(data.station);
	writer.writeLong(data.selected);
}

exports.unpack = null;	// Only from client to server


