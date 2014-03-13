
exports.name = 'incomingAudio';

exports.type = 0xae88e058;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	return {
		id:       data.readLong(),
		mode:     data.readLong(),
		title:    data.readString(),
		filename: data.readString()
	}
}


