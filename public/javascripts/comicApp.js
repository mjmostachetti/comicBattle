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
    url: '/api/characters'
  })

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

  // end of test logic

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
      this.$el.html(this.template)
    },
    findNextChar: function() {
      var leftCharacter
      var rightCharacter
      for (var i = 0; i < leftTeam.models.length; i++) {
        if (leftTeam.models[i].get("ko") != true) {
          leftCharacter = leftTeam.models[i]
        } else {
          rightTeam.win()
        }
      }
      for (var j = 0; j < rightTeam.models.length; j++) {
        if (rightTeam.models[j].get("ko") != true) {
          rightCharacter = rightTeam.models[j]
        } else {
          leftTeam.win()
        }
      }
      this.fight(leftCharacter, rightCharacter)
      this.findNextChar()
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
      "click #findNextChar": "findNextChar",
      //"click #fight": "fight"
    }
  })

  var characterList = new CharacterCollection()
  var userList = new UserCollection()

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
    //collection: CharacterCollection,
    el: "#charZone",
    template: _.template($("#template-characterSelect").html()),
    //call render somewhere else
    initialize: function() {
      this.render();
    },
    render: function() {
      console.log('rendering');
      //this.$el.html('<table id="chargrid"></table>');
      var html = '<table id="chargrid"><tr>';
      //var width isnt being used, should replace 4 in if function
      var width = 4;
      var i = 0;
      this.collection.each(function(model) {
        if (i % 4 === 0 && i !== 0) {
          html = html + '</tr><tr>';
        }
        var characterView = new CharacterView({
          model: model
        });
        characterView.render();
        html = html + characterView.$el.html();
        i++;
      })
      html = html + '</tr></table>';
      this.$el.html(html);
    }
  })

  var CharacterView = Backbone.View.extend({
    tagName: "div",
    className: "character-view",
    model: Character,
    //call render at some point
    render: function() {
      var template = _.template(
        '<td class="character" data-character-id="<%-id%>"><img src="<%-image%>"></td>'
      );
      this.$el.html(template({
        id: this.model.id,
        image: this.model.get('image').thumb_url
      }));
      return this;
    }
  })

  var MainAppView = Backbone.View.extend({
    //div in index.jade
    //el: $('#container'),
    el: $('#comicapp'),

    events: {
      "click #loadSignup": "loadSignup",
      "click #loadLogin": "loadLogin",
      //"click #loginButton": "loadCharacterSelection",
      //"click #loginButton" : "loadCharView",
      "click .character": "selectCharacter",
      "click #loginButton": "loadFightScreen",
      //"click #fightButton": "loadFightScreen"
    },
    selectCharacter: function selectCharacter(evt) {
      var characterData = $(evt.currentTarget).data();
      alert("Clicked " + characterData.characterId);
    },
    //main app view initializes loginView, creates a div, and then loads the view.
    initialize: function() {
      this.setCurrentView(new LoginView())
        //characterList.fetch()
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
    loadCharView: function(event) {
      //TODO(justin): this is really nasty and should probably occur outside this function
      event.preventDefault()
        //creates character collection
      var characterCol = new CharacterCollection()
        //calls the collection using index.js router.get /api/characters. async:false to prevent render until it gets all the info.
      characterCol.fetch({
          async: false
        })
        //creates charactersview with collection
      this.setCurrentView(new CharactersView({
          collection: characterCol
        }))
        //console.log("the character selection loaded")
    },
    setCurrentView: function(newView) {
      if (this.currentView) this.currentView.remove()
      this.currentView = newView
      this.$el.html(newView.$el)
    }
  })
  var App = new MainAppView();
})
