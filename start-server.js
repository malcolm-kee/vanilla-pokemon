var path = require('path');
var liveServer = require('live-server');

var serverSettings = {
  port: 8181,
  root: path.resolve(__dirname, 'public'),
  wait: 500
};

liveServer.start(serverSettings);
