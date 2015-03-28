var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/noteInABottle');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


var Bottle;
var Schema = mongoose.Schema;

var bottleSchema = new Schema({
  // setup schema here
  bottle : Object, // added noteSchema to possibly add more features
  available : Boolean,
  modified: String
});

Bottle = mongoose.model('Bottle', bottleSchema);

module.exports = {
	Bottle : Bottle
};

