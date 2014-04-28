
exports.name = 'commsIncoming';

exports.type = 0xd672c35f;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	return {
		priority: data.readLong(),
		sender:   data.readString(),
		msg:      data.readString()
	}
}

/*
Possible values for "priority":

0: We will surrender

1:

2:

3:

4: We're under attack

5:

6: We've produced another missile

7: Help us help you

8: Will you surrender?!

*/