/*
  TODO
  1. List all current users in the chatroom
  2. Support switching to multiple chatrooms
  3. Have password protected chat rooms ****

  5. Kicking people from chatroom
  6. Permabanning people in the chat rooms

  7. Users can send private messages to other users

*/


var username = "New User";

// array of chatrooms
var rooms = [];

// current room ID
var currentID = 0;

// socket creation
var socket = io.connect();
//right now, only whatever is sent stays in the array and stays only for 1 refresh
window.onload = function(){

    username = prompt("Please enter a username:", username);

    // prep functions
    loadChatrooms();
    prepRoomCreation();
    prepInbound();
    kickBan();
    handleLogout();
}
