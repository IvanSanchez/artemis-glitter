
var type = require('./data-types');




var packetDefsByName = {
	
	// Received when connecting to a game server
	version: {
		type: 0xe548e74a,
		subtypeLength: 0,
		subtype: 0,
		fields: new type.struct({
			unknown01: type.int32,
			unknown02: type.int32,
			major:   type.int32,
			minor:   type.int32,
			patch:   type.int32
		})
	},
	
	// Received when connecting to a game server
	welcome: {
		type: 0x6d04b3da,
		subtypeLength: 0,
		subtype: 0,
		fields: new type.struct({
			str: type.asciiString
		})
	},
	
	
	
	// Received when Science finishes a second scan, then at regular intervals
	intel: {
		type: 0xee665279,
		subtypeLength: 0,
		subtype: 0,
		fields: new type.struct({
			id: type.int32,
			unknown02: type.int8,
			msg: type.string
		})
	},
	
	
	
	
	// FIXME: The incomingAudio packet has conditional fields.
	// incomingAudio: {
	// }
	
	
	
	// Received at regular intervals, supposedly used for ping timeouts.
	heartbeat: {
		type: 0xf5821226,
		subtypeLength: 0,
		subtype: 0,
		fields: new type.struct({})
	},	
	
	
	
	
	// Sent from the game master console
	gameMasterMessage: {
		type: 0x809305a7,
		subtypeLength: 0,
		subtype: 0,
		fields: new type.struct({
			// Destination:
			// 
			//   0: Comms channel (server generates commsIncoming packet)
			// For destinations 1-6, the game server generates a gameMessage packet.
			//   1: Main Screen
			//   2: Helm
			//   3: Weapons
			//   4: Engineering
			//   5: Science
			//   6: Comms console
			destination: type.int32,
			sender: type.string,		// Who sends the message (Only for comms channel)
			msg: type.string
		})
	},
	
	
	
	// Received when starting a game
	difficulty: {
		type: 0x3de66711,
		subtypeLength: 0,
		subtype: 0,
		fields: new type.struct({
			difficulty: type.int32,
			// Possible values for gameType are:
			//   0 - Siege
			//   1 - Single front
			//   2 - Double front
			//   3 - Deep Strike
			//   4 - Peacetime
			//   5 - Border War
			// Values are only meaningful for Solo and Coop games.
			gameType: type.int32
		})
	},	
	
	
	
	
	// Received when an object is removed from play
	remove: {
		type: 0xcc5a3e30,
		subtypeLength: 0,
		subtype: 0,
		fields: new type.struct({
			type: type.int8,
			id: type.int32
		})
	},
	
	
	// Received when DamCon teams move around and repair things, or when
	//   system nodes are damaged.
	// FIXME: The DamCon packet needs a boundArray data type.
// 	difficulty: {
// 		type: 0x077e9f3c,
// 		subtypeLength: 0,
// 		subtype: 0,
// 		fields: new type.struct({
// 		})
// 	},
	
	
	
	
	// Received (usually during game start-up) when consoles are being taken by players
	consoles: {
		type: 0x19c6e2d4,
		subtypeLength: 0,
		subtype: 0,
		fields: new type.struct({
			playerShipIndex: type.int32,	// From 1 to 8
			// 	Values for availability are: 0 = available, 1 = mine, 2 = unavailable
			mainScreen:     type.int8,
			helm:           type.int8,
			weapons:        type.int8,
			engineering:    type.int8,
			science:        type.int8,
			communications: type.int8,
			data:           type.int8,
			observer:       type.int8,
			captainsmap:    type.int8,
			gameMaster:     type.int8
		})
	},
	
	
	
	
	
	// Received at comms
	commsIncoming: {
		type: 0xd672c35f,
		subtypeLength: 0,
		subtype: 0,
		fields: new type.struct({
			// Possible values for "priority":
			// 0: We will surrender
			// 1:
			// 2:
			// 3:
			// 4: We're under attack
			// 5: Docking crew ready
			// 6: We've produced another missile
			// 7: Help us help you
			// 8: Will you surrender?!
			priority: type.int32,
			sender:   type.string,
			msg:      type.string
		})
	},
	
	
	
	
	
	// Received when a beam weapon has been fired
	// A beam shot has an ID like any other entities in the world model
	beamFired: {
		type: 0xb83fd2c4,
		subtypeLength: 0,
		subtype: 0,
		fields: new type.struct({
			id:        type.int32,
			firedFromOwnShip: type.int32,
			damage:    type.int32,
			beamPort:  type.int32,	// Usually 0 is starboard arc and 1 is portside arc
			unknown05: type.int32,	// Observed 4
			unknown06: type.int32,	// Observed 1 and 4
			sourceId:  type.int32,
			targetId:  type.int32,
			impactX:   type.float,
			impactY:   type.float,
			impactZ:   type.float,
			unknown12: type.int8
		})
	},
	
	
	
	
	
	//////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////
	//// Updates for WORLD MODEL entities follow.
	
	
	
	
	
	
	// Received when an entity is destroyed.
	// Not sure about the difference with the "remove" packet - maybe has to do with
	//   the way scripted missions remove objects from play without actually destroying them.
// 	destroy: {
// 		type: 0x80803df9,
// 		subtypeLength: 1,
// 		subtype: 0x00,	//	0
// 		fields: new type.struct({
// 			entityType: type.int32,
// 			id:         type.int32
// 		})
// 	},
	
	
	
	noUpdate: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x00,	//	0
		fields: new type.struct({
// 			padding01: type.int8,
// 			padding02: type.int16
		})
	},
		
	
	
	
	
	playerShip: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x01,	// 1
		fields: new type.struct({
			id: type.int32,
			data: new type.bitmapstruct(5,{
				weaponsTargetId: type.int32,   // 01
				impulseSpeed:    type.int32,   // 02
				rudder:          type.float,	 // 04   From -0.5 (left) to +0.5 (right)
				impulseSpeedMax: type.float,   // 08
				turnRateMax:     type.float,   // 10
				autoBeams:       type.int8,    // 20
				warp:            type.int8,    // 40
				energy:          type.float,   // 80
				
				shieldState:     type.int16,
				playerShipIndex: type.int32,
				shipType:        type.int32,
				posX:            type.float,
				posY:            type.float,
				posZ:            type.float,
				pitch:           type.float,
				roll:            type.float,
				
				heading:       type.float,	// In radians
				velocity:      type.float,
				unknown19:     type.int16,
				shipName:      type.string,
				forShields:    type.float,
				forShieldsMax: type.float,
				aftShields:    type.float,
				aftShieldsMax: type.float,
				
				dockingId:        type.int32,	// ID of the station being docked with
				redAlert:         type.int8,
				unknown27:        type.float,
				mainScreen:       type.int8,	// What is being shown on the main screen
				beamFrequency:    type.int8,
				coolantAvailable: type.int32,
				scienceTargetId:  type.int32,
				captainTargetId:  type.int32,
				
				driveType:        type.int16,
				scanningTargetId: type.float,
				scanningProgress: type.float,
				reverse:          type.int32,	// Has a weird -1 -ish value sometimes
				diveRise:         type.float,	// 1 = rising, 0 = neutral, -1 = diving
				unknown38:        type.int16,
// 				unknown39:        type.int32
			})                       
		})
	},
	
	
	
	
	// Status of the torpedoes subsystem in the player ship.
	weapons: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x02,	// 2
		fields: new type.struct({
			id: type.int32,
			data: new type.bitmapstruct(3,{
				// tubeUsed is 0 if unloaded, 2 if loading, 1 if loaded, 3 if unloading.
				// 0 -> 2 -> 1 -> 3 -> 0 (unloading)
				// 0 -> 2 -> 1 -> 0 (firing)
				
				// Unknown11 seems to depend on the ship being piloted:
				//  41 (00101001) for scout
				//  94 (01011110) for light cruiser
				// 123 (01111011) for dreadnought
				// 232 (11101000) for missile cruiser
				//  95 (01011111) for battlecruiser
				storesHoming: type.int8,
				storesNukes:  type.int8,
				storesMines:  type.int8,
				storesEMPs:   type.int8,
				unknown05:    type.int8,
				unloadTime1:  type.float,
				unloadTime2:  type.float,
				unloadTime3:  type.float,
				unloadTime4:  type.float,

				unloadTime5:  type.float,
				unloadTime6:  type.float,
				tubeUsed1:    type.int8,
				tubeUsed2:    type.int8,
				tubeUsed3:    type.int8,
				tubeUsed4:    type.int8,
				tubeUsed5:    type.int8,

				tubeUsed6:     type.int8,	//// FIXME!!!
				tubeContents1: type.int8,
				tubeContents2: type.int8,
				tubeContents3: type.int8,
				tubeContents4: type.int8,
				tubeContents5: type.int8,
				tubeContents6: type.int8,
// 				unknown23:     type.int8
								
				// Last byte of the bitmapstruct seems to be unused.
			})                       
		})
	},
	
	
	
	
	
	// Engineering status of the ship: coolant, power and heat levels.
	engineering: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x03,	// 3
		fields: new type.struct({
			id: type.int32,
			data: new type.bitmapstruct(4,{
				heatBeams:       type.float,
				heatTorpedoes:   type.float,
				heatSensors:     type.float,
				heatManeuver:    type.float,
				heatImpulse:     type.float,
				heatWarp:        type.float,
				heatForShields:  type.float,
				heatAftShields:  type.float,
				
				energyBeams:      type.float,
				energyTorpedoes:  type.float,
				energySensors:    type.float,
				energyManeuver:   type.float,
				energyImpulse:    type.float,
				energyWarp:       type.float,
				energyForShields: type.float,
				energyAftShields: type.float,
				
				coolantBeams:      type.int8,
				coolantTorpedoes:  type.int8,
				coolantSensors:    type.int8,
				coolantManeuver:   type.int8,
				coolantImpulse:    type.int8,
				coolantWarp:       type.int8,
				coolantForShields: type.int8,
				coolantAftShields: type.int8
				
				// Last byte of the bitmapstruct seems to be unused.
			})                       
		})
	},
	
	
	
	
	
	
	
	// Upgrades status of the ship: which upgrades are aavailable.
	
	// This is all guesswork, I haven't seen any changing values in this packet.
	
	// The game UI displays 28 possible upgrades.
	// There is a 7-byte bitmask with 56 bits (28*2). 
	// Then there is a 4-byte word with 28 (out of 32) bits set to 1. Maybe upgrades possible for this ship?
	// Then, there are 28 4-byte words, all zeroed out. Are these one 4-byte or 2 2-bytes data fields per upgrade?
	// How does this map to the bitmap??
	upgrades: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x04,	// 4
		fields: new type.struct({
			id: type.int32,
			data: new type.bitmapstruct(7,{
				mask:      type.int32,
				unknown02: type.int32,
				unknown03: type.int32,
				unknown04: type.int32,
				unknown05: type.int32,
				unknown06: type.int32,
				unknown07: type.int32,
				unknown08: type.int32,
				
				unknown09: type.int32,
				unknown10: type.int32,
				unknown11: type.int32,
				unknown12: type.int32,
				unknown13: type.int32,
				unknown14: type.int32,
				unknown15: type.int32,
				unknown16: type.int32,
				
				unknown17: type.int32,
				unknown18: type.int32,
				unknown19: type.int32,
				unknown20: type.int32,
				unknown21: type.int32,
				unknown22: type.int32,
				unknown23: type.int32,
				unknown24: type.int32,
				
				unknown25: type.int32,
				unknown26: type.int32,
				unknown27: type.int32,
				unknown28: type.int32,
				unknown29: type.int32
// 				unknown30: type.int32,
// 				unknown31: type.int32,
// 				unknown31: type.int32
			})                       
		})
	},
	
	
	
	
	// NPC ships
	npc: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x05,	// 5
		fields: new type.struct({
			id: type.int32,
			data: new type.bitmapstruct(7,{
				shipName:    type.string,
				unknown02:   type.float,
				rudder:      type.float,
				impulseMax:  type.int32,
				turnRateMax: type.int32,
				isEnemy:     type.int32,
				shipType:    type.int32,
				posX:        type.float,
				
				posY:        type.float,
				posZ:        type.float,
				pitch:       type.float,
				roll:        type.float,
				heading:     type.float,
				velocity:    type.float,
				surrendered: type.int8,
				unknown16:   type.int16,	// Maybe surrender chance
				
				forShields:      type.float,
				forShieldsMax:   type.float,
				aftShields:      type.float,
				aftShieldsMax:   type.float,
				unknown21:       type.int16,	// Maybe shieldsActive
				unknown22:       type.int8, 	// Maybe triggersMines
				eliteBits:       type.int32,
				eliteBitsActive: type.int32,
				
				scanned:   type.int32,
				faction:   type.int32,
				unknown27: type.int32,
				unknown28: type.int8,
				unknown29: type.int8,
				unknown30: type.int8,
				unknown31: type.int8,
 				unknown31: type.float,	// Observed -10000
  
				unknown25:       type.int32,
				unknown26:       type.int32,
				damageBeams:     type.float,
				damageTorpedoes: type.float,
				damageSensors:   type.float,
				damageManeuver:  type.float,
				damageImpulse:   type.float,
				damageWarp:      type.float,

				damageForShield: type.float,
				damageAftShield: type.float,
				shieldFreqA:     type.float,
				shieldFreqB:     type.float,
				shieldFreqC:     type.float,
				shieldFreqD:     type.float,
				shieldFreqE:     type.float
			})                       
		})
	},
	
	
	
	// Space stations
	station: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x06,	// 6
		fields: new type.struct({
			id: type.int32,
			data: new type.bitmapstruct(2,{
				shipName:   type.string,
				forShields: type.float,
				aftShields: type.float,
				unknown04:  type.int32,	// Looks like an incremental 0-based station ID
				shipType:   type.int32,
				posX:       type.float,
				posY:       type.float,
				posZ:       type.float,
				
				unknown09: type.int32,
				unknown10: type.int32,
				unknown11: type.int32,
				unknown12: type.int16,
				unknown13: type.int16,
				unknown14: type.int16,
				unknown15: type.int16
			})                       
		})
	},
	
	
	
	
	
	
	
	// Mines
	mine: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x07,	// 7
		fields: new type.struct({
			id: type.int32,
			data: new type.bitmapstruct(1,{
				posX:      type.float,
				posY:      type.float,
				posZ:      type.float,
				shipName:  type.string,
				unknown05: type.int32,
				unknown06: type.int32,
				unknown07: type.int32,
				unknown08: type.int32
			})                       
		})
	},
	
	

	
	anomaly: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x08,	// 8
		fields: new type.struct({
			id: type.int32,
			data: new type.bitmapstruct(1,{
				posX:      type.float,
				posY:      type.float,
				posZ:      type.float,
				shipName:  type.string,
				unknown05: type.int32,
				unknown06: type.int32,
				unknown07: type.int32,
				unknown08: type.int32
			})                       
		})
	},
		
	
	//// FIXME: Add subtype 0x09
	
	nebula: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x0a,	// 10
		fields: new type.bitmapstruct(1,{
			posX: type.float,
			posY: type.float,
			posZ: type.float,
			colorR: type.float,
			colorG: type.float,
			colorB: type.float
		})
	},
	
	
	
	torpedo: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x0b,	// 11
		fields: new type.struct({
			id: type.int32,
			data: new type.bitmapstruct(1,{
				posX:         type.float,
				posY:         type.float,
				posZ:         type.float,
				speedX:       type.string,
				speedY:       type.int32,
				speedZ:       type.int32,
				ordnanceType: type.int32,	// Std, Nuke, Mine, EMP
				unknown08:    type.int32
			})                       
		})
	},
	
	
	
	
	blackHole: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x0c,	// 12
		fields: new type.struct({
			id: type.int32,
			data: new type.bitmapstruct(1,{
				posX:      type.float,
				posY:      type.float,
				posZ:      type.float,
				shipName:  type.string,
				unknown05: type.int32,
				unknown06: type.int32,
				unknown07: type.int32,
				unknown08: type.int32
			})                       
		})
	},
		
	
	
	
	asteroid: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x0d,	// 13
		fields: new type.struct({
			id: type.int32,
			data: new type.bitmapstruct(1,{
				posX:      type.float,
				posY:      type.float,
				posZ:      type.float,
				shipName:  type.string,
				unknown05: type.int32,
				unknown06: type.int32,
				unknown07: type.int32,
				unknown08: type.int32
			})                       
		})
	},
	
	
	//// FIXME: Add subtype 0x0e, presumably generic mesh.

	monster: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x0f,	// 15
		fields: new type.struct({
			id: type.int32,
			data: new type.bitmapstruct(1,{
				posX:      type.float,
				posY:      type.float,
				posZ:      type.float,
				shipName:  type.string,
				unknown05: type.int32,
				unknown06: type.int32,
				unknown07: type.int32,
				unknown08: type.int32
			})                       
		})
	},
	
	

	
	whale: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x10,	// 16
		fields: new type.struct({
			id: type.int32,
			data: new type.bitmapstruct(2,{
				shipName:  type.string,
				unknown02: type.int32,
				unknown03: type.int32,
				posX:      type.float,
				posY:      type.float,
				posZ:      type.float,
				pitch:     type.float,
				roll:      type.int32,
				
				heading:   type.float,
				unknown09: type.float,
				unknown10: type.float,
				unknown11: type.float,	// Observed from 0 to 0.855
				unknown12: type.float,	// Observed from 0.5 to 1.36
			})                       
		})
	},
	
		
	
	
	
	drone: {
		type: 0x80803df9,
		subtypeLength: 1,
		subtype: 0x11,	// 17
		fields: new type.struct({
			id: type.int32,
			data: new type.bitmapstruct(2,{
				damage:    type.int32,
				posX:      type.float,
				unknown03: type.float,	// Maybe speedX?
				posY:      type.float,
				unknown05: type.float,	// Maybe speedY?
				posZ:      type.float,
				unknown07: type.float,	// Maybe speedZ?
				unknown08: type.int32,	// Possibly a flag bitmap?
				
				unknown09: type.float
			})                       
		})
	},
	
	
	
	
	
	
	
	
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	// Game-related messages
	
	
	
	gameUnpaused: {
		type: 0xf754c8fe,
		subtypeLength: 4,
		subtype: 0x00,	// 0
		fields: new type.struct({})
	},
	
	
	gamePaused: {
		type: 0xf754c8fe,
		subtypeLength: 4,
		subtype: 0x01,	// 1
		fields: new type.struct({})
	},
	
	
	soundEffect: {
		type: 0xf754c8fe,
		subtypeLength: 4,
		subtype: 0x03,	// 3
		fields: new type.struct({
			filename: type.string
		})
	},
	
	
	togglePause: {
		type: 0xf754c8fe,
		subtypeLength: 4,
		subtype: 0x04,	// 4
		fields: new type.struct({})
	},
	
	
	gameReset: {
		type: 0xf754c8fe,
		subtypeLength: 4,
		subtype: 0x06,	// 6
		fields: new type.struct({})
	},
	


	
	skybox: {
		type: 0xf754c8fe,
		subtypeLength: 4,
		subtype: 0x09,	// 9
		fields: new type.struct({
			skyboxID: type.int32
		})
	},
	
	
	
	
	allPlayerShipsSettings: {
		type: 0xf754c8fe,
		subtypeLength: 4,
		subtype: 0x0f,	// 15
		fields: new type.staticsizearray(8,{
			driveType: type.int32,
			shipType:  type.int32,
			unknown03: type.int32,
			name:      type.string
		})
	},
	
	
	
	gameOverReason: {
		type: 0xf754c8fe,
		subtypeLength: 4,
		subtype: 0x14,	// 20
		fields: new type.struct({
			title:  type.string,
			reason: type.string
		})
	},
	
	
	gameOverStats: {
		type: 0xf754c8fe,
		subtypeLength: 4,
		subtype: 0x15,	// 21
		fields: new type.struct({
			column: type.int8,
			stats:  new type.byteboundarray(0xce,{
				unknown01: type.int8,
				count: type.int32,
				label: type.string
			})
		})
	},
	
	

	
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	// Client messages, part 1
	
	setConsole: {
		type: 0x4c821d3c,
		subtypeLength: 4,
		subtype: 0x0e,	// 14
		fields: new type.struct({
			console:   type.int32,
			selected:  type.int32
		})
	},
	
	

	

};









// Redo the table, with the int32 types pointing to a structure holding
//   the subtype lenght and refs to the packet defs.
// This way we can access packet defs by their int32 type + subtype.

var packetDefsByType = {};

for (var name in packetDefsByName) {
	
	var type    = packetDefsByName[name].type;
	var subtype = packetDefsByName[name].subtype;
	var fields  = packetDefsByName[name].fields;
	
	if (!packetDefsByType.hasOwnProperty( type )) {
		packetDefsByType[type] = {
			subtypeLength: packetDefsByName[name].subtypeLength
		}
	}
	
	packetDefsByType[type][subtype] = {name: name, fields: fields};
	
}

console.log(packetDefsByType);



module.exports = {
	packetDefsByType: packetDefsByType,
	packetDefsByName: packetDefsByName
};

