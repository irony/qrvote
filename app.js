
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

var mongojs = require('mongojs');
var db = mongojs.connect((process.env.MONGOHQ_URL|| 'localhost/qrVote').replace('mongodb://', ''), ['Poll']);


var  routes = require('./routes')(app, db);

// Configuration

debugger;

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
