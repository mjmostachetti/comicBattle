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

	var CharacterView = Backbone.View.extend({
		
	})

})