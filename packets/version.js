


exports.name = 'version';

exports.type = 0xe548e74a;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	var unknown = data.readLong();
	var version = data.readFloat();
	
	// Version is checked here too, as the packet defs
	//   depend on it.
	if (version === 2) {
		console.log('Cool, we have connected to a supported version of Artemis!');
	} else {
		console.warn('Unsupported version of Artemis!!!');
	}
	
	return {
		unknown: unknown,
		version: version
	};
};


