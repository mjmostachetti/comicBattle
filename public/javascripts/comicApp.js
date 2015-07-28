


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
    // var CharacterView = Backbone.View.extend({
    //     tagName: "div",
    //     className: "character",
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
            //console.log(this.$el);
            this.render()
        },

        render: function(){
            this.$el.html(this.template)
        }
    })

$(document).ready(function() {

  //define the character model
  var Character = Backbone.Model.extend({
    defaults: {
      ko: false,
      name: "",
      type: "",
      deck: "",
      image: ""
    },
    //  setting the type of superpower to the hero
    attribute: function() {
      if (this.get("name") === "batman" || this.get("name") ===
        "daredevil" || this
        .get("name") === "hulk" || this.get("name") === "joker") {
        this.set("type", "strength")
      } else if (this.get("name") === "superman" || this.get("name") ===
        "spider-man" || this.get("name") === "cyclops" ||
        this.get("name") === "carnage") {
        this.set("type", "energy")
      } else {
        this.set("type", "magic")
      }
    }
  })

  var CharacterCollection = Backbone.Collection.extend({
    model: Character,
    //url: '/fillOut'
    url: '/api/characters'
  })

  //two mock character teams
  var leftTeam = new CharacterCollection()
  var rightTeam = new CharacterCollection()

  // start of test data for testing fight logic
  var batman = new Character()
  batman.set({
    name: "batman"
  })
  batman.attribute()

  var carnage = new Character()
  carnage.set({
    name: "carnage"
  })
  carnage.attribute()

  var superman = new Character()
  superman.set({
    name: "superman"
  })
  superman.attribute()

  var cyclops = new Character()
  cyclops.set({
    name: "cyclops"
  })
  cyclops.attribute()

  var shazaam = new Character()
  shazaam.set({
    name: "billy-batson"
  })
  shazaam.attribute()

  var martianManhunter = new Character()
  martianManhunter.set({
    name: "martian-manhunter"
  })
  martianManhunter.attribute()

  leftTeam.add([batman, carnage, superman])
  rightTeam.add([cyclops, shazaam, martianManhunter])

  leftCharacter = leftTeam.first()
  rightCharacter = rightTeam.first()

  console.log(leftCharacter)
  console.log(rightCharacter)

  console.log(leftTeam)
  console.log(rightTeam)
    // end of test logic

  var RoundModel = Backbone.Model.extend({
    initialize: function() {
      leftCharacter = leftTeam.first()
      rightCharacter = rightTeam.first()
    }
  })

  var MatchModel = Backbone.Model.extend({
    defaults: {
      rounds: []
    }
  })

  var match = new MatchModel({
    rounds: [
      new RoundModel({
        leftCharacter: leftTeam.first(),
        rightCharacter: rightTeam.first()
      }),
      new RoundModel({
        leftCharacter: leftTeam.get(),
        rightCharacter: rightTeam.get()
      }),
      new RoundModel({
        leftCharacter: leftTeam.get("c3"),
        rightCharacter: rightTeam.get("c6")
      }),
    ]
  })


  var User = Backbone.Model.extend({
    defaults: {
      id: 0,
      username: '',
      win: 0,
      loss: 0,
      hero1: '',
      hero2: '',
      hero3: ''
    }
  })

  var UserCollection = Backbone.Collection.extend({
    model: User,
    url: '/users'
  })

  var FightView = Backbone.View.extend({
    tagName: "div",
    className: "fight-view",
    template: _.template($("#fight-view").html()),
    initialize: function() {
      this.render()
    },
    render: function() {
      console.log(this.el)
      this.$el.html(this.template)
      var roundView = new RoundView()
    },
    findNextChar: function() {
      var leftCharacter
      var rightCharacter
      for (var i = 0; i <= leftTeam.models.length; i++) {
        if ("ko" != true) {
          return (leftCharacter)
        }
      }
    },
    events: {
      "click #fight": "findNextChar"
    }
  })

  var RoundView = Backbone.View.extend({
    tagName: "div",
    className: "round-view",
    initialize: function() {
      this.render()
    },
    render: function() {
      this.$el.html()
    },
    fight: function(leftCharacter, rightCharacter) {
      console.log(rightCharacter.get("type"))
      if (leftCharacter.get("type") === rightCharacter.get("type")) {
        console.log("Draw")
        leftCharacter.set("ko", true)
        rightCharacter.set("ko", true)
      } else if (leftCharacter.get("type") === "strength" &&
        rightCharacter.get("type") ===
        "energy") {
        console.log(leftCharacter.get("name") + " wins!")
        rightCharacter.set("ko", true)
      } else if (leftCharacter.get("type") === "strength" &&
        rightCharacter.get("type") ===
        "magic") {
        console.log(rightCharacter.get("name") + " wins!")
        leftCharacter.set("ko", true)
      } else if (leftCharacter.get("type") === "energy" &&
        rightCharacter.get("type") ===
        "strength") {
        console.log(rightCharacter.get("name") + " wins!")
        leftCharacter.set("ko", true)
      } else if (leftCharacter.get("type") === "energy" &&
        rightCharacter.get("type") ===
        "magic") {
        console.log(leftCharacter.get("name") + " wins!")
        rightCharacter.set("ko", true)
      } else {
        console.log(leftCharacter.get("name") + " wins!")
        rightCharacter.set("ko", true)
      }
      console.log(rightCharacter)
      console.log(leftCharacter)
    },
    events: {
      "click #fight": "fight"
    }
  })

  var characterList = new CharacterCollection();

  //creating a view for login
  //view creates a div with a tag name to house html
  //elements in the jade template
  var LoginView = Backbone.View.extend({
    tagName: "div",
    className: "login-view",
    template: _.template($("#template-login").html()),

    initialize: function() {
      //console.log(this.$el);
      this.render()
    },

    render: function() {
      this.$el.html(this.template)
    }
  })

  var SignupView = Backbone.View.extend({
    tagName: "div",
    className: "signup-view",
    template: _.template($("#template-signup").html()),

    initialize: function() {
      this.render()
    },

    render: function() {
      this.$el.html(this.template)
    }
  })

  var CharactersView = Backbone.View.extend({
    collection: CharacterCollection,
    el: "#characters",
    intialize: function() {
      this.render();
    },
    render: function() {
      this.$el.html('<table id="chargrid"></table>');
      this.collection.each(function(model) {
        new CharacterView({
          model: model
        });
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
    tagName: "div",
    className: "characterSelect-view",
    //  _.template($("#template-characterSelect").html()),
    model: Character,
    intialize: function() {
      this.render();
    },
    render: function() {
      var template = _.template(
        '<td class="character" data-character-id="<%-id%>"><%-name%></td>'
      );
      this.$el.html(template({
        id: this.model.id,
        name: this.model.name
      }));
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
          console.log(characterList);
          //console.log("the character selection loaded")
        },
        setCurrentView : function(newView) {
          if (this.currentView) this.currentView.remove()
          this.currentView = newView
          this.$el.html(newView.$el)
        }
    })
    var App = new MainAppView();

  var MainAppView = Backbone.View.extend({
    //div in index.jade
    //el: $('#container'),
    el: $('#comicapp'),

    events: {
      "click .addChar": "addCharacterToUserAccount",
      "click #loadSignup": "loadSignup",
      "click #loadLogin": "loadLogin",
      "click #loginButton": "loadCharacterSelection",
      //"click #loginButton": "loadFightScreen",
      //"click #fightButton": "loadFightScreen"
    },
    //main app view initializes loginView, creates a div, and then loads the view.
    initialize: function() {
      this.setCurrentView(new LoginView())
        // listen to the characterList collection, when a model is added, run this.addCharacter
      this.listenTo(characterList, 'add', this.addCharacter)
    },
    //handles loading the login view and html elements
    loadLogin: function() {
      this.setCurrentView(new LoginView())
    },
    //uses Signup ctor to create SignupView
    loadSignup: function() {
      this.setCurrentView(new SignupView())
    },
    loadCharacterSelection: function(event) {
      event.preventDefault()
      this.setCurrentView(new CharacterView())
      console.log(characterList);
      //console.log("the character selection loaded")
    },
    loadFightScreen: function(event) {
      event.preventDefault()
      this.setCurrentView(new FightView())
    },
    setCurrentView: function(newView) {
      if (this.currentView) this.currentView.remove()
      this.currentView = newView
      this.$el.html(newView.$el)
    }
  })
  var App = new MainAppView();
})
