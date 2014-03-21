
// FIXME: This doesn't seem to be sent on game restart.
// It is, however, sent whenever the player fires a torp, 

exports.name = 'gameStart';

exports.type = 0xf754c8fe;

exports.subtype = 0x00;
exports.subtypeLength = 4;	// 4 bytes -> UInt32LE

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
// 	var unknown1 = data.readLong();
// 	var unknown2 = data.readLong();

	/// FIXME: This seems to be emitted when an enemy ship is destroyed:
// Known packet:  gameStart { unknown1: 4, unknown2: 1176 }
// Known packet:  destroyObject { type: 4, id: 1176 }


	return {
		unknown1: data.readLong(),
		unknown2: data.readLong()
	}
}


