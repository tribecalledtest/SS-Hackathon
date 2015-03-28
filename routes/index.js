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
var bottles = [];

var setAvailability = function(socket_id, available){
	sessions.forEach(function(user){
		if(user.id == socket_id) {
			user.available = available;
		}
	});
};

var userRandomizer = function(){
	var filteredResults = sessions.filter(function(el){
		return el.available === true;
	});
	if (filteredResults.length === 0) return false;

	var random = Math.floor(Math.random() * filteredResults.length);
	sessions[sessions.indexOf(filteredResults[random])].available = false;
	return filteredResults[random].id;
};

var bottleRandomizer = function(bottles){
	var random = Math.floor(Math.random() * bottles.length);
	return bottles[random];
};

module.exports = function(io) {

	io.on('connection', function(socket) {
		sessions.push({
			id: socket.id,
			available: true
		});

		console.log(sessions);

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

		socket.on('avail', function() {
			setAvailability(socket.id,true);

			// bottle randomizer
			Bottle.find({available : true, modified : { $ne : socket.id}}, function(err, bottles) {
				if (bottles.length > 0) {
					var nextId = userRandomizer();
					if (nextId) {
						socket.broadcast.to(nextId).emit('receive', bottleRandomizer(bottles));
					}
					console.log(sessions);
				}
			});
		});

		socket.on('notavail', function() {
			setAvailability(socket.id,false);
			console.log(sessions);
		});

		//save bottle
		socket.on('save', function(request) {
			var nextId = userRandomizer();

			setAvailability(socket.id,true);
			console.log(socket.id + 'available to receive bottle');

			if (request.updateId) { // if update

			} else { // if save
				var newBottle = new Bottle({
					bottle : request.type,
					available : true,
					modified : socket.id
				});

				newBottle.save(function(err, bottle) {
					if (err) return console.log(err);
				});
			}

			// Bottle.find({available: true}, function(err, bottles) {
			// 	if (err) throw new Error("bottle query error");
			// 	// console.log(nextId, sessions);
			// 	socket.broadcast.to(nextId).emit('received', bottleRandomizer(bottles));
			// });
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
