///////////////////////////////////////////////////////////////////////
// backbone-based implementation of chatterbox-client
///////////////////////////////////////////////////////////////////////

var Message = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox',
  
  defaults: {
    username:'',
    roomname:'',
    text:''
  }
});

var Messages = Backbone.Model.extend({
  model: Message,
  url: 'https://api.parse.com/1/classes/chatterbox',

  loadMsgs: function() {
    this.fetch({
      data: {order: '-createdAt'}
    });
  },
  
  parse: function(response, options) {
    var results = [];
    for (var i = response.results.length -1; i >= 0; i--) {
      results.push(response.results[i]);
    }
    return results;
  }

});

var FormView = Backbone.View.extend({

  initialize: function() {
    this.collection.on('sync', this.stopSpinner, this);
  },
  
  events: {
    'submit #send': 'handleSubmit'
  },

  handleSubmit: function(e) {
    e.preventDefault();

    this.startSpinner();

    var $text = this.$('#message');

    var message = {
      username: window.location.search.substr(10),
      text: $text.val()
    };

    $text.val('');

    var message = new Message(message);
    message.save();
  },

  startSpinner: function() {
    this.$('spinner img').show();
    this.$('form input[type=submit]').attr('disabled', "true");
  },

  stopSpinner: function() {
    this.$('.spinner img').fadeOut('fast');
    this.$('form input[type=submit]').attr('disabled', null);
  }

});


var MessageView = Backbone.View.extend({
  
  template: _.template('<div class="chat" data-id="<%- objectId %>"> \
    <div class="user"><%- username %></div> \
    <div class="text"><%- text %></div> \
    </div>'),

  render: function() {
    this.model.username = this.model.username || '';
    this.model.text = this.model.text || '';
    this.$el.html(this.template(this.model))
    return this.$el;
  }

});

var MessagesView = Backbone.View.extend({
  onscreenMessages: {},

  initialize: function() {
    this.collection.on('sync', this.render, this);
  },

  render: function() {
    _.each(this.collection.attributes, this.renderMessage, this);
  },

  renderMessage: function(message) {
    // console.log('message:',message);
    if( !this.onscreenMessages[message.objectId]) {
      var messageView = new MessageView({model: message});
      var $html = messageView.render();
      $('#chats').prepend(messageView.render());
      this.onscreenMessages[message.objectId] = true;
    }
  }
  
});