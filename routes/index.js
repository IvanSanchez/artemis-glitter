
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
