

// Functions to pretty-print several bits of information from the vessels.


// Given a distance, format it to have max 3 digits with a "K" at the end
function distanceToKs (dis) {
	
	if (dis < 100) {
		return dis.toFixed(1);
	}
	else if (dis < 1000) {
		return dis.toFixed(0);
	}
	else if (dis < 10000) {
		var k = parseFloat(dis) / 1000;
		return k.toFixed(2) + 'K';
	}
	else {/*if (dis < 10000) {*/
		var k = parseFloat(dis) / 1000;
		return k.toFixed(1) + 'K';
	}
	
}



// TODO: Refactor this and the OpenLayers style generator so we
//   define the colours only once.
function getColor(entity) {

	if (entity.hasOwnProperty('isEnemy')) {
		if (entity.isEnemy) {
			// Enemy
			return '#C04040';
		} else {
			// Neutral/Ally
			return '#40C0C0';
		}
	}
	
	
	// Player vessel
	if (entity.entityType==1) {
		return '#40C040';
	} 
	
	// Generic enemy (might not be hostile)
	if (entity.entityType==4) {
		return '#C04040';
	} 
	
	// Station
	if (entity.entityType==5) {
		return '#c0c040';
	} 
	
	// Mine
	if (entity.entityType==6) {
		return '#666666';
	} 
	
	
// 	If unknown, return grey
	return '#666666';
	
};
