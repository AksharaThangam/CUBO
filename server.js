var express = require('express');
var app = express();
var chokidar = require('chokidar'); // wrapper package around fs.watch
var request = require('request');
var integrationServicesRouter = express.Router();
var port = process.env.PORT || 8000;
require('./app/integration_services_router')(integrationServicesRouter);
var folderLocation = require('./config/config')['folderLocation'];


/**Initialize a watcher
 * ignored: files/paths to be ignored
 **/
var watchFolder = chokidar.watch(folderLocation, {
    ignored: '*.txt'
});

var file_id = 0;

// event listener to check if a new file is added
watchFolder
    .on('add', function (path) {
        processFile(path, (file_id++));
    });



app.use('/integration_services', integrationServicesRouter);
app.listen(port);
console.log("Express running at " + port);
module.exports = app;
