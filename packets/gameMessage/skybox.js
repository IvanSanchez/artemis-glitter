
// Upon starting a game, tells the client which skybox to use as
//   a background.

exports.name = 'skybox';

exports.type = 0xf754c8fe;

exports.subtype = 0x09;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	var skyboxID = data.readLong();
	return {
		skyboxID: skyboxID,
	}
}


