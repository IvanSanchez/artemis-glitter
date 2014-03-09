


exports.name = 'welcome';

exports.type = 0x6d04b3da;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	var length = data.readUInt32LE(0);
	var str    = data.slice(4, 4+length).toString('ascii');
	return {length: length, str: str};
}


