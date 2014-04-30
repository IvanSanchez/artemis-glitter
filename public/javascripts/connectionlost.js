
// Common functionality for all consoles: provide link back whenever connection to the Artemis server goes down.

var serverIpAddr = null;

function checkConnected() {

	if (model.connected && model.allShipSettings) {
		window.setTimeout(function(){
			document.getElementById('connected').style.display='none';
		},10000);

		document.getElementById('connected').innerHTML =
		 '<p>Glitter is connected to an Artemis server at IP: ' + serverIpAddr + ', server version ' + model.serverVersion + '</p>' +
		 '<p>You\'re flying on the starhip <span class="green shipname">' + model.allShipSettings[model.playerShipIndex].name + '</span></p>';

		document.getElementById('connected').style.display='block';
	} else {
		document.getElementById('connected').innerHTML = 
		'<p>Glitter is not connected to an Artemis server.</p>' +
		'<p>You can <a href="/">go back to the ship selection screen</a></p>';

		document.getElementById('connected').style.display='block';
	}
}

function hideConnectedOverlay(){
	document.getElementById('connected').style.display='none';
}

function onGlitterDisconnect(){
	document.getElementById('connected').innerHTML =
	 '<p class="alert">Connection to Glitter aborted.</p>' +
	 '<p>Please check the network connectivity and the Glitter server, then reload this page.</p>';
	document.getElementById('connected').style.display='block';
}

function onGameOverReason(data) {
	document.getElementById('connected').style.display='block';
	document.getElementById('connected').innerHTML =
	'<h3 id="gameOverTitle"></h3>' +
	'<div id="gameOverReason"></div>' +
	'<table id="gameOverStats"></table>';
	
	document.getElementById('gameOverTitle').innerHTML = data.title;
	document.getElementById('gameOverReason').innerHTML = data.reason;
}

function showStatistics(data) {

// 	var str = '<table>';
	var str = '';
	for (i in data.stats) {
		str += '<tr><th>' + data.stats[i].label + 
	                   '<td>' + data.stats[i].count;
	}
// 	str += '</table>';
	
	document.getElementById('gameOverStats').innerHTML += str;
}

iface.on('connected',       checkConnected);
iface.on('disconnected',    checkConnected);
iface.on('allShipSettings', checkConnected);
iface.on('consoleStatus',   checkConnected);
iface.on('version',         checkConnected);
iface.on('skybox',          checkConnected);
iface.on('skybox',          hideConnectedOverlay);
iface.on('gameStart',       checkConnected);
iface.on('gameStart',       hideConnectedOverlay);
iface.on('gameOverReason',  onGameOverReason);
iface.on('gameOverStats',   showStatistics);
iface.on('gameOver',        checkConnected);

model.on('glitterDisconnect',onGlitterDisconnect);

// Check if Glitter is already connected to Artemis on webpage start-up
function receiveArtemisServerAddr() {
	if (this.responseText != "") {
		model.connected = true;
		serverIpAddr = this.responseText;
	} else {
		model.connected = false;
	}
	checkConnected();
}
var oReq = new XMLHttpRequest();
oReq.onload = receiveArtemisServerAddr;
oReq.open("get", "./artemis-server", true);
oReq.send();


// Enable the overlay used on every other console to show the connection status
document.getElementById('connected').style.display='block';
