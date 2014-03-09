
exports.name = 'commsIncoming';

exports.type = 0xd672c35f;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	var priority = data.readUInt32LE(0);
	var strLen   = data.readUInt32LE(4) * 2;
	var sender   = data.toString('utf16le', 8, 8+strLen-2);
	data = data.slice(8 + strLen);

	strLen  = data.readUInt32LE(0) * 2;
	var msg = data.toString('utf16le', 4, 4+strLen-2);
	
	return {
		priority: priority,
		sender: sender,
		msg: msg
	}
}


