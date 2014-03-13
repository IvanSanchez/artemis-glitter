

// Prepare styles for map

var styles = {
  '10': [new ol.style.Style({
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({color: '#666666'}),
      stroke: new ol.style.Stroke({color: '#ba5544', width: 1})
    })
  })],
  '20': [new ol.style.Style({
    image: new ol.style.Circle({
      radius: 10,
      fill: new ol.style.Fill({color: '#666666'}),
      stroke: new ol.style.Stroke({color: '#ba5544', width: 1})
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
    return styles[feature.get('size')];
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

/// FIXME: It might be possible for an entity to not have coordinates on newEntity, but have them on updateEntity

model.on('newEntity', function(data){
	console.log('New entity in world model: ', data);
	
	if (data.hasOwnProperty('posX') && data.hasOwnProperty('posZ')) {
		vectorSource.addFeature(new ol.Feature({
		    'geometry': new ol.geom.Point([100000 - data.posX, 100000 - data.posZ]),
		    'id': data.id,
		    'size': 10
		}));
	}
});

model.on('updateEntity', function(data){
	console.log('Updated entity in world model: ', data);
});

model.on('destroyEntity', function(data){
	console.log('Destroyed entity in world model: ', data);
});


