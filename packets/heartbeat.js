
// Empty packet emmited frequently with no payload, probably 
//   is a heartbeat.


exports.name = 'heartbeat';

exports.type = 0xf5821226;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	return {}
}


