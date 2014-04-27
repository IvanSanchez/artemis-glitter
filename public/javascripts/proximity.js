

// Mutex-like flag, for slow browsers.
var checkingProximity = false;


function checkProximity() {

	if (checkingProximity) {
		return;
	}
	
	checkingProximity = true;
	
	var minDistances = {
		4: Number.POSITIVE_INFINITY,	// Hostile vessel
		5: Number.POSITIVE_INFINITY,	// Space Station
		6: Number.POSITIVE_INFINITY,	// Mine
		9: Number.POSITIVE_INFINITY,	// Nebula
		10: Number.POSITIVE_INFINITY,	// Torpedo
		11: Number.POSITIVE_INFINITY,	// Black Hole
		12: Number.POSITIVE_INFINITY	// Asteroid
	};
	
	for (var i in model.entities) {
		
		// Skip own vessel and vessels already in the list, and do not take into account black holes, anomalies or mines
		var type = model.entities[i].entityType;
		
		if (minDistances.hasOwnProperty(type)) {
		
			var brgDst = posToBrgDst(
				model.entities[model.playerShipID].posX, 
				model.entities[model.playerShipID].posZ, 
				model.entities[i].posX, 
				model.entities[i].posZ
				);
			
			// The distance might be NaN for entities without coordinates
			var distance = brgDst[1];

			// Skip allied vessels
			/// TODO: Should skip surrendered vessels.
			if (model.entities[i].hasOwnProperty('isEnemy') &&
			    !model.entities[i].isEnemy) {
			    distance = Number.POSITIVE_INFINITY;
			}
			
			if (!isNaN(distance) && distance < minDistances[type]) {
				minDistances[type] = distance;
			}
		}
	}
	
// 	console.log(minDistances);
	
	var hazardDistance = Math.min(minDistances[11],minDistances[12]);
	hazardDistance = distanceToKs(hazardDistance);

	minDistances[4]  = distanceToKs(minDistances[4]);  // Hostile
	minDistances[5]  = distanceToKs(minDistances[5]);  // Space Station
	minDistances[6]  = distanceToKs(minDistances[6]);  // Mine
	minDistances[10] = distanceToKs(minDistances[10]); // Torpedo

	// I *think* nebulae are 3KM wide, and the prox monitor will show "IN"
	//   when inside a nebula. Distances are to the edge of nebulae.
	if (minDistances[9] > 3000) {
		minDistances[9] = distanceToKs(minDistances[9]-3000);  // Nebula
	} else {
		minDistances[9] = 'IN';
	}
	
	
	document.getElementById('proximity-hos').innerHTML  = minDistances[4];
	document.getElementById('proximity-ds').innerHTML   = minDistances[5];
	document.getElementById('proximity-mine').innerHTML = minDistances[6];
	document.getElementById('proximity-torp').innerHTML = minDistances[10];
	document.getElementById('proximity-neb').innerHTML  = minDistances[9];
	
	document.getElementById('proximity-hzd').innerHTML = hazardDistance;
	
	
	/// TODO: Set the colours based on some thresholds.
	/// TODO: Set monsters as hostile??
	
	checkingProximity = false;
}


window.setInterval(checkProximity,100);

