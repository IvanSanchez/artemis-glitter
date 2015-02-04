

// Data types for packet unpacking/packing for the Artemis SBS net protocol.

// With a few ideas borrowed from node-ref. I'm not using node-ref because the data
//   structures here have variable sizes, and I want to pack/unpack them, not read/write
//   from/to memory.


/*
 
 
Data types are plain javascript objects like this:
 
var type = {
	unpack: function(buffer) {},
	  pack: function(buffer, value) {}
}
 
 
Assume that the buffer parameter is a Buffer object with an extra "pointer" property.
The job of both pack and unpack is to read from the buffer at the position indicated
  by the pointer (int, in bytes), and advance the pointer as needed.
 
 
The Artemis SBS net protocol uses Little-Endian everywhere. No reason to implement any
  endianness switching logic here.
 
 */



var int8 = {
	unpack: function(buffer){
		var value = buffer.readUInt8(buffer.pointer);
		buffer.pointer += 1;
		return value;
	},
	pack: function(buffer, value){
		buffer.writeUInt8(value || 0, buffer.pointer);
		buffer.pointer += 1;
	}
}

var int16 = {
	unpack: function(buffer){
		var value = buffer.readUInt16LE(buffer.pointer);
		buffer.pointer += 2;
		return value;
	},
	pack: function(buffer, value){
		buffer.writeUInt16LE(value || 0, buffer.pointer);
		buffer.pointer += 2;
	}
}

var int32 = {
	unpack: function(buffer){
		var value = buffer.readUInt32LE(buffer.pointer);
		buffer.pointer += 4;
		return value;
	},
	pack: function(buffer, value){
// 		console.log('Packing an int32: ', value, ' at ', buffer.pointer);
		buffer.writeUInt32LE(value || 0, buffer.pointer);
		buffer.pointer += 4;
	}
}

var float = {
	unpack: function(buffer){
		var value = buffer.readFloatLE(buffer.pointer);
		buffer.pointer += 4;
		return value;
	},
	pack: function(buffer, value){
		buffer.writeFloatLE(value || 0, buffer.pointer);
		buffer.pointer += 4;
	}
}

var string = {
	unpack: function(buffer){
		var strLen = buffer.readUInt32LE(buffer.pointer) * 2;
		if (strLen > 1024) {
			console.warn ("String length seems too long: ", strLen);
			console.warn ("String chars seems to read: ", buffer.toString('ascii', buffer.pointer+4, buffer.pointer + 8));
		}
		
		var str    = buffer.toString('utf16le', buffer.pointer+4, buffer.pointer + strLen + 2)
// 	var str    = buffer.toString('ascii', this.pointer+4, this.pointer + strLen + 2);
		var strEnd = buffer.readUInt16LE(buffer.pointer + strLen + 2);
		if (strEnd !== 0) {
			console.warn("String does not end with 0x0000!!");
		}
		buffer.pointer += strLen + 4;
// 					console.warn ("Read string:" , str);
		return str;
	},
	pack: function(buffer, str){
		var strLen = str.length;
		buffer.writeUInt32LE(strLen+1, buffer.pointer);
		buffer.pointer += 4;
		
		/// HACK: Node doesn't seem to handle little-endian UTF16 well enough on ARMel CPUs, so let's fall back to ASCII for the time being.
		buffer.write(str,buffer.pointer, strLen*2, 'utf16le');
	// 	this.buffer.write(str,buffer.pointer, strLen*2, 'ascii');
		buffer.pointer += strLen*2;
		buffer.writeUInt16LE(0, buffer.pointer);
		buffer.pointer += 2;
	}
}

var asciiString = {
	unpack: function(buffer){
		// This is only called on the welcome packet; all other strings
		//   are UTF-16.
		var strLen = buffer.readUInt32LE(buffer.pointer);
		
		var str    = buffer.toString('ascii', buffer.pointer+4, buffer.pointer + strLen + 4)
		buffer.pointer += 4 + strLen;
		return str;
	},
	pack: function(buffer, str){
		var strLen = str.length;
		buffer.writeUInt32LE(strLen+1, buffer.pointer);
		buffer.pointer += 4;
		
		/// HACK: Node doesn't seem to handle little-endian UTF16 well enough on ARMel CPUs, so let's fall back to ASCII for the time being.
		buffer.write(str,buffer.pointer, strLen, 'ascii');
	// 	this.buffer.write(str,buffer.pointer, strLen*2, 'ascii');
		buffer.pointer += strLen;
	}
}



// A struct is roughly equal to a map/dictionary, as it will pack and unpack to/from a plain javascript object.
// For any given struct, create a new instance, passing the struct fields in a plain object, e.g.:
// var myStruct = new struct({ name: string, id: int32 });
function struct(fields) {
	this.fieldNames = Object.keys(fields);
	this.fieldTypes = [];
	this.fieldCount = this.fieldNames.length;
	for (var i=0; i<this.fieldCount; i++)  {
		this.fieldTypes[i] = fields[ this.fieldNames[i] ];
	}
}

