




// Row to be updated. Row -1 means recalculate the max number of rows, and add 
//   a new one if appropiate.
var rowID = -1;


// An array of entity IDs, one per row.
var entities = [];


function getNearestUnknownVessel() {
	var minDistance = Number.POSITIVE_INFINITY;
	var candidate = null;
	for (var i in model.entities) {
		
		// Skip own vessel and vessels already in the list, and do not take into account black holes, anomalies or mines
		var type = model.entities[i].entityType;
		if (i != model.playerShipID &&
		    entities.indexOf(i) === -1 &&
		    (type==1 || type==4 || type==5 || type==14 ) ) {
			var brgDst = posToBrgDst(
				model.entities[model.playerShipID].posX, 
				model.entities[model.playerShipID].posZ, 
				model.entities[i].posX, 
				model.entities[i].posZ
				);
			
			// The distance might be NaN for entities without coordinates, e.g. beams
			var distance = brgDst[1];
			if (!isNaN(distance) && distance < minDistance) {
				candidate = i;
				minDistance = distance
			}
		}
	}
	return {id:candidate,distance:minDistance};
}

function getFurthestKnownVessel() {
	var maxDistance = Number.NEGATIVE_INFINITY;
	var candidate = null;
	for (var i in model.entities) {
		
		// Skip own vessel and vessels already in the list
		if (i != model.playerShipID &&
		    entities.indexOf(i) !== -1) {
			var brgDst = posToBrgDst(
				model.entities[model.playerShipID].posX, 
				model.entities[model.playerShipID].posZ, 
				model.entities[i].posX, 
				model.entities[i].posZ
				);
				
			var distance = brgDst[1];
			if (distance > maxDistance) {
				candidate = i;
				maxDistance = distance
			}
		}
	}
	return {id:candidate,distance:maxDistance};
}

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
		var rowHeight = 0;
		if (tbody.rows.length)
			rowHeight = tbody.rows[0].offsetHeight;
			
		if (table.offsetHeight + rowHeight < window.innerHeight) {
// 			console.log('There\'s room for another row');
			// Find the entity closer to the vessel
			
			var nearest = getNearestUnknownVessel();
			
			if (nearest.id !== null) {
// 				console.log('Should add entity ', candidate, ' to the list');
				entities.push(nearest.id);
				addRow();
// 				rowID = tbody.rows.length;
			} else {
				// No more vessels to be added into the table
// 				console.log('No candidates to be added');
				rowID = tbody.rows.length;
			}
		} else if (table.offsetHeight > window.innerHeight){
			// Extra rows, delete one.
			// This may happen on tablets while rotating the screen.
			var last = tbody.rows.length;
			tbody.deleteRow(last-1);
			entities.splice(last-1,1);
		
		} else {
			// No more room in the table
			
			// Check if there's a vessel closer than the furthest of vessels in the table
			var nearest  = getNearestUnknownVessel();
			var furthest = getFurthestKnownVessel();
			
			if (nearest.distance < furthest.distance) {
				var rowToReplace = entities.indexOf(furthest.id);
// 				console.log('Replacing row ', rowToReplace, 
// 					' from ', furthest.id, ' ', model.entities[furthest.id].shipName, ' (', furthest.distance , 
// 					') to ', nearest.id, ' ', model.entities[nearest.id].shipName, ' (', nearest.distance , ') ');
				
				entities[rowToReplace] = nearest.id;
			}
			
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


window.setInterval(updateTable,100);

