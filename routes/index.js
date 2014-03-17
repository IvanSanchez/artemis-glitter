
/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'Artemis Glitter' })
};



/*
 * GET debug map.
 */
exports.map = function(req, res){
	res.render('map', { title: 'Debug Map - Artemis Glitter' });
};




/*
 * GET Bearings and Distances table.
 */
exports.bearingTable = function(req, res){
	res.render('bearing-table', { title: 'Bearing Table - Artemis Glitter' });
};
