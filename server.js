var express = require('express');
var auth = require('./auth');
var conf = require('./conf');

var everyauth = auth.everyauth;
var port = conf.port;

//Here we create the server
var app = express.createServer(
    express.logger(),
    express.cookieParser(),
    express.session({ secret: "iamedu" }),
    everyauth.middleware()
);

//And now we configure it
app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.set('view engine', 'jade');
});

everyauth.helpExpress(app);

app.configure('development', function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});

//And add our routes
app.get('/', function(req, res) {
    res.render('index');
});

console.log("Listening on " + port);

app.listen(port);

