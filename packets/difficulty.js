
exports.name = 'difficulty';

exports.type = 0x3de66711;

exports.subtype = null;

exports.pack = null;	// Only from server to client

exports.unpack = function(data) {
  
	// Possible values for gameType are:
	//   0 - Siege
	//   1 - Single front
	//   2 - Double front
	//   3 - Deep Strike
	//   4 - Peacetime
	//   5 - Border War
	// Values are only meaningful for Solo and Coop games.
	
	return {
		difficulty: data.readLong(),
		gameType: data.readLong()
	};
}


