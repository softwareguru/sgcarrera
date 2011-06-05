var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send('Hello SG World!');
});

var port = process.env.PORT || 8080;
console.log("Listening on " + port);

app.listen(port);

