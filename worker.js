var http = require('http').createServer(require('./'));
require('pm').createWorker().ready(function (socket, port) {
  http.emit('connection', socket);
});