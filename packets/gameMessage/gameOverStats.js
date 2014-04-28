
// Upon ending a game, tells the main screens the stats (vessels destroyed, etc).

exports.name = 'gameOverStats';

exports.type = 0xf754c8fe;

exports.subtype = 0x15;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {

	var stats = [];
	
	var column = data.readByte();
	
	var separator = data.readByte();

	while(separator != 0xce) {
		var unpacked = {};

		unpacked.count = data.readLong();
		unpacked.label = data.readString();
		stats.push(unpacked);
		
		separator = data.readByte();
	}
	
	return {column: column, stats: stats};
}

