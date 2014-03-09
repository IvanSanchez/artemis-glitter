
// Updates damage to the various system grids on the ship and DAMCON team locations and status.

exports.name = 'engGridUpdate';

exports.type = 0xf754c8fe;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
	
	/// FIXME!!!
	
	console.warn('engGridUpdate packet format not finished!!!');
	
	console.log(data);
	
// 	for (var playerShip = 1; playerShip <= 8; playerShip++) {
// 		
// 		var driveType = data.readUInt32LE(0);
// 		var shipType  = data.readUInt32LE(4);
// 		var unknown   = data.readUInt32LE(8);
// 		var strLen    = data.readUInt32LE(12) * 2;
// 		var name      = data.toString('utf16le', 16, 16+strLen-2);
// 		data = data.slice(16 + strLen);
// 		
// 		unpacked[playerShip] = {
// 			shipType: shipType,
// 			driveType: driveType,
// 			unknown: unknown,
// 			name: name
// 		}
// 	}
// 	
	return {};
	

}


