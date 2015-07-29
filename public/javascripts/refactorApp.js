var leftTeam, characterList;

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

  var User = Backbone.Model.extend({
    defaults: {
      id: 0,
      username: '',
      win: 0,
      loss: 0,
      hero1: 0,
      hero2: 0,
      hero3: 0,
      hero4: 0,
      hero5: 0,
      hero6: 0,
      heroName1: '',
      heroName2: '',
      heroName3: '',
      heroName4: '',
      heroName5: '',
      heroName6: '',
      heroNum: 0
    }
  })

  var UserView = Backbone.View.extend({
    el: "#userInfo",
    template: _.template(
      '<h2>Team 1</h2>' +
      '<img src=<%=hero1%>>' +
      '<img src=<%=hero2%>>' +
      '<img src=<%=hero3%>> <br>' +
      '<h2>Team 2</h2>' +
      '<img src=<%=hero4%>>' +
      '<img src=<%=hero5%>>' +
      '<img src=<%=hero6%>>' ),
    initialize: function(){
      this.listenTo(this.model,'change',this.countHeroes)
      this.listenTo(this.model,'change',this.render)
      this.render();
    },
    render: function(){
      this.$el.html(this.template(this.model.attributes))
    },
    countHeroes : function(model){
      var count = 0;
      for(var x = 1; x <= 6;x++){
        if(model.attributes['hero' + x] !== 0){
          count++;
        }
      }
      model.set('heroNum',count)
      console.log(model)
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
          console.log(leftCharacter)
        } else {
          rightTeam.win()
        }
      }
      for (var j = 0; j < rightTeam.models.length; j++) {
        if (rightTeam.models[j].get("ko") != true) {
          rightCharacter = rightTeam.models[j]
          console.log(rightCharacter)
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
      "click #findNextChar": "findNextChar"
    }
  })

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
      initialize: function(){
          this.render();
      },
      render: function(){
        console.log('rendering');
        //this.$el.html('<table id="chargrid"></table>');
        var html = '<table id="chargrid"><tr>';
        //var width isnt being used, should replace 4 in if function
        var width = 4;
        var i = 0;
        this.collection.each(function(model){
          if (i % 4 === 0 && i !== 0){
            html = html + '</tr><tr>';
          }
          var characterView = new CharacterView({model: model});
          characterView.render();
          html = html + characterView.$el.html();
          i++;
        })
        html = html + '</tr></table>';
        html = html + "<button id='removeCharacter'>Remove Character</button>"
        this.$el.html(html);
      }
    })

    var CharacterView = Backbone.View.extend({
      tagName : "div",
      className : "character-view",
      model: Character,
      //call render at some point
      render: function(){
        console.log(this.model)
        var template = _.template('<td class="character"' +
          'data-character-id="<%-id%>"' +
          'data-character-img="<%-image%>"' +
          'data-character-name="<%-name%>"' +
          '><img src="<%-image%>"></td>');
        this.$el.html(template({
          id: this.model.id, 
          image: this.model.get('image').thumb_url,
          name: this.model.attributes.name
        }));
        return this;
      }
    })

  characterList = new CharacterCollection;

  var MainAppView = Backbone.View.extend({
    //div in index.jade
    //el: $('#container'),
    el: $('#comicapp'),

    events: {
      "click #loadSignup": "loadSignup",
      "click #loadLogin": "loadLogin",
      "click #loginButton" : "loadCharView",
      "click .character": "selectCharacter",
      "click #removeCharacter" : "removeCharacterFromTeam",
      //"click #loginButton": "loadFightScreen",
      "click #fightButton": "loadFightScreen"
    },
    removeCharacterFromTeam: function(){
      for(var x = 6; x >= 1; x--){
        if(this.newUser.get("hero" + x) !== 0){
          this.newUser.set("hero" + x,0)
          return;
        }
      }
      console.log(this.newUser)
    },
    selectCharacter: function selectCharacter(evt) {
          var characterData = $(evt.currentTarget).data();
          console.log(characterData)
          //alert("Clicked " + characterData.characterImg);
          for(var x = 1; x <= 6; x++){
            if(this.newUser.get("hero" + x) === 0){
              this.newUser.set("hero" + x,characterData.characterImg)
              this.newUser.set('heroName' + x, characterData.characterName)
              return;
            }
          }
          console.log(this.newUser)
    },
    //main app view initializes loginView, creates a div, and then loads the view.
    initialize: function() {
      this.setCurrentView(new LoginView())
      this.newUser = new User;
      this.newUserView = new UserView({ model : this.newUser})
      this.listenTo(this.newUser, "change:heroNum", this.addFightButton)      
      this.listenTo(this.newUser, "change", this.newUser.render)
      characterList.fetch();
      console.log("This is our user : ")
      console.log(this.newUser)
    },
    addFightButton : function(model){
      if(model.get('heroNum') === 6){
        console.log("FIGHT!")
        this.$el.append('<button id="fightButton">Let\'s get it on!</button>')
      }else{
        $('#fightButton').remove()
      }
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
      var leftTeamObj = {};
      var rightTeamObj = {};
      // search character collection to pull down the characters the user has selected!
      var getThis = characterList.where({name:'Hulk'})
      console.log(getThis)
      for(var x = 1; x <= 6; x++){
          leftTeamObj[x] = this.newUser.attributes['heroName' + x]
      }
      console.log(leftTeamObj)
      console.log(rightTeamObj)
      leftTeam = new CharacterCollection(leftTeamObj);
      rightTeam = new CharacterCollection(rightTeamObj);
      */
      this.setCurrentView(new FightView({ collection : leftTeam}))
    },
    loadCharView : function(event) {
          //TODO(justin): this is really nasty and should probably occur outside this function
          event.preventDefault()
          //creates character collection
          var characterCol = new CharacterCollection()
          //calls the collection using index.js router.get /api/characters. async:false to prevent render until it gets all the info.
          characterCol.fetch({async: false})
          //creates charactersview with collection
          this.setCurrentView(new CharactersView({ collection: characterCol}))
          //console.log("the character selection loaded")
          //create current user
    },
    setCurrentView: function(newView) {
      if (this.currentView) this.currentView.remove()
      this.currentView = newView
      this.$el.html(newView.$el)
    }
  })
  var App = new MainAppView();
})
