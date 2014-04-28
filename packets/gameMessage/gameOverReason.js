
// When the game ends, tells the main screen consoles why the game has ended.

exports.name = 'gameOverReason';

exports.type = 0xf754c8fe;

exports.subtype = 0x14;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	var unpacked = {};
	
	unpacked.title    = data.readString();
	unpacked.reason = data.readString();
	
	return (unpacked);
}


