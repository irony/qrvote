/*
 * GET home page.
 */

 module.exports = function(app, db){

  var io = require('socket.io').listen(app);

  var self = this;

  var Poll = db.model('Poll', require('../models/poll.js'));

  self.index = function(req, res){
    Poll.find(function(err, polls){
     if (err)
      throw err;

     res.render('index', { title: 'Polls', polls : polls });
   });
  };


  self.add = function(req, res){
    res.render('add', { title: 'Add poll'});
  };

  self.save = function(req,res){

    var poll = new Poll({name : req.body.name, alternatives : req.body.alternatives.split(',').map(function(alternative){
      return {name: alternative.trim(), votes: []};
    })});

    poll.save(function(err, poll){
      console.log(poll);
      res.redirect('/poll/' + poll._id);
    });
  };

  self.poll = function(req,res){
    var poll = Poll.findOne({_id : req.params.id}, function(err, poll){
      
      if (!poll)
        return res.redirect('/');

      var totalVotes = poll.alternatives.reduce(function(a,b){
        return (a.votes ? a.votes.length : 0) + (b.votes ? b.votes.length : 0);
      });

      res.render('poll', {title:poll.name, poll:poll, totalVotes: totalVotes, host: req.headers.host});
    });
  };


  self.vote = function(req,res){
    var poll = Poll.findOne({_id : req.params.id}, function(err, poll){

      if (!poll)
        return res.redirect('/');

      var vote = { user: req.user, ip: req.ip, session: req.session };

      var alternatives = poll.alternatives;
      
      poll.alternatives[req.params.alternativeId].votes.push(vote);

      poll.save(function(err, poll){
        if (err)
          throw err;
      
        console.log('saved', poll.alternatives);

        io.sockets.emit('vote', poll);
        res.redirect('/poll/' + poll._id);
      });

    });
  };

  return self;

};
