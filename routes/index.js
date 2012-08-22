/*
 * GET home page.
 */

module.exports = function(db){

  this.index = function(req, res){

    db.Poll.find(function(err, polls){
     res.render('index', { title: 'Polls', polls : polls });
    });
    
  };



  this.add = function(req, res){
    res.render('add', { title: 'Add poll'});
  };

  this.save = function(req,res){

    var poll = {name : req.body.name, alternatives : req.body.alternatives.split(',').map(function(alternative){return alternative.trim();})};
    
    poll.votes = poll.alternatives.map(function(){return [];});

    db.Poll.save(poll, function(err, poll){
      console.log(poll);
      res.redirect('/poll/' + poll._id);
    });
  };

  this.poll = function(req,res){
    var poll = db.Poll.findOne({_id : db.ObjectId(req.params.id)}, function(err, poll){
      res.render('poll', {title:poll.name, poll:poll});
    });
  };


  this.vote = function(req,res){
    var poll = db.Poll.findOne({_id : db.ObjectId(req.params.id)}, function(err, poll){

      poll.votes = poll.votes || [];
      
      var vote = {};
      vote.ip = req.ip;
      vote.alternative = poll.alternatives[req.params.alternativeId];
      //tODO: better id
      
      poll.votes[req.params.alternativeId] = poll.votes[req.params.alternativeId] || [];

      poll.votes[req.params.alternativeId].push(vote);

      db.Poll.update(poll._id, poll, function(err){
        res.render('poll', {title:poll.name, poll:poll});
      });

    });
  };


  return this;
};
