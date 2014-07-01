
// Reads vesselData.xml and the *.snt files and stores its data structures in
//   the module's exports

var xml = require("node-xml-lite");
var fs  = require('fs');
var config = require('config');

console.log(config);

/// TODO: Add config directory for vesselData.xml file

var file = fs.readFileSync(config.datDir + '/vesselData.xml');

// Skip byte-order mark by skipping bytes until a "<" is found.
while(file.readUInt8(0) != 0x3c) {
    file = file.slice(1);
    console.log('Skipped one character');
}

var tree = xml.parseBuffer(file);

exports.version = tree.attrib.version;

console.log(tree.childs);

var systemMap = {
    '-2': 'Void',
    '-1': 'Hall',
    0: 'Beam',
    1: 'Torp',
    2: 'Sens',
    3: 'Mnvr',
    4: 'Impl',
    5: 'Warp',
    6: 'Fshd',
    7: 'Rshd',
}

function readSnt(filename) {

    var sntFile = fs.readFileSync(config.datDir + '/' + filename);

    var i = 0;
    var grid = {};

    for (var x=-2; x<=2; x++) {
        grid[x] = {};
        for (var y=-2; y<=2; y++) {
            grid[x][y] = {};
            for (var z=0; z<=9; z++) {

                var graphicX = sntFile.readFloatLE(i);
                var graphicY = sntFile.readFloatLE(i+4);
                var graphicZ = sntFile.readFloatLE(i+8);
                var sys      = sntFile.readInt32LE(i+12);

//                 var a   = sntFile.readInt32LE(i+16);
//                 var b   = sntFile.readInt32LE(i+20);
//                 var c   = sntFile.readInt32LE(i+24);
//                 var d   = sntFile.readInt32LE(i+28);

//                 console.log(x,y,z,a,b,c,d,graphicX,graphicY,graphicZ,sys);
                if (sys != -2) {
                    grid[x][y][z] = {
                        sys:sys,
                        graphicX: graphicX,
                        graphicY: graphicY,
                        graphicZ: graphicZ
                    };
                    console.log(x,y,z,/*a,b,c,d,*/graphicX,graphicY,graphicZ,systemMap[sys]);
                }

                i+=32;
            }
        }
    }
    return grid;
}

var factions = {};
var vessels  = {};

for (i in tree.childs) {
    var node = tree.childs[i];
    if (node.name == 'hullRace') {
        console.log('Faction ', node.attrib.ID, node.attrib.name);
        factions[node.attrib.ID] = {name: node.attrib.name, taunts:[]};
        for (j in node.childs) {
            factions[node.attrib.ID].taunts.push(node.childs[j].attrib);
        }
    }
    if (node.name == 'vessel') {
        console.log('Vessel ', node.attrib.uniqueID);

        var vessel = {
            faction: node.attrib.side,
            classname: node.attrib.classname,
            beams: [],
            tubes: [],
            torpedoStorage: {},
            engines: [],
            description: ''
        };

        for (j in node.childs) {
            var name   = node.childs[j].name;
            var attrib = node.childs[j].attrib;
            if (name=='internal_data') {
                vessel.sntFile = attrib.file.replace('dat/','');
                vessel.grid = readSnt(vessel.sntFile);
            }
            else if (name=='shields') {
                vessel.frontShields = attrib.front;
                vessel.rearShields  = attrib.back;
            }
            else if (name=='torpedo_tube') {
                vessel.tubes.push(attrib);
            }
            else if (name=='beam_port') {
                vessel.beams.push(attrib);
            }
            else if (name=='torpedo_storage') {
                vessel.torpedoStorage[attrib.type] = attrib.amount;
            }
            else if (name=='engine_port') {
                vessel.engines.push(attrib);
            }
            else if (name=='long_desc') {
                vessel.description = attrib.text;
            }
            else if (name=='performance') {
                vessel.performance = attrib;
            }
            else {
                console.log('Unknown element: ', name)
            }

        }

        vessels[node.attrib.uniqueID] = vessel;
    }
}

console.log(vessels);


// console.log(factions[0]);

// readSnt('artemis.snt');

exports = vessels;

