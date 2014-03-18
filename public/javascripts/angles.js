


// Given two pairs of (flat) coordinates, return bearing and distance
// Origin of coordinates is top-right.
function posToBrgDst(x1, y1, x2, y2) {
	var dx = x2-x1;
	var dy = y2-y1;
	
	return [
		Math.atan2(dx,dy), 
		Math.sqrt(dx*dx+dy*dy)
		];
}



// Given an angle in Artemis' format, return the angle in degrees as a pretty-printed string..
// -Pi   becomes 0 (north)
// -Pi/2 becomes 90 (east)
//   0   becomes 180 (south)
//  Pi/2 becomes 270 (west)
//  Pi   becomes 360 (north)
function radianToDegrees(rad) {
	var degrees = 180 + ( 180*rad/Math.PI );
	return degrees.toFixed(1); 
}


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










