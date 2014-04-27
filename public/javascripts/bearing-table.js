




// Row to be updated. Row -1 means recalculate the max number of rows, and add 
//   a new one if appropiate.
var rowID = -1;


// An array of entity IDs, one per row.
var entities = [];


var table = document.getElementById('bearing-table');
var tbody = table.tBodies[0];

function updateTable(){
	
// 	console.log(rowID);
	
	if (rowID <0) {
		/// TODO: Check rows, add/delete.
		for (var i in entities) {
		
			if (!model.entities.hasOwnProperty(entities[i])) {
				// This entity has been destroyed from the world model, so delete its row
// 				console.log('Deleting row because entity ', entities[i], ' has disappeared');
				tbody.deleteRow(i);
				entities.splice(i,1);
				return;
			}
		}
		
// 		console.log(table.offsetHeight, window.innerHeight, table.rows.offsetHeight);
		
		if (table.offsetHeight + table.rows[0].offsetHeight <= window.innerHeight) {
// 			console.log('There\'s room for another row');
			// Find the entity closer to the vessel
			
			var minDistance = Number.POSITIVE_INFINITY;
			var candidate = null;
			for (var i in model.entities) {
				
				// Skip own vessel and vessels already in the list
				if (i != model.playerShipID &&
				    entities.indexOf(i) === -1) {
					var brgDst = posToBrgDst(
						model.entities[model.playerShipID].posX, 
						model.entities[model.playerShipID].posZ, 
						model.entities[i].posX, 
						model.entities[i].posZ
						);
// 					console.log('Distance to entity ', i, ' is ', brgDst[1]);
					var distance = brgDst[1];
					if (distance < minDistance) {
						candidate = i;
						minDistance = distance
					}
				}
			}
			
			if (candidate !== null) {
// 				console.log('Should add entity ', candidate, ' to the list');
				entities.push(candidate);
				addRow();
// 				rowID = tbody.rows.length;
			} else {
				// No more vessels to be added into the table
				rowID = tbody.rows.length;
			}
			
		} else {
			// No more room in the table
			rowID = tbody.rows.length;
		}
		
	} else {
		updateRow(rowID);
		rowID--;
	}
	
	
}


function addRow() {
	var newRowID = tbody.rows.length;
	row = tbody.insertRow(newRowID);
	row.id = newRowID;
	
	updateRow(newRowID);
}

function updateRow(rowID) {

	if (!model.playerShipID) {
		return;
	}
	var entityID = entities[rowID];
	
	if (!model.entities.hasOwnProperty(entityID)) {
		return;
	}
	
// 	console.log('Updating row ', rowID, ' with entity ', entityID, model.entities[entityID]);

	var brgDst = posToBrgDst(
		model.entities[model.playerShipID].posX, 
		model.entities[model.playerShipID].posZ, 
		model.entities[entityID].posX, 
		model.entities[entityID].posZ
		);

	var str;
	if (model.entities[entityID].shipName) {
		var color = getColor(model.entities[entityID]);
		str = '<td style="color:' + color + ';">' + model.entities[entityID].shipName;
	} else {
		str = '<td>';
	}
	str += '<td>' + radianToDegrees(brgDst[0]);
	str += '<td>' + distanceToKs(brgDst[1]);
	str += '<td>' + radianToDegrees(model.entities[entityID].heading);
	// 		str += '<td>' + parseInt(data.forShields) + '/' + parseInt(data.aftShields);

	tbody.rows[rowID].innerHTML = str;
}


window.setInterval(updateTable,250);

