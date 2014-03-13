
// Notifies the client that an object has been removed from play.

exports.name = 'destroyObject';

exports.type = 0xcc5a3e30;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
// 	var type = data.readUInt8(0);
// 	var id   = data.readUInt32LE(1);

	return {
		type: data.readByte(),
		id:   data.readLong()
	}
}


