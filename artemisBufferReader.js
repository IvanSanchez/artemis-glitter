
// Helper class for reading/writing packets.
// Not really needed, but makes the code much more readable.
// It basically offers a wrapper of Buffer, with an internal
//   pointer that is updated as more bytes are consumed.

var bitarray = require('node-bitarray');


var artemisBufferReader = function(buffer) {
	this.buffer = buffer;
	this.pointer = 0;
};

artemisBufferReader.prototype.readString = function() {
	var strLen = this.buffer.readUInt32LE(this.pointer) * 2;
	/// HACK: Node doesn't seem to handle little-endian UTF16 well enough on ARMel CPUs, so let's fall back to ASCII for the time being.
	var str    = this.buffer.toString('utf16le', this.pointer+4, this.pointer + strLen + 2)
// 	var str    = this.buffer.toString('ascii', this.pointer+4, this.pointer + strLen + 2);
	var strEnd = this.buffer.readUInt16LE(this.pointer + strLen + 2);
	if (strEnd !== 0) {
		console.warn("String does not end with 0x0000!!");
	}
	
	this.pointer += 4 + strLen;
	return str;
};

artemisBufferReader.prototype.readAsciiString = function() {
	// This is only called on the welcome packet; all other strings
	//   are UTF-16.
	var strLen = this.buffer.readUInt32LE(this.pointer);
	var str    = this.buffer.toString('ascii', this.pointer+4, this.pointer + strLen + 4)
	this.pointer += 4 + strLen;
	return str;
};

artemisBufferReader.prototype.readByte = function() {
	var number = this.buffer.readUInt8(this.pointer);
	this.pointer += 1;
	return number;
};

artemisBufferReader.prototype.readShort = function() {
	var number = this.buffer.readUInt16LE(this.pointer);
	this.pointer += 2;
	return number;
};

artemisBufferReader.prototype.readLong = function() {
	var number = this.buffer.readUInt32LE(this.pointer);
	this.pointer += 4;
	return number;
};

artemisBufferReader.prototype.readFloat = function() {
	var number = this.buffer.readFloatLE(this.pointer);
	this.pointer += 4;
	return number;
};

artemisBufferReader.prototype.readBitArray = function(bytes) {
	var slice = this.buffer.slice(this.pointer, this.pointer+bytes);
	var bits = bitarray.fromBuffer(slice);
	this.pointer += bytes;
	return bits;
}



// Like readByte, but doesn't advance the pointer. Used for checking array bounds.
artemisBufferReader.prototype.peekByte = function() {
	return this.buffer.readUInt8(this.pointer);
};

// Like readShort, but doesn't advance the pointer. Used for checking array bounds.
artemisBufferReader.prototype.peekShort = function() {
	return this.buffer.readUInt16LE(this.pointer);
};





artemisBufferReader.prototype.writeByte = function(data) {
	var number = this.buffer.writeUInt8(data,this.pointer);
	this.pointer += 1;
	return number;
};

artemisBufferReader.prototype.writeShort = function(data) {
	var number = this.buffer.writeUInt16LE(data,this.pointer);
	this.pointer += 2;
	return number;
};

artemisBufferReader.prototype.writeLong = function(data) {
	var number = this.buffer.writeUInt32LE(data,this.pointer);
	this.pointer += 4;
	return number;
};

artemisBufferReader.prototype.writeFloat = function(data) {
	var number = this.buffer.writeFloatLE(data,this.pointer);
	this.pointer += 4;
	return number;
};

/// FIXME!!!
// artemisBufferReader.prototype.writeBitArray = function(bytes) {
// 	var slice = this.buffer.slice(this.pointer, this.pointer+bytes);
// 	var bits = bitarray.fromBuffer(slice);
// 	this.pointer += bytes;
// 	return bits;
// }






exports.artemisBufferReader = artemisBufferReader;

