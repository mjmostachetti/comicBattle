$(document).ready(function(){

	//define the character model

	var Character = Backbone.Model.extend({
		defaults : function(){
			return {
				name : "",
				energy : 0,
				strength : 0,
				magic : 0
			}
		}
	})

	var CharacterCollection = Backbone.Collection.extend({
		model: Character,
		url: '/characters'
	})

	var characterList = new CharacterCollection;

	var CharacterView = Backbone.View.extend({
		template: _.template($(#character-info).html()),
		render : function(){
			this.$el.html(this.template(this.model))
		}
	})



	var MainAppView = Backbone.View.extend({
		el: $('#comicapp'),
		initialize: function(){
			characterList.fetch()
		}
	})

	var App = new MainAppView;

})