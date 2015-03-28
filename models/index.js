var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/noteInABottle');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


var Bottle, Note;
var Schema = mongoose.Schema;

var noteSchema = new Schema({
	note : {type : [String]} // string set ex) C4-time
});

var bottleSchema = new Schema({
  // setup schema here
  bottle : {type : [noteSchema]} // added noteSchema to possibly add more features
});

Bottle = mongoose.model('Bottle', bottleSchema);
Note = mongoose.model('Note', noteSchema);


module.exports = {
	Bottle : Bottle,
	Note : Note
};

