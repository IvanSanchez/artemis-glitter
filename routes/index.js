
/*
 * GET home page.
 */
exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};



/*
 * GET debug map.
 */
exports.map = function(req, res){
	res.render('map');
};
