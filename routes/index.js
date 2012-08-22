/*
 * GET home page.
 */

 module.exports = function(app, db){

  var io = require('socket.io').listen(app);

  var self = this;

  self.index = function(req, res){
    db.Poll.find(function(err, polls){
     res.render('index', { title: 'Polls', polls : polls });
   });
  };


  self.add = function(req, res){
    res.render('add', { title: 'Add poll'});
  };

  self.save = function(req,res){

    var poll = {name : req.body.name, alternatives : req.body.alternatives.split(',').map(function(alternative){return alternative.trim();})};

    poll.votes = poll.alternatives.map(function(){return [];});

    db.Poll.save(poll, function(err, poll){
      console.log(poll);
      res.redirect('/poll/' + poll._id);
    });
  };

  self.poll = function(req,res){
    var poll = db.Poll.findOne({_id : db.ObjectId(req.params.id)}, function(err, poll){
      res.render('poll', {title:poll.name, poll:poll});
    });
  };


  self.vote = function(req,res){
    var poll = db.Poll.findOne({_id : db.ObjectId(req.params.id)}, function(err, poll){

      console.log(poll);
      poll.votes = poll.votes || [];

      var vote = {};
      vote.ip = req.ip;
      

      poll.votes[req.params.alternativeId].push(vote);

      console.log(poll.votes);

      db.Poll.update({_id: poll._id}, poll, function(err){
        io.sockets.emit('vote', poll);
        res.redirect('/poll/' + poll._id);
      });

    });
  };

  return self;

};
