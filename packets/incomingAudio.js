
exports.name = 'incomingAudio';

exports.type = 0xae88e058;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {

	var unpacked = {};
	
	unpacked.id   = data.readLong();
	unpacked.mode = data.readLong();
	// 0 = delete
	// 1 = played
	// 2 = incoming

	if (unpacked.mode == 2) {
		unpacked.title    = data.readString();
		unpacked.filename = data.readString();
	}
	
	return unpacked;
}
