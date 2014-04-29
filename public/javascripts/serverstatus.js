
// Server status / connection functions for the welcome page.


document.getElementById('connect').addEventListener('click',function(){
	var serveraddr = document.getElementById('serveraddr').value;
	var oReq = new XMLHttpRequest();
	oReq.open("get", "./connect/" + serveraddr, true);
	oReq.send();
	
	document.getElementById('connect'   ).style.display = 'none';
	document.getElementById('connecting').style.display = 'inline';
	document.getElementById('disconnect').style.display = 'none';
	document.getElementById('serveraddr').disabled = true;
});

document.getElementById('disconnect').addEventListener('click',function(){
	var oReq = new XMLHttpRequest();
	oReq.open("get", "./disconnect/", true);
	oReq.send();

	document.getElementById('connect'   ).style.display = 'inline';
	document.getElementById('connecting').style.display = 'none';
	document.getElementById('disconnect').style.display = 'none';
	document.getElementById('serveraddr').disabled = false;
	document.getElementById('vessel-select').style.display = 'none';
});


iface.on('connected', function(){
	document.getElementById('connect'   ).style.display = 'none';
	document.getElementById('connecting').style.display = 'none';
	document.getElementById('disconnect').style.display = 'inline';
	document.getElementById('vessel-select').style.display = 'inline';
});

iface.on('disconnected', function(){
	document.getElementById('connect'   ).style.display = 'inline';
	document.getElementById('connecting').style.display = 'none';
	document.getElementById('disconnect').style.display = 'none';
	document.getElementById('serveraddr').disabled = false;
	document.getElementById('vessel-select').style.display = 'none';
});

// Check if Glitter is already connected to Artemis on webpage start-up
function receiveArtemisServerAddr() {
	if (this.responseText != "") {
		document.getElementById('serveraddr').value = this.responseText;
		document.getElementById('serveraddr').disabled = true;
		document.getElementById('connect'   ).style.display = 'none';
		document.getElementById('connecting').style.display = 'none';
		document.getElementById('disconnect').style.display = 'inline';
		document.getElementById('vessel-select').style.display = 'inline';
	} else {
		document.getElementById('connect'   ).style.display = 'inline';
		document.getElementById('connecting').style.display = 'none';
		document.getElementById('disconnect').style.display = 'none';
		document.getElementById('serveraddr').disabled = false;
		document.getElementById('vessel-select').style.display = 'none';
	}
}
var oReq = new XMLHttpRequest();
oReq.onload = receiveArtemisServerAddr;
oReq.open("get", "./artemis-server", true);
oReq.send();



// Fetch the server's public IPs so we can display a helper message at the top
function receivePublicIPs() {
	var publicIPs = JSON.parse(this.responseText);
	var ownAddress = document.getElementById('ownaddress')
	
	if (publicIPs.length == 0) {
		ownaddress.innerHTML = "Your computer doesn't seem to be connected to any network. You might want to look into that, then reload this webpage."
		return;
	}
	if (publicIPs.length == 1) {
		ownaddress.innerHTML = "In order to use more Glitter consoles, type the address <strong><big>http://" + publicIPs[0] + ":3000</big></strong> into a web browser."
		return;
	}
	
	var str = "Your computer seems to have several network cards. In order to use more Glitter consoles, type one of the following addresses into a web browser:<ul>";
	for (i in publicIPs) {
		str += "<li><strong><big>http://" + publicIPs[0] + ":3000</big></strong>";
	}
	ownaddress = str;
}

var oReq = new XMLHttpRequest();
oReq.onload = receivePublicIPs;
oReq.open("get", "./glitter-address", true);
oReq.send();



// Fetch the known player ships names (and models, etc) when received
// They will also be received on model update anyway.
// I hate how the Artemis protocol handles this list sometimes as
//   0-based, sometimes as 1-based.
function refreshShipSelector(data) {
	var str = '';
	for (var i in data) {
// 		console.log('Ship index ', i, ' is named ', data[i].name);
		if (i == model.playerShipIndex){
			str += '<option selected value=' + i + '>' + data[i].name;
		} else {
			str += '<option value=' + i + '>' + data[i].name;
		}
	}
	document.getElementById('playershipname').innerHTML = str;
};

iface.on('allShipSettings', refreshShipSelector);
iface.on('consoleStatus', function(){refreshShipSelector(model.allShipSettings)});



document.getElementById('playershipname').addEventListener('change',function(e){
	var shipIndex = document.getElementById('playershipname').value;
	shipIndex = parseInt(shipIndex);
	var oReq = new XMLHttpRequest();
	oReq.open("get", "./ship-select/" + shipIndex, true);
	oReq.send();
});


