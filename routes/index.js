var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = function(io) {

	io.on('connection', function(socket) {
		console.log('connected' + socket.id);
	});

	return router;
};
