

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







