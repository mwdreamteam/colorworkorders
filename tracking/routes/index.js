var express = require('express');
var router = express.Router();


function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}



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

router.post('/api/v1.0/test', function(req, res, next) {
	 	var dateFormat = require('dateformat');
	
	var image = req.body.image;
	 var imageBuffer;
if (image != '') {
	 imageBuffer= decodeBase64Image(req.body.image);
	 } else {
imageBuffer = 'no image';
	 }

	 var action = req.body.action;
	 var instructions = req.body.instruction;
	// 	//console.log("-----fileId: " + fileId);
	 	console.log("-----image: " + image);
	 	console.log("-----action: " + action);
	 	console.log("-----instructions: " + instructions);

	res.json({
		"test": "OK",
		"id": req.params.id
	});
});





// this is the api that gets called to process the request
router.post('/api/v1.0/process', function(req, res, next) {

	res.header("Access-Control-Allow-Origin", "*");

	
	var fs = require("fs");
	var request = require("request");
	var path = require("path");
	var dateFormat = require('dateformat');

	var fileName = "workOrder_" + dateFormat(new Date(), "yyyy-mm-dd_hMMss.png");
	//var primaryFile = path.join(__dirname, '../public/images', fileName);
	var imageBuffer = decodeBase64Image(req.body.image);
	var action = req.body.action;
	var instructions = req.body.instruction;

	var options = { method: 'POST',
	  url: 'https://asaservice-innovation.documents.us2.oraclecloud.com/documents/api/1.1/files/data',
	  headers: 
	   { 
	     'cache-control': 'no-cache',
	     accept: 'application/json',
	     authorization: '',
	     'content-type': 'multipart/form-data; boundary=---011000010111000001101001' },
	  formData: 
	   { jsonInputParameters: '{ "parentID":"FFEC17184CD7A6684F478F8A56AB69D1288BDABAADAF" }',
	     metadataValues: '{ "collection ": "WorkOrderCustomMetadata",  "xAction ": "cleanUp",  "xActionInstructions ": "Please clean the carpet"}',
	     primaryFile: 
	      { value: imageBuffer.data,
	        options: { filename: fileName, contentType: 'image/jpeg' } } } };

	

	request(options, function (error, response, body) {
		if (error) throw new Error(error);
		//var fileId = (JSON.parse(body)).id;
		var fileId = "https://asaservice-innovation.documents.us2.oraclecloud.com/documents/file/" + JSON.parse(body).id;

		console.log("-----fileId: " + fileId);
		console.log("-----filename: " + fileName);
		console.log("-----action: " + action);
		console.log("-----instructions: " + instructions);

		var options = { method: 'POST',
  		  url: 'https://process-innovation.process.us2.oraclecloud.com/bpm/api/3.0/processes',
		  headers: 
		   { 'postman-token': 'ae8c00e6-a12a-5fc2-e17e-eecff5e41545',
		     'cache-control': 'no-cache',
		     'content-type': 'application/json',
		     accept: 'application/json',
		     authorization: '' },
		  		  body: 
		   { processDefId: 'default~ColourWorkOrdersApp!!1.1~ProcessOrder',
		     serviceName: 'ProcessOrder.service',
		     operation: 'start',
		     payload: '<OrderBO xmlns=\'http://xmlns.oracle.com/bpm/bpmobject/BusinessData/OrderBO\'><action>'+action+'</action><instructions>'+instructions+'</instructions><fileId>'+fileId+'</fileId></OrderBO>',
		     action: 'Submit' },
		  json: true };

		request(options, function (error, response, body) {
		  if (error) throw new Error(error);

		  console.log(body);
		});
	  
	});


/*
	console.log("Start Request ----------------");
	console.log("--Action: "+action);
	console.log("--Instructions: "+ instruction);
	console.log("--Image : "+ primaryFile);
	console.log("End  Request ----------------");
*/	

});


module.exports = router;
