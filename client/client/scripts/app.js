var app = {};
 
app.friends = [];
app.rooms = [];
app.userName;
app.currentRoom = 'lobby';
app.url = 'http://127.0.0.1:3000/classes/messages';

app.init = function() {
  // console.log('refresh');
  app.fetch(app.url);
};

app.send = function(message) {
  $.ajax({
    url: app.url,
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(message),
    contentType: 'application/json; charset=utf-8'
  });
};

// app's fetch url - 'https://api.parse.com/1/classes/messages'

app.fetch = function(url) {
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      var messages = data.results;
      app.clearMessages();
      _.each(messages, function(message, i, messages) {
        app.addMessage(message);
      });
    },
    error: function(data) {
      console.log('fetch request failed : ', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.escapeHTML = function(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

app.compareFriends = function() {
  console.log('FRIENDS ARRAY: ', friends);
};

app.addMessage = function(message) {
  var username = app.escapeHTML(message['username']);
  var text = app.escapeHTML(message['text']);
  var room = app.escapeHTML(message['roomname']);
  if (app.rooms.indexOf(room) === -1) {
    app.rooms.push(room);
    $('select').append('<option>' + room + '</option>');
  }
  //console.log(currentRoom, room);
  if (app.currentRoom === room) {
    var $message = $('<div class="username chat"></div>');
    if (app.friends.indexOf(username) > -1) {
      $message = $message.append('<h2 style="color:blue;">' + username + '</h2>');
    } else {
      $message = $message.append('<h2>' + username + '</h2>');
    }

    $message = $message.append('<p>' + text + '</p>');
    $('#chats').append($message);
  } // else { console.log('not current room'); }
};

app.addRoom = function(roomName) {
  $('#roomSelect').append('<div>' + roomName + '</div>');
};

app.addFriend = function() {
  var name = $(this)[0].firstChild.textContent;
  if (app.friends.indexOf(name) === -1) {
    app.friends.push(name);
  }
};

//TODO: Make this filter stuff
app.filterMessages = function(data) {
  _.each(data.results, function(message, i, list) {
    app.messages.push(message);
  });
};

app.handleSubmit = function(event) {
  event.preventDefault();
  var newMessage = {
    username: $('input[name*="username"]').val(),
    text: $('input[name*="message"]').val(),
    roomname: $('input[name*="room"]').val()
  };
  app.send(newMessage);
  return false;
};

$(document).ready(function() {

  $('#submitFormJezzebelle').submit(app.handleSubmit);

  $('select').on('change', function() {
    app.currentRoom = $(this).val();
  });

});

$(document).delegate('.username', 'click', app.addFriend);

setInterval(app.init, 1000);