struct.prototype.unpack = function(buffer) {
	var value = {};
	for (var i=0; i<this.fieldCount; i++)  {
		value[ this.fieldNames[i] ] = this.fieldTypes[i].unpack(buffer);
// 		console.log('struct, ', i, ' pointer ', buffer.pointer, ' value ' , value[ this.fieldNames[i] ]);
	}
	return value;
}

struct.prototype.pack = function(buffer,data) {
	for (var i=0; i<this.fieldCount; i++)  {
		if (data.hasOwnProperty( this.fieldNames[i] )) {
			this.fieldTypes[i].pack(buffer, data[ this.fieldNames[i] ]);
		} else {
			this.fieldTypes[i].pack(buffer, undefined);
		}
	}
}





// Pretty much like a struct, but prepended by a bitmap - if a bit is 1, then the field
//   is defined; if 0, the value for that field is undefined.
// The order in which the fields is defined is obviously critical to match the bits in the bitmap!
// Bitmap length is always in bytes. Some of the bits might be unused.
function bitmapstruct(bitmapLength,fields) {
	this.bitmapLength = bitmapLength;
	this.fieldNames = Object.keys(fields);
	this.fieldTypes = [];
	this.fieldCount = this.fieldNames.length;
	for (var i=0; i<this.fieldCount; i++)  {
		this.fieldTypes[i] = fields[ this.fieldNames[i] ];
	}
}

bitmapstruct.prototype.unpack = function(buffer) {
	var bitmap = Array(this.bitmapLength);
	for (var i=0; i<this.bitmapLength; i++)  {
		bitmap[i] = (int8.unpack(buffer));
	}
	var value = {};
	var i = 0;
	for (var byte=0; byte<this.bitmapLength; byte++)  {
		for (var bit=0; bit<8 && i< this.fieldCount; bit++)  {
			if (bitmap[byte] & 1<<bit ) {
// 				console.log(i, this.fieldNames[i], this.fieldTypes[i]);
				value[ this.fieldNames[i] ] = this.fieldTypes[i].unpack(buffer);
// 				console.log(value[ this.fieldNames[i] ]);
			} else {
// 				value[ this.fieldNames[i] ] = undefined;
			}
			i++;
		}
	}
	return value;
}

bitmapstruct.prototype.pack = function(buffer,data) {
	var bitmap = Array(this.bitmapLength);
	for (var i=0; i<this.bitmapLength; i++)  {
		bitmap[i]=0;
	}
	
	var i = 0;
	for (var byte=0; byte<this.bitmapLength; byte++)  {
		for (var bit=0; bit<8; bit++)  {
			if (data.hasOwnProperty( this.fieldNames[i] )) {
				bitmap[byte] += 1<<bit;
			}
			i++;
		}
		int8.pack(buffer, bitmap[byte]);
	}
	
	for (var i=0; i<this.fieldCount; i++)  {
		if (data.hasOwnProperty( this.fieldNames[i] )) {
			this.fieldTypes[i].pack(buffer, data[ this.fieldNames[i] ]);
		}
	}
}








// Similar in the construction to a bitmapstruct, this is basically multiple
//   structs one after the other, 1-indexed.
function staticsizearray(length, fields) {
	this._length = length;
	this._struct = new struct(fields);
}

staticsizearray.prototype.unpack = function(buffer) {
	var value = [];
	for (var i = 0; i < this._length; i++) {
// 		console.log('staticsizearray, i ', i, ' pointer ', buffer.pointer);
		value[i+1] = this._struct.unpack(buffer);
// 		console.log(value[i]);
	}
	return value;
}

staticsizearray.prototype.pack = function(buffer,data) {
	for (var i = 0; i < this._length; i++) {
		this._struct.pack(buffer, data[i+1] || {});
	}
}







// An array with an arbitrary number of concatenated structs. If the byte
//   after a struct is equal to the given boundary marker, that's the end of the
//   array.
function byteboundarray(marker, fields) {
	this._marker = marker;
	this._struct = new struct(fields);
}

byteboundarray.prototype.unpack = function(buffer) {
	var value = [];
	var i = 0;
	while (buffer.readUInt8(buffer.pointer) !== this._marker) {
// 		console.log('staticsizearray, i ', i, ' pointer ', buffer.pointer);
		value[i+1] = this._struct.unpack(buffer);
// 		console.log(value[i]);
		i +=1 ;
	}
	buffer.pointer += 1;
	return value;
}

byteboundarray.prototype.pack = function(buffer,data) {
	for (var i = 0; i < data.length; i++) {
		this._struct.pack(buffer, data[i+1] || {});
	}
	buffer.writeUInt8(this._marker, buffer.pointer);
}








module.exports = {
	int8:  int8,
	int16: int16,
	int32: int32,
	float: float,
	string: string,
	asciiString: asciiString,
	struct: struct,
	bitmapstruct: bitmapstruct,
	staticsizearray: staticsizearray,
	byteboundarray: byteboundarray
}


