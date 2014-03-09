
exports.name = 'intel';

exports.type = 0xee665279;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	var id      = data.readUInt32LE(0) * 2;
	var unknown = data.readUInt32LE(4) * 2;
	var strLen  = data.readUInt32LE(5) * 2;
	var msg     = data.toString('utf16le', 9, 9+strLen-2);
	
	return {
		id: id,
		unknown: unknown,
		msg: msg
	}
}


