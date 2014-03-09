


exports.name = 'version';

exports.type = 0xe548e74a;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	var unknown = data.readUInt32LE(0);
	var version = data.readFloatLE(4);
	return {unknown: unknown, version: version};
}


