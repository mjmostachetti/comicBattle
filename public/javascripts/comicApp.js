$(document).ready(function(){

	//define the character model

	var Character = Backbone.Model.extend({
		defaults : {
				name : "",
				energy : 0,
				strength : 0,
				magic : 0,
				deck : ""
			}
	})

	var CharacterCollection = Backbone.Collection.extend({
		model: Character,
		url: '/api/characters'
	})

	var User = Backbone.Model.extend({
		defaults : {
				id : 0,
				username : '',
				win : 0,
				loss : 0,
				hero1 : '',
				hero2 : '',
				hero3 : ''
			}
	})

	var UserCollection = Backbone.Collection.extend({
		model : User,
		url: '/users'
	})

	var characterList = new CharacterCollection;

	// var CharacterView = Backbone.View.extend({
	// 	tagName: 'li',
	// 	template: _.template($('#character-info').html()),
	// 	render : function(){
	// 		this.$el.html(this.template(this.model))
	// 	}
	// })

	// var viewArray = [];

	/* creating a view for login
	view creates a div with a tag name to house html
	elements in the jade template */
	var LoginView = Backbone.View.extend({
		tagName : "div",
		className : "login-view",
		template : _.template($("#template-login").html()),

		initialize: function(){
			this.$el.html('<h1> Login / Signup </h1> <h1> Username : </h1> <input id="username" name="username" type="text"> <h1> Password : </h1>  <input id="password" name="password" type="password"> <br><br> <input id="loginButton" type="submit" value="Login"><input id="signupButton" type="submit" value="Signup">')
			console.log(this.$el)
			console.log(this.$el);
			this.render()
		},

		render: function(){
			this.$el.html(this.template)
		}
	})

	var SignupView = Backbone.View.extend({
		tagName : "div",
		className : "signup-view",
		template : _.template($("#template-signup").html()),

		initialize: function(){
			this.render()
		},

		render: function(){
			this.$el.html(this.template)
		}
	})
	var MainAppView = Backbone.View.extend({
		//div in index.jade
<<<<<<< HEAD
		el: $('#container'),
		// el: $('#comicapp'),
		events : {
			"click .addChar" : "addCharacterToUserAccount"
		},
=======
		//el: $('#container'),
		el: $('#comicapp'),

>>>>>>> 7eb098334940f916588e44d8b544f1790f21be91
		events : {
			"click .signup" : "loadSignup",
			"click .addChar" : "addCharacterToUserAccount"
		},
		//main app view initializes loginView, creates a div, and then loads the view.
		initialize: function(){
			this.$el.html('<div id="loginForm"></div>')
			console.log("things are happening")
			// listen to the characterList collection, when a model is added, run this.addCharacter
			this.loadLogin();
			this.listenTo(characterList, 'add', this.addCharacter)
			characterList.fetch()
		},
		//handles loading the login view and html elements
		loadLogin : function(){
			var view = new LoginView()
			this.$el.html(view.$el)
		},
		//uses Signup ctor to create SignupView
		loadSignup : function(){
			var view = new SignupView()
			this.$el.html(view.$el)
		},
		addCharacter : function(character){
			//create new view for this musician
			console.log(character)
			//var view = new CharacterView({ model : character })
			//push the view into array for removal later
			//viewArray.push(view)
			// console.log("This is an array of views : " + view)
	 //    view.render()
			//this.$("#characters-list").append(view.$el);
		},
		addCharacterToUserAccount : function(){
			console.log("run")
		}
	})

	var App = new MainAppView();

})
