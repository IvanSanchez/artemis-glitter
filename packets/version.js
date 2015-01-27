


exports.name = 'version';

exports.type = 0xe548e74a;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	var unknown1 = data.readLong();

	var versionFloat = data.peekFloat();

	try {
// 		var unknown1 = data.readLong();
		var unknown2 = data.readLong();
		var major = data.readLong();
		var minor = data.readLong();
		var patch = data.readLong();

		if (major == 2 && minor == 1 && patch >= 5) {
			console.log('Cool, we have connected to a supported version of Artemis!');
		} else {
			console.warn('Unsupported version of Artemis!!!');
		}

		return {
			unknown1: unknown1,
			unknown2: unknown2,
			major: major,
			minor: minor,
			patch: patch
		};

	} catch(e) {
		console.warn('Unsupported version of Artemis!!!');
		return {
			unknown: unknown,
			major: Math.floor(versionFloat),
			minor: versionFloat % 1,
			patch: null
		};
	}

};


