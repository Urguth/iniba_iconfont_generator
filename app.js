var express = require('express');
var mkdirp = require('mkdirp');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var save = require('./app_content/modules/saveSVGs.js');
var arr = [];
var folder = "";
var fs = require('fs');

app.set('port', (process.env.PORT || 3000));
app.use(express.static('app_content'))

io.on('connection', function (client) {
  client.on('savefile', function (data) {
    folder = String(new Date().getUTCMilliseconds() + new Date().getFullYear());
    mkdirp('app_content/svg/' + folder, function (err) {
      if (err) return console.log(err);
      save(data.arr, [], folder, 0, mkdirp, data.name, app, client);
    });
  });
});

server.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
