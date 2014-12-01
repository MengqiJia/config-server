var app = require('pm').createMaster({
 'pidfile' : './cs.pid',
});

app.register('config', __dirname + '/worker.js', {
 'listen' : [process.env.PORT || 7070]
});

app.on('giveup', function (name, num, pause) {
  // YOU SHOULD ALERT HERE!
  console.error(Array.prototype.concat.call(arguments, ['give up']));
});
app.dispatch();