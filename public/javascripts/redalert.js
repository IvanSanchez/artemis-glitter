// Changes some CSS clases to turn things red whenever the player vessel switches the "red alert" status.


iface.on('playerUpdate',function(data) {
	
	if (data.id == model.playerShipID
	    && data.hasOwnProperty('redAlert')) {
		
		if (data.redAlert) {
			document.body.className = 'red-alert';
		} else {
			document.body.className = '';
		}
	}
	
});

