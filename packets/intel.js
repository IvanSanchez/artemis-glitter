
exports.name = 'intel';

exports.type = 0xee665279;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {

	return {
		id:      data.readLong(),
		unknown: data.readByte(),
		msg:     data.readString()
	}
}


