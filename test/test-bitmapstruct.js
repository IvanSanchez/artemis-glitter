

var packet = require('../lib/packet-defs');


var buffer = new Buffer(2048);
buffer.pointer = 0;

console.log(packet.version);

packet.version.fields.pack(buffer,{
	major: 1,
	minor: 0,
	patch: 0
});


console.log(buffer);

buffer.pointer = 0;
var result = packet.version.fields.unpack(buffer);

console.log(result);

console.log('---------');



buffer.pointer = 0;


packet.nebula.fields.pack(buffer,{
	posX: 14796.23,
	posY: 12.4,
	posZ: 86339.74,
	colorR: 0.25
});

console.log(buffer);

buffer.pointer = 0;
var result = packet.nebula.fields.unpack(buffer);

console.log(result);
