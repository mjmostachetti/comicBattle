var express = require('express');
var router = express.Router();
var db = require('orchestrate')('5504b916-9df4-4a5c-9d58-c2da0c4f06f8')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to Comic Rock Paper Sciccors' });
});

router.post('/signup', function(request,response){
	var username = request.body.username
	var password = request.body.password
	db.post('userData',{
		
	})
})

module.exports = router;
