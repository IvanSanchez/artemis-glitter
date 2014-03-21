

// FIXME: This doesn't seem to be sent on game start. Yeah, it is sent once
//   when starting the game.
// It is, however, sent whenever a player torp hits something (is deleted from
//   the model) or when some enemy explodes (is deleted from the model)

exports.name = 'gameRestart';

exports.type = 0xf754c8fe;

exports.subtype = 0x08;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	return {}
}


