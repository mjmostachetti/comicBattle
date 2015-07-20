$(document).ready(function(){

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
        //url: '/fillOut'
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
    //works, sorta. Not sure this is doing what I want
    var CharacterView = Backbone.View.extend({
        tagName: "div",
        className: "character",
        template: _.template($("#character-info").html()),
        render : function(){
          this.$el.html(this.template(this.model))
        },
        initialize : function() {
          this.render()
        }
    })

    var viewArray = [];

    //creating a view for login
    //view creates a div with a tag name to house html
    //elements in the jade template
    var LoginView = Backbone.View.extend({
        tagName : "div",
        className : "login-view",
        template : _.template($("#template-login").html()),

        initialize: function(){
            //console.log(this.$el);
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

    // var CharacterView = Backbone.View.extend({
    //  tagName : "div",
    //  className : "characterSelect-view",
    //  template : _.template($("#template-characterSelect").html()),
    //   addCharacter : function(character){
    //     //create new view for this character
    //     //console.log(character)
    //     var view = new CharacterView({ model : character })
    //     //push the view into array for removal later
    //     viewArray.push(view)
    //     //console.log("This is an array of views : " + view)
    //     this.$("#characters-list").append(view.$el);
    //   },
    //  initialize: function(){
    //     var that = this
    //     this.listenTo(this.collection, 'add', this.addView);
    //     //console.log(this.$el)
    //     characterList.fetch({success: function(charData) {
    //          that.render()
    //       console.log(charData)
    //     }})
    //  },
    //  render: function(){
    //      this.$el.html(this.template)
    //  },
    //   addModel : function () {
    //     this.collection.add({});
    //   },
    //   addView : function(){
    //     var view = new CharacterView({model : newModel})
    //     this.render()
    //   },
    //   addCharacterToUserAccount : function(){
    //       //console.log("run")
    //   }
    // })

    var CharactersView = Backbone.View.extend({
    collection: CharacterCollection,
    el: "#characters",
    intialize: function(){
      this.render();
    },
    render: function(){
      this.$el.html('<table id="chargrid"></table>');
      this.collection.each(function(model){
        new CharacterView({model: model});
      });
    },
    events: {
      "click .character": "selectCharacter"
    },
    selectCharacter: function selectCharacter(evt) {
      var characterData = $(evt.currentTarget).data();
      alert("Clicked " + characterData.characterId);
    }
  })

  var CharacterView = Backbone.View.extend({
        tagName : "div",
        className : "characterSelect-view",
        template : _.template($("#template-characterSelect").html()),
    model: Character,
    intialize: function(){
      this.render();
    },
    render: function(){
      var template = _.template('<td class="character" data-character-id="<%-id%>"><%-name%></td>');
      this.$el.html(template({id: this.model.id, name: this.model.name}));
      return this;
      $('#chargrid').append(template);
    }
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
          this.setCurrentView(new LoginView())
          // listen to the characterList collection, when a model is added, run this.addCharacter
          this.listenTo(characterList, 'add', this.addCharacter)
        },
        //handles loading the login view and html elements
        loadLogin : function() {
          this.setCurrentView(new LoginView())
        },
        //uses Signup ctor to create SignupView
        loadSignup : function() {
          this.setCurrentView(new SignupView())
        },
        loadCharacterSelection : function(event) {
          event.preventDefault()
          this.setCurrentView(new CharacterView())
          //console.log("the character selection loaded")
        },
        setCurrentView : function(newView) {
          if (this.currentView) this.currentView.remove()
          this.currentView = newView
          this.$el.html(newView.$el)
        }
    })

    var App = new MainAppView();

})
