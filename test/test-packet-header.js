

var header = require('../lib/packet-header');


var buffer = new Buffer(24);
buffer.pointer = 0;



header.pack(buffer,{
	magic: 0xdeadbeef,
	packetLength: 24,
	origin: 0,
	bytesRemaining: 4,
	type: 0x12345678
});



buffer.pointer = 0;
var result = header.unpack(buffer);


console.log(result);
console.log(buffer);


