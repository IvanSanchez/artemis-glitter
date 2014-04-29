

// Mutex-like flag, for slow browsers.
var checkingProximity = false;

var insideNebula = false;
var lastStatus = 'initial';

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
		11: Number.POSITIVE_INFINITY,	// Black Hole
		12: Number.POSITIVE_INFINITY,	// Asteroid
		16: Number.POSITIVE_INFINITY	// Drone (enemy ordnance)
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
	minDistances[16] = distanceToKs(minDistances[16]); // Drone (enemy ordnance)

	// I *think* nebulae are 3KM wide, and the prox monitor will show "IN"
	//   when inside a nebula. Distances are to the edge of nebulae.
	if (minDistances[9] > 3000) {
		minDistances[9] = distanceToKs(minDistances[9]-3000);  // Nebula
	} else {
		minDistances[9] = 'IN';
	}
	
	var status = null;
	if (minDistances[9] == 'IN') {
		status = 'nebula';
		if (!insideNebula) {
			/// TODO: Trigger "Entering Nebula" sound
		}
	} else {
		if (insideNebula) {
			/// TODO: Trigger "Exiting Nebula" sound
		}
	}
	
	if (hazardDistance < 2000) {
		status = 'hazard';
		/// TODO: Trigger "navigational hazard" sound
	}
	
	if (minDistances[4] < 2000) {
		status = 'enemy';
		/// TODO: Trigger "nearby hostile" sound
	}
	
	if (minDistances[6] < 2000) {
		status = 'mine';
		/// TODO: Trigger "proximity warning" sound
	}
	
	if (minDistances[16] < 2000) {
		status = 'drone';
		/// TODO: Trigger "incoming ordnance" sound
	}
	
	document.getElementById('proximity-hos').innerHTML  = minDistances[4];
	document.getElementById('proximity-ds').innerHTML   = minDistances[5];
	document.getElementById('proximity-mine').innerHTML = minDistances[6];
	document.getElementById('proximity-drone').innerHTML = minDistances[16];
	document.getElementById('proximity-neb').innerHTML  = minDistances[9];
	document.getElementById('proximity-hzd').innerHTML = hazardDistance;
	
	if (lastStatus !== status) {
		var statusDiv = document.getElementById('status');
		if (status == 'hazard') {
			statusDiv.innerHTML = '<span  class="red">NAVIGATIONAL<br>HAZARD</span>';
		} else if (status == 'enemy') {
			statusDiv.innerHTML = '<span class="red">NEARBY<br>HOSTILE</span>';
		} else if (status == 'mine') {
			statusDiv.innerHTML = '<span class="alert">PROXIMITY<br>WARNING</span>';
		} else if (status == 'drone') {
			statusDiv.innerHTML = '<span class="alert">INCOMING<br>ORDNANCE</span>';
		} else if (status == 'nebula') {
			statusDiv.innerHTML = '<span class="purple">Inside<br>Nebula</span>';
		} else {
			var ownVesselName = 'Offline';
			try {
				ownVesselName = model.allShipSettings[model.playerShipIndex].name;
			} catch(e) {};
			statusDiv.innerHTML = '<span class="green">' + ownVesselName + '</span>';
		} 
		lastStatus = status;
	}
	/// TODO: Set the colours based on some thresholds.
	/// TODO: Set monsters as hostile??
	
	checkingProximity = false;
}


window.setInterval(checkProximity,100);

