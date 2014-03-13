
// Looks like an update packet, but seems to be empty

// I've only seen this kind of packet with an empty payload,
//   so I'll be ignoring those and outputting a warning
//   otherwise.

exports.name = 'unknownUpdate';

exports.type = 0x80803df9;

exports.subtype = 0x00;
exports.subtypeLength = 1;	// 1 byte -> UInt8

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {

// 	if (data.buffer.length > 28) {
// 		console.warn('Unknown update packet: ', data);
// 	}
	return {};
// 	return false;
}


