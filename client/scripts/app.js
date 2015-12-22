
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
  //app.handleSubmit();
};

//'<img src="images/bird-03.jpg height="42" width="42">'
// var message = {
//   username: 'TGA Hacks',
//   text: 'Be Hacked or be Hacked',
//   roomname: 'You be Gone Yaaarrrr !!!!  '
// };

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

  var roomSelected = $("#roomSelect option:selected" ).text();

  if (app.roomname === undefined || null) {
    app.roomname = 'Lobby';
  } 

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    //url: 'https://api.parse.com/1/classes/chatterbox'
    url: app.server,
    type: 'GET',
    data: { order: '-createdAt'},
    contentType: 'application/json',
    success: function (data) {
      // console.log(data);
      // app.clearMessages();
      app.populateRooms(data.results)

      if (data.results.roomname === roomSelected) {
        app.displayMessages(data.results);  
      } else {
        app.displayMessages(data.results);
      }
      

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  // $('.message').append('hello');
});

};

app.renderMessage = function(message) {

  var roomSelected = $("#roomSelect option:selected" ).text();

  if ( message.roomname === roomSelected ) {
    var $username = $('<a href="#" class="username">' + message.username +'</a>');
    var $text = $('<div class="text">'+ message.text + '<span class="roomname">' + message.roomname + '</span>' + '</div>');
    var $chat = $('<div>', {class: 'chat', 'data-id': message.objectId, 'data-roomname': message.roomname}).append($username, $text);
  }

  return $chat
}

app.displayMessage = function(message) {
  
  //if (!app.onscreenMessages[message.objectId]) {
  //if ( message.roomname === roomSelected ) {
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
  //alert('in the clearing function')

  var $chat = $('#chats');
    //debugger
    $('.chat').remove();
    $('.chatroom').remove();

  };

app.populateRooms = function(results){

  for (var i = 0; i < results.length; i++) {
    var uniqueChatRoomName = results[i].roomname;
    // console.log(uniqueChatRoomName && !chatrooms[uniqueChatRoomName] || chatrooms[uniqueChatRoomName] === null);
    if (uniqueChatRoomName && !app.chatrooms[uniqueChatRoomName] && app.chatrooms[uniqueChatRoomName] !== null) {
      
      // Add the Room to the select menu
      app.addRoom(uniqueChatRoomName);

      app.chatrooms[uniqueChatRoomName] = true;
    }
  }
  // console.log(chatrooms);
  
  // Select the menu option
  $('#roomSelect').val();
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

  //$('#main').append('<div id="chats">');
  //$('#main').append('<div id="roomSelect>')
  //$('#chats').append('<div class="message"></div>');


  // $('body').on('click','#refresh', function() {
  //   console.log('the click handler is operating');
  //   app.fetch();
  // });

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
});

$('#roomSelect').change(function() {
  console.log("Selecting Room");
  var selectedVal = $("#roomSelect option:selected" ).text();
  console.log("Selecting the: ", selectedVal);
  app.changeRoom(selectedVal);

});

});

setInterval(app.init, 5000);



