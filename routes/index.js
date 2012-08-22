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

  polls.push({id : polls.length, name : req.body.name, alternatives : req.body.alternatives.split(',')});
  res.render('index', {title:'Thanks', polls:polls});

};