/*
 * GET home page.
 */


var polls = [];

exports.index = function(req, res){
  res.render('index', { title: 'Polls', polls : polls });
};



exports.add = function(req, res){
  res.render('add', { title: 'Add poll', polls : polls });
};

exports.save = function(req,res){

  var poll = {id : polls.length, name : req.body.name, alternatives : req.body.alternatives.split(',')};

  polls[poll.id] = poll;

  res.redirect('/poll/' + poll.id);
};

exports.poll = function(req,res){

  var poll = polls[req.params.id];

  res.render('poll', {title:poll.name, poll:poll});

};