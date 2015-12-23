(function() {

window.App = {
  Models: {},
  Views: {},
  Collections: {}
};

App.Models.Message = Backbone.Model.extend({

  url: 'https://api.parse.com/1/classes/chatterbox',

  defaults: {
    username: 'anonymous',
    roomname: 'Lobby',
    text: ''
  }
});

App.Models.Messages = Backbone.Model.extend({
  model : App.Models.Message,
  url: 'https://api.parse.com/1/classes/chatterbox',

  loadMessages: function() {
    this.fetch({
      data: {order: '-createdAt'}
    });
  },

  parse: function(response) {
    var results = [];
    for (var i = 0; i < response.results.length; i++) {
      results.push(response.results[i]);
    }
    return results;
  }

});

App.Collections.Messages = Backbone.Collection.extend({
  model: App.Models.Messages,

  el: '#roomSelect',

  template: _.template('<option value="<%- roomname %>"</option>'),

  initialize: function() {

    this.populateRooms();

  },

  populateRooms: function() {
    console.log(this);
    this.$el.append(this.template(this.model.roomname));
  }

});

App.Views.Form = Backbone.View.extend({

  tagName: '#main',
  
  initialize: function() {
    this.collection.on('sync', this.stopSpinner, this);
    this.collection.on('change', this.render, this);
  },

  stopSpinner: function() {
    this.$('.spinner img').fadeOut('fast');
    this.$('form input[type=submit]').attr('disabled', null);
  },

  render: function() {

  }


});

App.Views.Message = Backbone.View.extend({
  
  template: _.template('<div class="chat" data-id=<%- objectId %>"> \
    <div class="user"><%- username %></div> \
    <div class="text"><%- text %></div> \
    </div>'),

  template1: _.template('<option value="<%- roomname %>"</option>'),

  render: function() {
    this.model.username = this.model.username || '';
    this.model.text = this.model.text || '';
    this.$el.html(this.template(this.model));
    return this.$el;
  }
})

App.Views.RoomSelect = Backbone.View.extend({
  
  el: '#roomSelect',

  events: {
    'click #roomSelect': 'populateRooms'
  },

  template: _.template('<option value="<%- roomname %>"</option>'),

  initialize: function() {
    console.log(this);
    // this.collection.on('sync', this.populateRooms, this);
  },

  populateRooms: function() {
    console.log(this.collection);
    _.each(this.collection.attributes, this.renderRooms, this);
    // this.$el.append(this.template(this.collection.roomname));
  },

  renderRooms: function() {
    this.$el.append('New Room');
    // console.log(this.toJSON());
  }

});

App.Views.Messages = Backbone.View.extend({

  onScreenMessages: {},

  initialize: function() {
    this.collection.on('sync', this.render, this);
  },

  render: function() {
    console.log(this);  
    _.each(this.collection.attributes, this.renderMessage, this);
  },

  renderMessage: function(message) {
    var messageView = new App.Views.Message({model: message});
    var $html = messageView.render();
    $('#chats').prepend(messageView.render());
  }
})



})();


window.messages = new App.Models.Messages();
messages.loadMessages();
// var formView = new FormView({el: $('#main'), collection: messages});
var messagesView = new App.Views.Messages({collection : messages});
var roomsView = new App.Views.RoomSelect({collection : messages});
// var roomsView = new RoomsView({el: $('#rooms'), collection: messages});
// setInterval( messages.loadMessages.bind(messages), 1000);