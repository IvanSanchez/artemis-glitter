

// Mutex-like flag, for slow browsers.
var checkingProximity = false;

var insideNebula = false;
var lastStatus = 'initial';

var alarmEnabled = {
	shl: true,
	neb: true,
	hzd: true,
	hos: true,
	mine: true,
	drone: true
};


function checkProximity() {

	if (checkingProximity) {
		return;
	}
	
	checkingProximity = true;
	
	var minDistances = {
		4: Number.POSITIVE_INFINITY,	// Hostile vessel
// 		5: Number.POSITIVE_INFINITY,	// Space Station
		6: Number.POSITIVE_INFINITY,	// Mine
		9: Number.POSITIVE_INFINITY,	// Nebula
		11: Number.POSITIVE_INFINITY,	// Black Hole
		12: Number.POSITIVE_INFINITY,	// Asteroid
		16: Number.POSITIVE_INFINITY	// Drone (enemy ordnance)
	};
	
	for (var i in model.entities) {
		
		// Skip own vessel and vessels already in the list, and do not take into account black holes, anomalies or mines
		var type = model.entities[i].entityType;
		
		// Just in case we're doing this too soon
		if (!model.entities.hasOwnProperty(model.playerShipID)) {
			return;
		}
		
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
	
	// All status conditions are checked sequentially, and
	//   the last to be checked will overwrite the previous
	// Yes, yes, I should be using a chain of elseifs...
	
		
	var hazardDistance = Math.min(minDistances[11],minDistances[12]);

	// I *think* nebulae are 3KM wide, and the prox monitor will show "IN"
	//   when inside a nebula. Distances are to the edge of nebulae.
	if (minDistances[9] > 3000) {
		minDistances[9] = distanceToKs(minDistances[9]-3000);  // Nebula
	} else {
		minDistances[9] = 'IN';
	}
	
	var status = null;
	if (minDistances[9] == 'IN' && alarmEnabled.neb) {
		status = 'nebula';
		if (!insideNebula) {
		}
	} else {
		if (insideNebula) {
			/// TODO: Trigger "Exiting Nebula" sound
		}
	}
	
	if (hazardDistance < 1500 && alarmEnabled.hzd) {
		status = 'hazard';
	}
	
	if (minDistances[4] < 2000 && alarmEnabled.hos) {
		status = 'enemy';
	}
	
	if (model.entities.hasOwnProperty(model.playerShipID) && model.entities[model.playerShipID].redAlert) {
		status = 'redalert';
	}
	
	if (minDistances[6] < 1200 && alarmEnabled.mine) {
		status = 'mine';
	}
	
	if (minDistances[16] < 2000 && alarmEnabled.drone) {
		status = 'drone';
	}
	
	hazardDistance = distanceToKs(hazardDistance);
	minDistances[4]  = distanceToKs(minDistances[4]);  // Hostile
	minDistances[5]  = distanceToKs(minDistances[5]);  // Space Station
	minDistances[6]  = distanceToKs(minDistances[6]);  // Mine
	minDistances[16] = distanceToKs(minDistances[16]); // Drone (enemy ordnance)
	
	document.getElementById('proximity-hos').innerHTML  = minDistances[4];
	document.getElementById('proximity-mine').innerHTML = minDistances[6];
	document.getElementById('proximity-drone').innerHTML = minDistances[16];
	document.getElementById('proximity-neb').innerHTML  = minDistances[9];
	document.getElementById('proximity-hzd').innerHTML = hazardDistance;
	
	if (lastStatus !== status) {
	
		if(lastStatus && lastStatus!='initial') {
			var player = document.getElementById('audio-'+lastStatus);
			if (player) {		
				player.pause();
				player.currentTime = 0;
			}
		}
		if(status) {
			var player = document.getElementById('audio-'+status);
			if (player) {
				player.play();
			}
		}
	
		var statusDiv = document.getElementById('status');
		if (status == 'hazard') {
			statusDiv.innerHTML = '<span  class="red">NAVIGATIONAL<br>HAZARD</span>';
		} else if (status == 'enemy') {
			statusDiv.innerHTML = '<span class="red">NEARBY<br>HOSTILE</span>';
		} else if (status == 'mine') {
			statusDiv.innerHTML = '<span class="alert">MINEFIELD<br>NEARBY</span>';
		} else if (status == 'redalert') {
			statusDiv.innerHTML = '<span class="alert">RED<br>ALERT</span>';
		} else if (status == 'drone') {
			statusDiv.innerHTML = '<span class="alert">INCOMING<br>ORDNANCE</span>';
		} else if (status == 'nebula') {
			statusDiv.innerHTML = '<span class="purple">Inside<br>Nebula</span>';
		} else {
			var ownVesselName = 'Offline';
			try {
				ownVesselName = model.allShipSettings[model.playerShipIndex].name;
			} catch(e) {
				status = 'initial'; // Will force recalculating the vessel name.
			};
			statusDiv.innerHTML = '<span class="green">' + ownVesselName + '</span>';
		} 
		lastStatus = status;
	}
	/// TODO: Set the colours based on some thresholds.
	/// TODO: Set monsters as hostile??
	
	checkingProximity = false;
}


var statusInterval = window.setInterval(checkProximity,100);

// React on hit if shields are down.
// The playerShipDamage packet is only sent to consoles of the vessel
//   being hit.
iface.on('playerShipDamage', function() {
	if (! (model.entities[model.playerShipID].shieldState) &&
	    alarmEnabled.shl) {
		var player = document.getElementById('audio-'+lastStatus);
		if (player) {
			player.pause();
			player.currentTime = 0;
		}
		
		var statusDiv = document.getElementById('status');
		statusDiv.innerHTML = '<span class="alert">RAISE<br>SHIELDS</span>';
		document.getElementById('audio-shields').play();
		
		// Do not play any other sounds until the "Shields up! Shields up!" has finished playing.
		checkingProximity = true;
		lastStatus = 'shields'
		window.setTimeout(function(){
			checkingProximity = false;
		},2500);
	}
});


// Display shield status when it changes.
iface.on('ownShipUpdate',function(data) {
	
	if (data.hasOwnProperty('shieldState')) {
		
		if (data.shieldState) {
			document.getElementById('proximity-shl').innerHTML   = 'UP';
		} else {
			document.getElementById('proximity-shl').innerHTML   = 'DWN';
		}
	}
});


// Pause a potentially looped sound on game end
iface.on('gameOverReason',function(){
	var player = document.getElementById('audio-'+lastStatus);
	if (player) {
		player.pause();
		player.currentTime = 0;
	}
});



// Set up the "click togglers" event functions
for (i in alarmEnabled) {
	var toggler = document.getElementById('proximity-'+i+'-toggle');
	
	var closure = function(j,t){
		return function(){
			alarmEnabled[j] = !alarmEnabled[j];
			if (alarmEnabled[j]) {
				t.className = 'toggler on';
			} else {
				t.className = 'toggler off';
			}
		}
	}(i,toggler);
	
	toggler.addEventListener('click',closure);
	
}

