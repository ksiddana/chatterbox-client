// Post created messages by user to the DOM.
var app = {};

// Add a property to the application that keeps track of the most recent messages
app.onscreenMessages = {};

// Add a property to the chatterbox that holds the api endpoint address
app.server = 'https://api.parse.com/1/classes/chatterbox';

// By default we want the Chatterbox Client to be in the room, selected from the Drop
// Down Menu
app.$roomSelect = $('#roomSelect');

// Set the default chatroom to "Lobby"
app.roomname = 'Lobby';

// Make an Object to hold all the chatrooms.
app.chatrooms = {};

app.init = function(){

  app.fetch();
};

app.send = function(data){
  console.log('this the message being passed into app.send ' + data.text);
//console.log(JSON.stringify(message));

$.ajax({

    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function (data) {
      console.log('message sent', data);

      $('#chat').append(data);

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function(){

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    //url: 'https://api.parse.com/1/classes/chatterbox'
    url: app.server,
    type: 'GET',
    data: { order: '-createdAt'},
    contentType: 'application/json',
    success: function (data) {
      
        app.populateRooms(data.results)

        app.displayMessages(data.results);  
          

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
});

};

app.renderMessage = function(message) {
  
  // A lot of the messages are getting filtered when there's no
  // chatroom name associated with them. We want to still display
  // all the messages. 
  if (message.roomname === null) {
    message.roomname = 'Lobby';
  }

  // We only want to append those messages to the DOM that have
  // have been selected by the user. message.roomname needs to be valid
  // for this condition to work, therefore we set the message roomname to 
  // equal to the approom name.
  if ( message.roomname === app.roomname) {
    var $username = $('<a href="#" class="username">' + message.username +'</a>');
    var $text = $('<div class="text">'+ message.text + '<span class="roomname">' + message.roomname + '</span>' + '</div>');
    var $chat = $('<div>', {class: 'chat', 'data-id': message.objectId, 'data-roomname': message.roomname}).append($username, $text);
  }

  // Return the chat jQuery element from the render message to to the Display
  // Message.
  return $chat
}

app.displayMessage = function(message) {
  
  //if (!app.onscreenMessages[message.objectId]) {
  // if ( message.roomname === roomSelected ) {
      // app.clearMessages();
      var $html = app.renderMessage(message);

      $('#chats').append($html);
      //app.onscreenMessages[message.objectId] = true;
  //}
}

app.displayMessages = function(messages) {

  for (var i = 0; i < messages.length; i++) {
    app.displayMessage(messages[i]);
  }
}

app.clearMessages = function(){

    $('#chats').html('');

  };

app.populateRooms = function(results){

  for (var i = 0; i < results.length; i++) {
    var uniqueChatRoomName = results[i].roomname;
    
    // If the chatroom Name is Unique and is not in the app chatroom object, add the 
    // the room to the app chatroom object and also add it to the drop down menu selection
    if (uniqueChatRoomName && !app.chatrooms[uniqueChatRoomName]) {
      
      // Add the Room to the select menu
      app.addRoom(uniqueChatRoomName);

      // Once the chatrooms are fetched from the server, we
      // only want to populate the Drop Down Menu only once.
      app.chatrooms[uniqueChatRoomName] = true;
    }
  }
};

app.addRoom = function(roomname) {

      var $option = $('<option value="' + roomname + '">'+ roomname +'</option>');
      // Add to select
      $('#roomSelect').append($option);
}

app.changeRoom = function(roomname) {

  app.clearMessages();
  app.displayMessage()

}

var friend = [];

app.addFriend = function(username) {
  
  // Clicking on a username current inserts the friend into the Friends list.
  friend.push(username);

  for (var i = 0; i < friend.length; i++) {
  //console.log($());
  };
};


app.handleSubmit = function(input){
  var message = {
    username: 'guyWithCoolPants_98',
    text: input,
    roomname: $('#roomSelect').val()
  };

  app.send(message);
  console.log('inside handle submit: ' + message.text);

};

$(document).ready(function(){

  $('#send').on('submit', function(event){
    event.preventDefault();
    var writeText = $('#send :input').val();
    app.handleSubmit(writeText);
  });

  $(document).on('click', '.username', function(event){
    event.preventDefault();
    var username = $(this).text();
    console.log(username);
    app.addFriend(username);
  });

  $('#newroom').on('submit', function(event){
    event.preventDefault();
    var newRoom = $('#newroom :input').val();
    app.addRoom(newRoom);
    $('#newroom').text('');
  });

  $('#roomSelect').change(function() {
    //var selectedVal = $("#roomSelect option:selected" ).text();
    app.roomname = $("#roomSelect").val();
    app.clearMessages();
    app.fetch();

  });

});

setInterval(app.init, 3000);



