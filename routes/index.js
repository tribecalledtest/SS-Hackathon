var express = require('express');
var router = express.Router();

//ToDo: May just reference one schema
var models = require('../models');
var Bottle = models.Bottle;
var Note = models.Note;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
var sessions = [];

var setAvailability = function(socket_id, available){
	sessions.forEach(function(user){
		if(user.id == socket_id) {
			user.available = available;
		}
	});
};



module.exports = function(io) {

	io.on('connection', function(socket) {
		sessions.push({
			id: socket.id,
			available: true
		});

		socket.on('disconnect', function(){
			console.log("before " + sessions);
			sessions.splice(sessions.indexOf(
				sessions.filter(function(el){
					return el.id == socket.id;
				})
			));

			console.log("after " + sessions);
		});

		//create bottle
		socket.on('create',function(){
			// console.log(data); // TODO FORMAT OF DATA
			//set the session to unavailable for receiving music
			setAvailability(socket.id,false);

			//response
			console.log(socket.id + 'unavailble to receive');

			//show data
			console.log(sessions.filter(function(session){
				return socket.id == session.id;
			}));
		});

		//save bottle
		socket.on('save', function(request) {
			setAvailability(socket.id,true);
			console.log(socket.id + 'available to receive bottle');
			//save to the database, create new bottle
			var newBottle = new Bottle({
				bottle : request.type.reduce(function(notes_arr, note_element) {
					notes_arr.push(new Note({
						note : note_element.note,
						noteLength : note_element.noteLength
					}));
 
					return notes_arr;
 
				}, [])
			});
 
			newBottle.save(function(err, saveBottle) {
				if (err) return next(err);
 
				console.log('saved');
			});
		});

		console.log('connected' + socket.id);
	});

	return router;
};

// <!-- var noteSchema = new Schema({
//   note : {type : String}, // string set ex) C4-time
//   time : {type : Number}
// });

// var bottleSchema = new Schema({
//   // setup schema here
//   bottle : {type : [noteSchema]} // added noteSchema to possibly add more features
// }); -->
