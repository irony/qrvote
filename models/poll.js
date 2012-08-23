
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var pollSchema = new Schema({
  name:  String,
  alternatives: [{name:String, votes:[{ip:String, user:{}, session:String}]}]
});

module.exports = pollSchema;