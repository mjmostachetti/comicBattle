var leftTeam, characterList, fightViewer, newUser;

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
      if (this.get("name") === "Batman" || this.get("name") ===
        "daredevil" || this
        .get("name") === "Hulk" || this.get("name") === "Joker") {
        this.set("type", "strength")
      } else if (this.get("name") === "Superman" || this.get("name") ===
        "Spider-man" || this.get("name") === "Cyclops" ||
        this.get("name") === "Carnage") {
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
      draw: 0,
      hero1: '',
      hero2: '',
      hero3: '',
      hero4: '',
      hero5: '',
      hero6: '',
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
      '<h2>User Team</h2>' +
      '<img src=<%=hero1%>>' +
      '<img src=<%=hero2%>>' +
      '<img src=<%=hero3%>> <br>' +
      '<h2>Computer Team</h2>' +
      '<img src=<%=hero4%>>' +
      '<img src=<%=hero5%>>' +
      '<img src=<%=hero6%>> <br>' +
      '<h2> Wins : <%=win%></h2>' +
      '<h2> Losses : <%=loss%></h2>' +
      '<h2> Draws : <%=draw%></h2>'
      ),
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
        if(model.attributes['hero' + x] !== ''){
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
      console.log(this.collection.slice(0,3))
      console.log(this.collection.slice(3,6))

      this.leftTeamCollection = this.collection.slice(0,3)
      this.rightTeamCollection = this.collection.slice(3,6)
      this.render()
    },
    render: function() {
      this.$el.html(this.template)
      console.log("I am logging this:")
      console.log(this)
    },
    findNextChar: function() {
      var leftCharacter;
      var rightCharacter;
      console.log(this.leftTeamCollection)
      console.log(this.rightTeamCollection)

      console.log("The left team has " + this.leftTeamCollection.length + " players left.")
      console.log("The right team has " + this.rightTeamCollection.length + " players left.")

      if(this.leftTeamCollection.length === 0 && this.rightTeamCollection.length === 0){
        return this.draw('Nobody')
      }

      if(this.leftTeamCollection.length === 0){
        return this.loss('Right')
      } else{
        leftCharacter = this.leftTeamCollection[0]
      }

      if(this.rightTeamCollection.length === 0){
        return this.win('Left')
      } else{
        rightCharacter = this.rightTeamCollection[0]
      }
      console.log("right here")
      console.log(leftCharacter)
      console.log(rightCharacter)
      this.fight(leftCharacter, rightCharacter)
      this.findNextChar()
    },
    fight: function(leftCharacter, rightCharacter) {
      console.log("The right character type is : " + rightCharacter.get("type"))
      console.log("The left character type is : " + leftCharacter.get("type"))
      if (leftCharacter.get("type") === rightCharacter.get("type")) {
        console.log("Draw")
        /*
        leftCharacter.set("ko", true)
        rightCharacter.set("ko", true)
        */
        this.leftTeamCollection.shift()
        this.rightTeamCollection.shift()
      } else if (leftCharacter.get("type") === "strength" &&
        rightCharacter.get("type") ===
        "energy") {
        console.log(leftCharacter.get("name") + " wins!")
        //rightCharacter.set("ko", true)
        this.rightTeamCollection.shift()
      } else if (leftCharacter.get("type") === "strength" &&
        rightCharacter.get("type") ===
        "magic") {
        console.log(rightCharacter.get("name") + " wins!")
        //leftCharacter.set("ko", true)
        this.leftTeamCollection.shift()
      } else if (leftCharacter.get("type") === "energy" &&
        rightCharacter.get("type") ===
        "strength") {
        console.log(rightCharacter.get("name") + " wins!")
        //leftCharacter.set("ko", true)
        this.leftTeamCollection.shift()
      } else if (leftCharacter.get("type") === "energy" &&
        rightCharacter.get("type") ===
        "magic") {
        console.log(leftCharacter.get("name") + " wins!")
        //rightCharacter.set("ko", true)
        this.rightTeamCollection.shift()
      } else {
        console.log(leftCharacter.get("name") + " wins!")
        //rightCharacter.set("ko", true)
        this.rightTeamCollection.shift()
      }
    },
    draw : function(team){
      console.log(team + " wins!")
      newUser.set('draw',newUser.get('draw') + 1)
    },
    loss: function(team) {
      console.log(team + " wins!")
      newUser.set('loss',newUser.get('win') + 1)
    },
    win: function(team) {
      console.log(team + " wins!")
      newUser.set('win',newUser.get('win') + 1)
    },
    events: {
      //"click #findNextChar": "findNextChar",
      "click #fight": "findNextChar"
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


  newUser = new User;
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
        if(newUser.get("hero" + x) !== ''){
          newUser.set("hero" + x,'')
          return;
        }
      }
      console.log(newUser)
    },
    selectCharacter: function selectCharacter(evt) {
          var characterData = $(evt.currentTarget).data();
          console.log(characterData)
          //alert("Clicked " + characterData.characterImg);
          for(var x = 1; x <= 6; x++){
            if(newUser.get("hero" + x) === ''){
              newUser.set("hero" + x,characterData.characterImg)
              newUser.set('heroName' + x, characterData.characterName)
              return;
            }
          }
          console.log(newUser)
    },
    //main app view initializes loginView, creates a div, and then loads the view.
    initialize: function() {
      this.setCurrentView(new LoginView())
      //newUser = new User;
      this.newUserView = new UserView({ model : newUser})
      this.listenTo(newUser, "change:heroNum", this.addFightButton)      
      this.listenTo(newUser, "change", newUser.render)
      this.listenTo(newUser,"change:win",this.loadCharacterSelectionRedirect)
      this.listenTo(newUser,"change:loss",this.loadCharacterSelectionRedirect)
      this.listenTo(newUser,"change:draw",this.loadCharacterSelectionRedirect)
      characterList.fetch();
      console.log("This is our user : ")
      console.log(newUser)
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
    },
    loadCharacterSelectionRedirect: function() {
      for(var x = 1; x <= 6; x++){
        newUser.attributes['hero' + x] = ''
        newUser.attributes['heroName' + x] = ''
      }
      this.setCurrentView(new CharactersView({ collection : characterList}))
    },
    loadFightScreen: function(event) {
      event.preventDefault()
      var battleCharacters = new CharacterCollection;
      // search character collection to pull down the characters the user has selected!
      var getThis = characterList.where({name:'Hulk'})
      console.log(getThis)
      for(var x = 1; x <= 6; x++){
        var preAttributeModel = characterList.findWhere({name: newUser.attributes['heroName' + x]})
        preAttributeModel.attribute()
        console.log(preAttributeModel)
        battleCharacters.add(preAttributeModel)
      }
      console.log(battleCharacters)
      //leftTeam = new CharacterCollection(leftTeamObj);
      //rightTeam = new CharacterCollection(rightTeamObj);
      fightViewer = new FightView({ collection : battleCharacters})
      this.setCurrentView(fightViewer)
    },
    loadCharView : function(event) {
      this.setCurrentView(new CharactersView({ collection: characterList}))
    },
    setCurrentView: function(newView) {
      if (this.currentView) this.currentView.remove()
      this.currentView = newView
      this.$el.html(newView.$el)
    }
  })
  var App = new MainAppView();
})
