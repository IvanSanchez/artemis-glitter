

// TODO: Refactor this and the OpenLayers style generator so we
//   define the colours only once.
function getStyle(type,name) {

	var strokeColor = '#ffffff';
	var fillColor   = '#c0c0c0';
	if (type==1) {
		strokeColor = '#00ff00';
		fillColor   = '#40c040';
	} else if (type==4) {
		strokeColor = '#ff0000';
		fillColor   = '#c04040';
	} else if (type==5) {
		strokeColor = '#ffff00';
		fillColor   = '#c0c040';
	} else if (type==6) {
		strokeColor = '#ffffff';
		fillColor   = '#666666';
	}

};


var playerShipID = null;


/// FIXME!!!
/// This needs to be re-done. The Deep Space stations don't send any updates,
///   yet the distance and bearing from the Artemis changes as the Artemis
///   moves. Even more troublesome, some enemy ships don't send any updates
///   when moving on a straight line....

model.on('newOrUpdateEntity', function(data){
	
	if (!playerShipID && data.entityType == 1) {
		/// TODO: Check that the friendly ship is actually
		///   our own, and not any of the other 7.
		playerShipID = data.id;
	} else if (data.entityType == 4 || data.entityType == 5) {
		if (!playerShipID) {return;}
		var row = document.getElementById( data.id );
		if (!row) {
			/// FIXME: Add row only if room left
			/// If not, check for current maximum distance
			/// and replace row with max distance with new
			/// row. Goal is to have an always-unordered
			/// table with only the nearest ships.
			// Add row
			var table = document.getElementById('bearing-table');
			row = table.tBodies[0].insertRow();
			row.id = data.id;
		}
		
		var brgDst = posToBrgDst(
			model.entities[playerShipID].posX, 
			model.entities[playerShipID].posZ, 
			data.posX, 
			data.posZ);
		
// 		console.log(
// 			data.shipName,
// 			model.entities[playerShipID].posX, 
// 			model.entities[playerShipID].posZ, 
// 			data.posX, 
// 			data.posZ);
		
		var str;
		if (data.shipName)
			str = '<td>' + data.shipName;
		else
			str = '<td>';
		str += '<td>' + radianToDegrees(brgDst[0]);
		str += '<td>' + distanceToKs(brgDst[1]);
		str += '<td>' + radianToDegrees(data.heading);
// 		str += '<td>' + parseInt(data.forShields) + '/' + parseInt(data.aftShields);
		
		row.innerHTML = str;
	}
	
	/// TODO: Order rows!
	/// TODO: Use the fancy experimental "sortable" thingie from Mozilla.
});


model.on('destroyEntity', function(data){
	var row = document.getElementById(data.id);
	if (row) {
		var table = document.getElementById('bearing-table');
		row = table.deleteRow(row.rowIndex);
	}
	if (data.id == playerShipID) {
		playerShipID = null;
	}
});



