
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

var mongoose = require('mongoose');

// var db = mongojs.connect('heroku:e3c0d435e08f62dd53c7e80013fb0475@alex.mongohq.com:10038/app6933985', ['Poll']);

var db = mongoose.createConnection(process.env.MONGO_URL || process.env.MONGOHQ_URL || 'localhost/qrVote');



var routes = require('./routes')(app, db);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes


app.get('/', routes.index);
app.get('/add', routes.add);
app.get('/poll/:id', routes.poll);
app.get('/poll/:id/:alternativeId', routes.vote);
app.post('/save', routes.save);

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
