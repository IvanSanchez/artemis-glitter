
exports.name = 'incomingAudio';

exports.type = 0xae88e058;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	var id       = data.readUInt32LE(0);
	var mode     = data.readUInt32LE(4);
	var strLen   = data.readUInt32LE(8) * 2;
	var title    = data.toString('utf16le', 12, 12+strLen-2);
	data = data.slice(12 + strLen );
	var strLen   = data.readUInt32LE(0) * 2;
	var filename = data.readUInt32LE(4+strLen);
	
	return {
		id: id,
		mode: mode,
		title: title,
		filename: filename
	}
}


