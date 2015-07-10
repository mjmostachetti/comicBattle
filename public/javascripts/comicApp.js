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

	var CharacterView = Backbone.View.extend({
		tagName: 'li',
		template: _.template($('#character-info').html()),
		render : function(){
			this.$el.html(this.template(this.model))
		}
	})

	var viewArray = [];

	//creating a view for login
	var LoginView = Backbone.View.extend({
		el: $(),

	})

	var MainAppView = Backbone.View.extend({
		el: $('#comicapp'),
		initialize: function(){
			// listen to the characterList collection, when a model is added, run this.addCharacter
			this.listenTo(characterList, 'add', this.addCharacter)
			characterList.fetch()
		},
		addCharacter : function(character){
			//create new view for this musician
			console.log(character)
			var view = new CharacterView({ model : character })
			//push the view into array for removal later
			viewArray.push(view)
			console.log("This is an array of views : " + view)
      view.render()
			this.$("#characters-list").append(view.$el);
		}
	})

	var App = new MainAppView;

})
