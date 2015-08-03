var express = require('express');
var router = express.Router();
var db = require('orchestrate')('5504b916-9df4-4a5c-9d58-c2da0c4f06f8');
var pass = require('pwd');
var characterIDs = require('../characterID.js');
var http = require('http');


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
	console.log("index.js is running");
});

//router.get('/teams', function(req, res, next){
//res.render('select', { title: 'Select Yo Teams' });
//});

router.post('components/signup', function(request, response) {
	console.log("youve signed up");
	res.render('index', {
		title: 'Comic Rock Paper Scissors'
	});
});

router.get('/teams', function(req, res, next) {
	res.render('select', {
		title: 'Select Yo Teams'
	});
});

router.post('/signup', function(request, response) {

	// request.body is an object that contains all of the information
	// that was passed to the backend via the form on the frontend

	var username = request.body.username;
	var password = request.body.password;
	var userSalt = "";
	var userHash = "";
	//check if username already in the database
	//TODO(justin): use db.get instead and have a separate .then fn for 404
	db.search('userData', 'value.username: ' + username)
		.then(function(result) {
			if (result.body.count === 1) {
				response.render('index', {
					message: 'User already exists.'
				});
			}
			//user doesn't exist, add it!
			else {
				db.search('userData', '*').then(function(resp) {
					var userTotal = resp.body.total_count + 1;
					pass.hash(password, function(err, salt, hash) {
						userSalt = salt;
						userHash = hash;
						db.post('userData', {
							"id": userTotal,
							"username": username,
							"salt": userSalt,
							"hash": userHash,
							"win": 0,
							"loss": 0,
							"draw" : 0,
							"hero1": "",
							"hero2": "",
							"hero3": "",
							"heroName1": "",
							"heroName2" : "",
							"heroName3" : ""
						}).then(function() {
							response.render('index', {
								message: "You just registered!"
							});
						});
					});
				});
			}
		});
});

router.post('/index', function(request, response) {
	console.log("Receiving a Post request.")
	var username = request.body.username;
	var password = request.body.password;
	db.search('userData', 'value.username: ' + username)
		.then(function(resp) {
			console.log(resp.body.results.length)
			console.log(resp.body.results)
			if(resp.body.results.length === 0){
				response.render('index',{
					message:'Incorrect info. Please try again.'
				})
			}
			var userHash = resp.body.results[0].value.hash;
			var userSalt = resp.body.results[0].value.salt;
			pass.hash(password, userSalt, function(err, hash) {
				if (userHash === hash) {
					console.log('logged in');
					response.cookie('name',username)
					console.log(typeof resp.body.results)
					console.log(typeof resp)
					console.log(resp.body.results[0].value)
					response.render('index', {
						data : resp.body.results[0].value
					})
				} else {
					response.render('index', {
						message: 'Incorrect info. Please try again.'
					});
				}
			});
		});
	//response.render('main')
});

/*
 * This function is used to fill out our database!
 */

// another api key:72e9a1878dcfdf40e3c1db8d52883e44a5ef37ba
// api key: f6539c8aca297ac9f221c04eb1d0fa3937e02354

// api call for the CharactersCollection
router.get('/api/characters', function(request, response) {
	console.log("This is an array of the character IDs : ");
	//console.log(characterIDs)
	var counter = 0;
	var arrayOfCharacterObjs = [];
	// for each index in the characterID.js array, hit the api for the name, image,powers,id
	// when all the data is sent back, push to the arrayOfCharacterObjs array
	// since this is async, we need a counter to actually tell us when these things finish
	// when the counter === characterIDs.length, send JSON to the frontend and backbone
	// will render the proper views!
	characterIDs.forEach(function(item) {
		http.get('http://www.comicvine.com/api/character/' +
			'4005-' + item.id +
			'/?api_key=72e9a1878dcfdf40e3c1db8d52883e44a5ef37ba&' +
			'field_list=name,image,powers,deck,id&format=json',
			function(res) {
				var writeToThis = '';
				res.on('data', function(chunk) {
					writeToThis += chunk;
				});
				res.on('end', function() {
					var charJSON = JSON.parse(writeToThis);
					//console.log(charJSON.results)
					var resultsJSON = charJSON.results;
					counter++;
					//console.log("The counter is now: " + counter)
					//console.log("When the counter is: " + characterIDs.length + ", return JSON of all characters.")
					arrayOfCharacterObjs.push(resultsJSON);
					if (counter === characterIDs.length) {
						console.log(arrayOfCharacterObjs)
						response.json(arrayOfCharacterObjs);
					}
				});
			});

	});
});


//define api 'GET' request to return all the users
router.get('/api/users', function(request,response){
	db.search('userData', '*').then(function(resp){
		console.log("This is all of the userData :")
		console.log(resp.body.results)
		var userArray = []
		resp.body.results.forEach(function(item){
			console.log(item.value)
			var charObj = item.value
			charObj.key = item.path.key
			userArray.push(charObj)
		})
		response.json(userArray)
	})
});

router.get('/api/users/:id', function(request,response){
	var userID = parseInt(request.params.id,10)
	console.log(userID)
	console.log(typeof userID)
	db.search('userData','value.id:' + userID).then(function(resp){
	  console.log(resp.body)
	  console.log(resp.body.path.key)
	})
});

module.exports = router;
