
function(){

    //define the character model
    var Character = Backbone.Model.extend({
        defaults : {
                name : "",
                energy : 0,
                strength : 0,
                magic : 0,
                deck : "",
                image: ""
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
    // currently not working. Console flips out about the #character-info
    // var CharacterView = Backbone.View.extend({
    //     tagName: "div",
    //     className: "character"
    //     template: _.template($("#character-info").html()),
    //     render : function(){
    //       this.$el.html(this.template(this.model))
    //     },
    //     initialize : function() {
    //       this.render()
    //     }
    // })

    var viewArray = [];

    //creating a view for login
    //view creates a div with a tag name to house html
    //elements in the jade template
    var LoginView = Backbone.View.extend({
        tagName : "div",
        className : "login-view",
        template : _.template($("#template-login").html()),

        initialize: function(){
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

    var CharacterView = Backbone.View.extend({
    	tagName : "div",
    	className : "characterSelect-view",
    	template : _.template($("#template-characterSelect").html()),

    	initialize: function(){
        this.listenTo(this.collection, 'add', this.addView);
        console.log(this.$el)
    		this.render()
    	},
    	render: function(){
    		this.$el.html(this.template)
    	},
      addModel : function () {
        this.collection.add({});
      },
      addView : function(){
        var view = new CharacterView({model : newModel})
        this.render()
      },
    })

    var MainAppView = Backbone.View.extend({
        //div in index.jade
        //el: $('#container'),
        el: $('#comicapp'),

        events : {

            "click .addChar" : "addCharacterToUserAccount",

            "click #loadSignup" : "loadSignup",
            "click #loadLogin" : "loadLogin",
            "click #loginButton" : "loadCharacterSelection"


        },
        //main app view initializes loginView, creates a div, and then loads the view.
        initialize: function(){
            this.$el.html('<div id="loginForm"></div>')
            this.currentView = new LoginView()
            this.$el.html(this.currentView.$el)
            // listen to the characterList collection, when a model is added, run this.addCharacter
            this.listenTo(characterList, 'add', this.addCharacter)
            characterList.fetch()
        },
        //handles loading the login view and html elements
        loadLogin : function(){
          this.currentView.$el.remove()
          this.currentView.remove()
          this.currentView = new LoginView()
          this.$el.html(this.currentView.$el)
        },
        //uses Signup ctor to create SignupView
        loadSignup : function(){
          this.currentView.$el.remove()
          this.currentView.remove()
          this.currentView = new SignupView()
          this.$el.html(this.currentView.$el)
        },
          loadCharacterSelection : function(){
            this.currentView.$el.remove()
            this.currentView.remove()
          	this.currentView = new CharacterView()
          	this.$el.html(this.currentView.$el)
            console.log("the character selection loaded")
          },
        addCharacter : function(character){
            //create new view for this character
            console.log(character)
            var view = new CharacterView({ model : character })
            //push the view into array for removal later
            viewArray.push(view)
            console.log("This is an array of views : " + view)
            this.render()
            this.$("#characters-list").append(view.$el);
        },
        addCharacterToUserAccount : function(){
            console.log("run")
        }
    })

    var App = new MainAppView();

}
