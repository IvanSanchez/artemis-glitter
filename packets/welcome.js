


exports.name = 'welcome';

exports.type = 0x6d04b3da;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	return {str: data.readAsciiString() };
}


