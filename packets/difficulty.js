
exports.name = 'difficulty';

exports.type = 0x3de66711;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	return {difficulty: data.readLong()};
}


