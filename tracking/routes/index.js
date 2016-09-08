var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: '' });
});

// The normal browser page
router.get('/color_camera', function(req, res, next) {
	res.render('color_camera', { title: 'color_camera' });
});

// This will be the mobile page
router.get('/m/color_camera', function(req, res, next) {
	res.render('color_camera', { title: 'color_camera' });
});


// just a test api with id param
router.get('/api/v1.0/test/:id', function(req, res, next) {
	res.json([{
		"test": "OK",
		"id": req.params.id
	}, {
		"test": "OK2",
		"id": req.params.id
	}]);
});


// this is the api that gets called to process the request
router.post('/api/v1.0/test', function(req, res, next) {

	var action = req.body.action;
	var instruction = req.body.instruction;
	var image = req.body.image;

	console.log("Start Request ----------------");
	console.log("--Action: "+action);
	console.log("--Instructions: "+ instruction);
	console.log("--Image base64: "+ image);
	console.log("End  Request ----------------");

});


module.exports = router;
