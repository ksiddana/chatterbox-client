
// YOUR CODE HERE:

//Objective: post and update messages to the chatter box server.

//find a way to retrieve the meassage from the server and post them to the DOM.
  //seperate: username, message, roomname (but within teh same message)

//find a way to post created messages by user to the DOM.
var app = {};

app.onscreenMessages = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.$roomSelect = $('#roomSelect');
app.roomname = 'Lobby';
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

  // debugger
/*  if (!message.roomname){
    message.roomname = 'Lobby';
  }*/
  
  if (message.roomname === null) {
    message.roomname = app.roomname;
  }

  if ( message.roomname === app.roomname) {
    var $username = $('<a href="#" class="username">' + message.username +'</a>');
    var $text = $('<div class="text">'+ message.text + '<span class="roomname">' + message.roomname + '</span>' + '</div>');
    var $chat = $('<div>', {class: 'chat', 'data-id': message.objectId, 'data-roomname': message.roomname}).append($username, $text);
  }

  return $chat
}

app.displayMessage = function(message) {
  
  //if (!app.onscreenMessages[message.objectId]) {
  //if ( message.roomname === roomSelected ) {
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
    // console.log(uniqueChatRoomName && !chatrooms[uniqueChatRoomName] || chatrooms[uniqueChatRoomName] === null);
    if (uniqueChatRoomName && !app.chatrooms[uniqueChatRoomName]) {
      
      // Add the Room to the select menu
      app.addRoom(uniqueChatRoomName);

      // Once the chatrooms are fetched from the server, we
      // want to populate the Drop Down Menu only once.
      app.chatrooms[uniqueChatRoomName] = true;
    }
  }
};

app.addRoom = function(roomname) {

      // console.log(roomname);
      // Prevent XSS by escaping with DOM methods
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
  console.log("add Friend is being called it's");
  friend.push(username);
  console.log(friend);

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



