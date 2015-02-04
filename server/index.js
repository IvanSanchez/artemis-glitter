

// Set config directories first, so other modules can use the proper config.
// Config directory is a problem when packaging with node-webkit, as the path
//   where the node-webkit executable was launched is not the path where it
//   is being run (it has been decompressed in some temporal location, etc)

var path    = require('path')
  , fs      = require('fs')
  , config  = require('config');

// Set a default configuration directory if one does not exist.
// process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || (path.dirname(module.uri) + '/config');

if (fs.existsSync(path.dirname(process.execPath) + '/config/')) {
    // Running from node-webkit
    process.env.NODE_CONFIG_DIR = path.dirname(process.execPath) + '/config/';

} else if (fs.existsSync(path.dirname(module.uri) + '/../config/')) {
    // Running from source
    process.env.NODE_CONFIG_DIR = path.dirname(module.uri) + '/../config/';
}

console.log('Module files are at ', path.dirname(module.uri));

console.log('Executable files are at ', path.dirname(process.execPath));

console.log('Using config file(s) at ', process.env.NODE_CONFIG_DIR);
var config = require('config');



console.log('Current config: ', config);


var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3333;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/../_public'));







var connection = require('./game-connection');

connection.connect('localhost','2010');















