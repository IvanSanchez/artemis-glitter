
// Pretty much a duplicate of destroyObject, for no reason.


exports.name = 'destroyUpdate';

exports.type = 0x80803df9;

exports.subtype = 0x00;
exports.subtypeLength = 1;	// 1 byte -> UInt8

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	var unpacked = {};
	
	unpacked.entityType = data.readLong();
	unpacked.id = data.readLong();
	
	return unpacked;
}


