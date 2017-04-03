// recieves startup data from server and creates chatroom for all of them
function loadChatrooms() {
    socket.emit("send_prep_data", {message:"send the junk"});

    socket.on('prep_data', function(data) {
        for (room in data["rooms"]) {
            createChatroom(data["rooms"][room]);
            rooms.push(data["rooms"][room]);
        }
    });

    // send username to server
    socket.emit("send_username", {user:username});

    // hide all but welcome room
    hideAllRooms(0);
}

// allow to get kicked and banned
function kickBan() {
    socket.on("get_kicked", function(data) {
        hideAllRooms(0);
        alert("You've been kicked by the admin!");
    });

    socket.on("get_banned", function(data) {
        hideAllRooms(0);
        alert("You've been banned by the admin!");
        $("#list-" + data["id"]).remove();
    });
    socket.on("get_reported", function(data) {
        hideAllRooms(0);
        alert("You've been reported more than 3 times! Get banned!");
        $("#list-" + data["id"]).remove();
    });

}

// handle logout button click
function handleLogout() {
    $("#logout").on("click", function() {
        socket.emit("logout", {message:"With that, I'm out"});

        // gets rid of html on page
        $("body").empty();
        $("body").append("<h1>Thank you for visiting the site! If you want to log in again as a new user, click <a href='chat.html'>here!</a></h1>");
    });
}

// creates event handler for chatroom creator
// and handles new rooms created by other clients
function prepRoomCreation() {

    // ready create button
    $("#create_server_submit").click(function(){
        var roomName = $("#new_chatroom_name_input").val();
        var pwd = $("#server_pwd_input").val();
        if (pwd == "") {
          pwd = null;
        }
        var ad = username;

        socket.emit("create_room", {
          name:roomName,
          password:pwd,
          admin:ad
        });

        // wipe the boxes clean
        $("#new_chatroom_name_input").val("");
        $("#server_pwd_input").val("");
    });

    // handling new rooms
    socket.on("room_created", function(data) {
        rooms.push(data["room"]);
        createChatroom(data["room"]);
    });
}

// allow messages to be recieved and placed in the right room
function prepInbound() {
    socket.on("message_to_client", function(data) {
        $("div." + data["id"]).prepend("<hr>" + data["user"] + ": " + data["message"]);
    });
}

// creates chatroom html from a chatroom object
function createChatroom(room) {
    var name = room.name;
    var id = room.id;

    updateNavBar(room);

    // Creating the chatroom structure in jquery and appending as a child of a div
    var chatroom_structure = $("<article class='room " + id + "' data_id=" + id + " ></article>")
    .append("<h3 class=" + id + " data_id=" + id + " >" + name + "</h3>")
    .append("<p class=" + id + " data_id=" + id + " >Users in this chatroom:<br>Click room name on left to refresh ---- Click user name to ban as admin</h3>")
    .append("<ul class=" + id + " data_id=" + id + " ></ul>")
    .append("<input class="+ id +" data_id=" + id + " type=\"text\" />")
    .append("<button class=" + id + " data_id=" + id + " type=\"text\">send</button>")
    .append("<div class=" + id + " data_id=" + id + " ></div>");

    $("#chatboxes").append(chatroom_structure);

    // send button functionalitiy
    $("button").click(function(event){
        var button_id = $(this).attr("data_id");
        var message_text = $("input." + button_id).val();

        // filter for empty messages
        if (message_text != "") {
            sendMessage(message_text, button_id);
        }
        $("input." + button_id).val("");
    });

    getCurrentUsers(id);

    // make new room visible
    hideAllRooms();
}

// get current users in room with specific id
function getCurrentUsers(id) {
    // get current users in room
    socket.emit("get_room_users", {roomID:id});

    // add to list when returned
    socket.on("room_users", function(data) {
        var userList = $("ul." + data["id"]);
        var users = data["currentUsers"];
        userList.empty();
        for (i in users) {
            userList.append("<li class='user' data-user="+ users[i] + ">" + users[i] + "</li><button class='dm' id='dm-"+ users[i] + "' data-name="+ users[i] +">DM user</button><button class='report' id='report-"+ users[i] + "' data-name="+ users[i] +">Report user</button>").css("cursor", "pointer");
        }

        // add click handler to allow admins to ban users
        $("li.user").off().on("click", function() {
            socket.emit("check_admin", {user:username, id:id});
            var troubleUser = $(this).text();

            // if they are an admin, allow them to kick or ban
            socket.on("is_admin", function(data) {
                if (data["admin"]) {
                    var dialog = $("#admin_dialog").css("display", "block");

                    // click handler for kick button
                    $("#kick_button").off().on("click", function(data) {
                        socket.emit("kick_user", {id:id, kickee:troubleUser});
                        alert("User has been temporarily kicked.");
                        dialog.css("display", "none");
                    });

                    // click handler for ban button
                    $("#ban_button").off().on("click", function(data) {
                        console.log("inner");
                        socket.emit("ban_user", {id:id, banee:troubleUser});
                        alert("User has been permanently banned.");
                        dialog.css("display", "none");
                    });
                }
            });

        });

        // report button, if you report him 3 times, he is banned
        $(".report").off().on("click", function(data) {
            var dialog = $("#admin_dialog").css("display", "block");

            var creeped = $(this).prev().prev().text();
            console.log("inner");

            socket.emit("report_user", {id:id, reportee:creeped});

            //alert("User has been reported");
            dialog.css("display", "none");
        });
        // on click for dm
        $(".dm").off().on("click", function(data) {
            var creeped = $(this).prev().text();
            socket.emit("down_in_the_dm", {creeped:creeped, creeper:username});
        });

    });
}

// sends message to server using chatroom id and message text
function sendMessage(message, id) {
    socket.emit("new_message", {
        message:message,
        id:id,
        user:username
    });
}

// add to nav bar and bind event handler
function updateNavBar(room) {
    var name = room.name;
    var id = room.id;

    // add chatroom name to navbar on left
    var pass = false;
    if (room.password) {
        pass = true;
    }
    $(".chatroom_list").append("<li data_id="+id+" data_password=" + pass + " class='room_list' id='list-" + id + "'>" + name + "</li>").css("cursor", "pointer");

    // click handler on navbar
    $("li.room_list").off().click(function() {
        // get id
        var roomID = $(this).attr('data_id');

        // check if password protected
        if ($(this).attr('data_password') == "true") {
            verifyPass(room, roomID);
        }
        else {
            // switch rooms on client side
            socket.emit("switch_rooms", {id:roomID, current:currentID});

            getCurrentUsers(id);

            // switch rooms in html
            hideAllRooms(roomID);
        }
    });
}

// verify password to get into room
function verifyPass(room, id) {
    var passAttempt = prompt("This chatroom is password protected. Please enter the password to enter:", passAttempt);

    if (passAttempt == room.password) {
        alert("Password successful!");

        // switch rooms on client side
        socket.emit("switch_rooms", {id:id, current:currentID});

        getCurrentUsers(id);

        // switch rooms in html
        hideAllRooms(id);
    }
    else {
        alert("Password incorrect. Try again!");
    }
}

// hides all rooms but the one with the id passed in
function hideAllRooms(id) {
    $(".room").each(function(index) {
        $(this).css("display", "none");
    });

    if (id) {
        $("."+id).css("display","block");
        currentID = id;
    }
    else {
        currentID = null;
    }
}
