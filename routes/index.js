var express = require('express');
var models = require('../models');
var Bottle = models.Bottle;
var Note = models.Note;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = function(io) {

	io.on('connection', function(socket) {
		socket.on('createBottle', function(request) {
			var newBottle = new Bottle({
				bottle : request.data.reduce(function(notes_arr, note_element) {
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
	});

	return router;
};
