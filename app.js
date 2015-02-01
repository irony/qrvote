
/**
 * Module dependencies.
 */

var express = require('express');

var app = express();

var mongoose = require('mongoose');

// var db = mongojs.connect('heroku:e3c0d435e08f62dd53c7e80013fb0475@alex.mongohq.com:10038/app6933985', ['Poll']);
var db = mongoose.createConnection(process.env.MONGO_URL || process.env.MONGOHQ_URL || 'mongodb');

var server = app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});

var io = require('socket.io').listen(server);
var routes = require('./routes')(io, db);

// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static('public'));

// Routes


app.get('/', routes.index);
app.get('/add', routes.add);
app.get('/poll/:id', routes.poll);
app.get('/poll/:id/:alternativeId', routes.vote);
app.post('/save', routes.save);
