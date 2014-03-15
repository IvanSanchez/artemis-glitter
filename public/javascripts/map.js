

// Prepare styles for map
// Right now it's one style per object type (see docs about enums):
//     0x01: player ship
//     0x02: weapons bridge station
//     0x03: engineering bridge station
//     0x04: other ship (enemy or civilian)
//     0x05: space station
//     0x06: mine
//     0x07: anomaly
//     0x09: nebula
//     0x0a: torpedo
//     0x0b: black hole
//     0x0c: asteroid
//     0x0d: generic mesh
//     0x0e: monster
//     0x0f: whale
//     0x10: drone

// More work needs to be done - i.e. making un-ID'ed vessels
//   appear white and color vessels depending of faction and 
//   surrender status

var styles = {
  '1': [new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({color: '#40c0c0'}),
      stroke: new ol.style.Stroke({color: '#00ffff', width: 1})
    })
  })],
  
  '4': [new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({color: '#c04040'}),
      stroke: new ol.style.Stroke({color: '#ff0000', width: 1})
    })
  })],
  
  '5': [new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({color: '#ffff00'})
//       stroke: new ol.style.Stroke({color: '#ba5544', width: 1})
    })
  })],
  
  '6': [new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({color: '#666666'}),
      stroke: new ol.style.Stroke({color: '#ffffff', width: 1})
    })
  })]
  
};



// Prepare fake projection for map
var artemisProjection = new ol.proj.Projection({
  code: 'meters',
  units: 'm',
//   extent: [0, 0, 100000, 100000]
  extent: [0, 0, 100000, 100000]
});


// Prepare popup <div>
var popup = new ol.Overlay({
  element: document.getElementById('popup')
});


// Prepare vector layer
var vectorSource = new ol.source.Vector({
  features: []
});
var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: function(feature, resolution) {
  /// FIXME: Replace with proper symbolizers
    return styles[feature.get('type')];
  }
});



// Init map
var map = new ol.Map({
  layers: [
    new ol.layer.Image({
      source: new ol.source.ImageStatic({
        url: '/images/map_background_601px.png',
        imageSize: [601, 601],
        projection: artemisProjection,
        imageExtent: artemisProjection.getExtent()
      })
    }),
    vectorLayer
  ],
  renderer: 'canvas',
  target: 'map',
  view: new ol.View2D({
    projection: artemisProjection,
    center: ol.extent.getCenter(artemisProjection.getExtent()),
    zoom: 1
  }),
  overlays: [popup]
});




// Hook up events to world model so we can draw/mode vector 
//   features when entities appear/move

function addOrUpdateMapEntity(data) {
	var id = data.id;
	if (!data.hasOwnProperty('posX') || !data.hasOwnProperty('posZ')) {
		return;
	}
	
	var geom = new ol.geom.Point([100000 - data.posX, 100000 - data.posZ]);
	
	var entity = model.entities[id]
	
	if (!entity.hasOwnProperty('ol3Feature')) {
		console.log('New entity in map : ', data);
		var feat = entity.ol3Feature = new ol.Feature({
		    'geometry': geom,
		    'id': data.id,
		    'type': data.entityType
		});
		vectorSource.addFeature(feat);
	} else {
		entity.ol3Feature.setGeometry(geom);
	}
}

/// FIXME: It might be possible for an entity to not have coordinates on newEntity, but have them on updateEntity

model.on('newEntity', function(data){
	addOrUpdateMapEntity(data);
});

model.on('updateEntity', function(data){
	addOrUpdateMapEntity(data);
});

model.on('destroyEntity', function(data){
	console.log('Destroyed entity in world model: ', data);
});


