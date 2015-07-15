var express = require('express');
var router = express.Router();
var db = require('orchestrate')('5504b916-9df4-4a5c-9d58-c2da0c4f06f8');
var pass = require('pwd');
var characterIDs = require('../characterID')
var http = require('http')
var characterIDs = require('../characterID');



/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Comic Rock Paper Scissors' });
});
console.log("index.js is running");

router.get('/teams', function(req, res, next){
		res.render('select', { title: 'Select Yo Teams' });
});

router.post('/signup', function(request,response){
	console.log("youve signed up");

	// request.body is an object that contains all of the information
	// that was passed to the backend via the form on the frontend

	var username = request.body.username;
	var password = request.body.password;
	var userSalt = "";
	var userHash = "";
	//check if username already in the database
	db.search('userData', 'value.username: ' + username)
	.then(function(result){
		if(result.body.count === 1){
			response.render('index', {message:'User already exists.'});
		}
		//user doesn't exist, add it!
		else {
			db.search('userData','*').then(function(resp){
				var userTotal = resp.body.count + 1;
				pass.hash(password, function (err, salt, hash){
					userSalt = salt;
					userHash = hash;
					db.post('userData',{
					"id" : userTotal,
					"username" : username,
					"salt" : 	userSalt,
					"hash" :  userHash,
					"win" :  0,
					"loss" :  0,
					"hero1" : "",
					"hero2" :  "",
					"hero3" :  ""
					}).then(function(){
					response.render('index',{message : "You just registered!"})
				})
			})
			})
		}
	})
})

router.post('/login', function(request,response){
	var username = request.body.username
	var password = request.body.password
	db.search('userData', 'value.username: ' + username)
	.then(function(resp){
		var userHash = resp.body.results[0].value.hash
		var userSalt = resp.body.results[0].value.salt
		pass.hash(password,userSalt,function (err,hash){
			if(userHash === hash){
				console.log("we done logged in");
				response.render('main', { username : resp.body.results[0].value.username})
			}else{
				response.render('index', { message: 'Incorrect info, give it another go.'});
			}
		})
	})
})

/*
 * This function is used to fill out our database!
 */
router.get('/fillOut', function(request,response){
	console.log("This is an array of the character IDs : ")
	console.log(characterIDs)
	characterIDs.forEach(function(item){
		http.get('http://www.comicvine.com/api/character/' +
			'4005-'+item.id+'/?api_key=f6539c8aca297ac9f221c04eb1d0fa3937e02354&' +
			'field_list=name,image,powers,id&format=json',
			function(res){
				var writeToThis = '';
				res.on('data', function (chunk) {
					writeToThis += chunk
				});
				res.on('end', function(){
					var charJSON = JSON.parse(writeToThis)
					console.log(charJSON)
				})
		})
	})
})

// api call for the CharactersCollection
router.get('/api/characters', function(request,response){
	console.log("This is an array of the character IDs : ")
	//console.log(characterIDs)
	var counter = 0;
	var arrayOfCharacterObjs = []
	// for each index in the characterID.js array, hit the api for the name, image,powers,id
	// when all the data is sent back, push to the arrayOfCharacterObjs array
	// since this is async, we need a counter to actually tell us when these things finish
	// when the counter === characterIDs.length, send JSON to the frontend and backbone
	// will render the proper views!
	characterIDs.forEach(function(item){
		http.get('http://www.comicvine.com/api/character/' +
			'4005-'+item.id+'/?api_key=f6539c8aca297ac9f221c04eb1d0fa3937e02354&' +
			'field_list=name,image,powers,deck,id&format=json',
			function(res){
				var writeToThis = '';
				res.on('data', function (chunk) {
					writeToThis += chunk
				});
				res.on('end', function(){
					var charJSON = JSON.parse(writeToThis)
					//console.log(charJSON.results)
					var resultsJSON = charJSON.results
					counter++;
					//console.log("The counter is now: " + counter)
					//console.log("When the counter is: " + characterIDs.length + ", return JSON of all characters.")
					arrayOfCharacterObjs.push(resultsJSON)
					if(counter === characterIDs.length){
						response.json(arrayOfCharacterObjs)
					}
				})
		})

	})
})


//define api 'GET' request to return all the users
router.get('/users')

module.exports = router;
