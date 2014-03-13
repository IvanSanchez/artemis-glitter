
// Implements a persistent world model on top of the low-level network
//   interface.

var artemisNet = require('./artemisNet');


// Holds all known data for all known entities.
// The key of each one is the numeric ID of the entity.
var model = {};




artemisNet.on('gameOver', function(){
	model = {};
	/// TODO: Write all info to a file for forensics and/or post-mortem data mining.
});


artemisNet.on('npcUpdate',function(data){
	if (!data) {return;}
	console.log(data);
	
	if (!model.hasOwnProperty(data.id)) { model[data.id] = {};}
	
	for (var key in data) {
		model[data.id][key] = data[key];
	}
});














exports.model = model;

