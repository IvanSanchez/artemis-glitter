

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


model.on('newOrUpdateEntity', function(data){
	
	if (!playerShipID && data.entityType == 1) {
		/// TODO: Check that the friendly ship is actually
		///   our own, and not any of the other 7.
		playerShipID = data.id;
	} else if (data.entityType == 4) {
		if (!playerShipID) {return;}
		var row = document.getElementById( data.id );
		if (!row) {
			// Add row
			var table = document.getElementById('bearing-table');
			row = table.insertRow();
			row.id = data.id;
		}
		
		var brgDst = posToBrgDst(
			model.entities[playerShipID].posX, 
			model.entities[playerShipID].posZ, 
			data.posX, 
			data.posZ);
		
		console.log(
			data.shipName,
			model.entities[playerShipID].posX, 
			model.entities[playerShipID].posZ, 
			data.posX, 
			data.posZ);
		
		var str;
		str  = '<td>' + data.shipName;
		str += '<td>' + Math.round(radianToDegrees(brgDst[0])*10)/10;
		str += '<td>' + Math.round(brgDst[1]);
		
		row.innerHTML = str;
	}
	
	/// TODO: Order rows!
	/// TODO: Use the fancy experimental "sortable" thingie from Mozilla.
});


model.on('destroyEntity', function(data){
	/// FIXME!!!
	console.log('Destroyed entity in world model: ', data);
});


