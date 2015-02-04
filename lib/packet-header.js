

var type = require('./data-types');


var packetHeader = new (type.struct)({
	magic:          type.int32,
	packetLength:   type.int32,
	origin:         type.int32, // 1 = from server; 2 = from client
	unknown:        type.int32,
	bytesRemaining: type.int32,
	type:           type.int32
});



module.exports = packetHeader;

