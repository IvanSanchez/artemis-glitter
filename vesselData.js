
// Reads vesselData.xml and the *.snt files and stores its data structures in
//   the module's exports

var xml = require("node-xml-lite");
var fs  = require('fs');

/// TODO: Add config directory for vesselData.xml file

var file = fs.readFileSync('dat/vesselData.xml');

// Skip byte-order mark by skipping bytes until a "<" is found.
while(file.readUInt8(0) != 0x3c) {
    file = file.slice(1);
    console.log('Skipped one character');
}

var tree = xml.parseBuffer(file);
console.log(tree);


// Warning! Hard-coded path!

var sntFile = fs.readFileSync('dat/artemis.snt');

for (var i=0; i<sntFile.length; i+=32) {

    var x   = sntFile.readFloatLE(i);
    var y   = sntFile.readFloatLE(i+4);
    var z   = sntFile.readFloatLE(i+8);
    var sys = sntFile.readInt32LE(i+12);

    console.log(x,y,z,sys);

}




exports.vesselData = tree;

