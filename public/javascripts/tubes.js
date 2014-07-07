

// Stores the ordance type to load when the tube has finished unloading.
var pendingAutoLoad = {};


function initTubes(shipType) {
	
// 	console.log('Init ship: ', shipType);
// 	console.log('VesselData for this model is: ', model.vesselData[shipType]);
	
	var ownShipData = model.vesselData[shipType];
	var availableTubes = 6;
	var maxStores = {0:'x',1:'x',2:'x',3:'x'};
	
	if (ownShipData) {
		maxStores = ownShipData.torpedoStorage;
		availableTubes = ownShipData.tubes.length;
	}
	
	// Show as many tubes as the ship has, hide the rest.
	for (var i=1; i<=6; i++) {
		var tubeRow = document.querySelector('#tube'+i);
		console.log(tubeRow);
		if (availableTubes >= i) {
			tubeRow.style.display='';
		} else {
			tubeRow.style.display='none';
		}
	}

	// Set maximum ordnance stores
	for (var i=0; i<=3; i++) {
		var tubeRow = document.querySelector('#maxStores'+i);
		tubeRow.innerHTML = maxStores[i];
	}
}


function updateTubes(data) {
	
// 	console.log(data);
	if (data.hasOwnProperty('storesHoming')) {
		document.querySelector('#currentStores0').innerHTML = data.storesHoming;
	}
	if (data.hasOwnProperty('storesNukes')) {
		document.querySelector('#currentStores1').innerHTML = data.storesNukes;
	}
	if (data.hasOwnProperty('storesMines')) {
		document.querySelector('#currentStores2').innerHTML = data.storesMines;
	}
	if (data.hasOwnProperty('storesEMPs')) {
		document.querySelector('#currentStores3').innerHTML = data.storesEMPs;
	}
	
	model.weapons.stores0 = model.weapons.storesHoming;
	model.weapons.stores1 = model.weapons.storesNukes;
	model.weapons.stores2 = model.weapons.storesMines;
	model.weapons.stores3 = model.weapons.storesEMPs;
	
	for (var i=1; i<=6; i++) {
// 		if (data.hasOwnProperty('tubeUsed'+i)) {
		// The status of a tube must be refreshed
		var used     = model.weapons['tubeUsed' + i];
		var ordnance = model.weapons['tubeContents'+i];
		
// 			console.log('Update tube '+i+' status '+used+' for ordnance'+ordnance);
		
		// The table cell containing the appropiate button for this tube-ordnance combination
		var cell = document.querySelector('#load'+i+ordnance);
		
		// All cells in the row, including the important one
		var rowCells = document.querySelectorAll('#tube'+i+' td');
		
		var importantStatus = '';
		var otherStatus     = '';
		var importantEmptyStatus = '<div class="empty">EMPTY</div>';
		var otherEmptyStatus     = '<div class="empty">EMPTY</div>';
		if (used == 0) {
			importantStatus='<div class="load">LOAD</div>';
			otherStatus    ='<div class="load">LOAD</div>';
			
			/// FIXME: Trigger loading of queued ordnance, if needed.
			
			if (pendingAutoLoad[i] !== undefined) {
				var oReq = new XMLHttpRequest();
				oReq.open("get", "./load-tube/"+i+"/"+pendingAutoLoad[i], true);
				oReq.send();
				pendingAutoLoad[i] = undefined;
			}
		}
		if (used == 1) {
			importantStatus='<div class="fire">FIRE</div>';
			otherStatus    ='<div class="switch">LOAD</div>';	
			importantEmptyStatus = '<div class="fire">FIRE</div>';
		}
		if (used == 2) {
			importantStatus='<div class="loading">WAIT</div>';
			otherStatus    ='<div class="wait">WAIT</div>';
			importantEmptyStatus = '<div class="loading">WAIT</div>';
		}
		if (used == 3) {
			importantStatus='<div class="unloading">WAIT</div>';
			otherStatus    ='<div class="wait">WAIT</div>';
			importantEmptyStatus = '<div class="unloading">WAIT</div>';
		}
		
		for (var j=0; j<=3; j++) {
			var cell = document.querySelector('#load'+i+j);

			if (ordnance == j) {
				if (model.weapons['stores'+j] == 0) {
					cell.innerHTML=importantEmptyStatus;
				} else {
					cell.innerHTML=importantStatus;
				}
			} else {
				if (model.weapons['stores'+j] == 0) {
					cell.innerHTML=otherEmptyStatus;
				} else {
					cell.innerHTML=otherStatus;
				}
			}
		}
// 		}
		
		if (data.hasOwnProperty('unloadTime'+i)) {
			// The background gradient of a tube must be refreshed
			var ordnance = model.weapons['tubeContents'+i];
			var used     = model.weapons['tubeUsed'+i];
			var cell     = document.querySelector('#load'+i+ordnance+' div');
			var style    = '';
			var percent  = 100*data['unloadTime'+i]/15;	// Percent LEFT to load/unload
			var percent1 = (percent - 2)+'%';
			var percent2 = (percent + 2)+'%';			
			
			if (used == 2) {
				// Loading
				style = 'linear-gradient(to left,#666 ' + percent1 + ',#363 ' + percent2 + ')';
			} else if (used == 3) {
				// Unloading
				style = 'linear-gradient(to right,#666 ' + percent1 + ',#336 ' + percent2 + ')';
			}
			
			if (cell) {
				cell.style.backgroundImage = style;
			}
		}
	}
}




function tubeAction(tube,ordnance) {
	/// Check the status of the clicked tube-ordnance pair. Load/unload/fire as needed.
	
	console.log('Clicked on tube ',tube, ' ordnance ',ordnance);
// 	console.log(model.weapons);
	
	var used     = model.weapons['tubeUsed'+tube];
	var contents = model.weapons['tubeContents'+tube];
	console.log('Tube status: ',tube, ' Currently loaded: ',contents);
	
	var oReq = new XMLHttpRequest();
	
	if (used == 1 && ordnance == contents) {
// 		console.log('todo: FIRE TUBE ',tube,'!');
		oReq.open("get", "./fire-tube/"+tube, true);
		oReq.send();
	} else if (used == 1) {
		/// FIXME!!
		console.log('todo: Unload tube ',tube, ' then load ', ordnance);
		oReq.open("get", "./unload-tube/"+tube, true);
		oReq.send();
		pendingAutoLoad[tube] = ordnance;
	} else if (used == 0) {
		console.log('todo: Tube ',tube, ' is empty, inmediatly load ', ordnance);
		var oReq = new XMLHttpRequest();
		oReq.open("get", "./load-tube/"+tube+"/"+ordnance, true);
		oReq.send();
	}
	// Statuses 2 and 3 (loading/unloading) are ignored
}


for (var i=1; i<=6; i++) {
	for (var j=0; j<=3; j++) {
		document.querySelector('#load'+i+j)
			.addEventListener('click',function(i,j){
				return function() {tubeAction(i,j);}
			}(i,j));
	}
}



// model.on('ownShipInit', function(){
// 	window.setTimeout(initTubes,1000);
// });
model.on('ownShipInit', initTubes,1000);

iface.on('weaponsUpdate', updateTubes);

model.on('loaded', function(){
	updateTubes(model.weapons);
})
