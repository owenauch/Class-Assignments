// Require the packages we will use:
var http = require('http'),
	url = require('url'),
	path = require('path'),
	mime = require('mime'),
	path = require('path'),
	fs = require('fs');
	socketio = require('socket.io');


	// Make a simple fileserver for all of our static content.
	// Everything underneath <STATIC DIRECTORY NAME> will be served.
	var app = http.createServer(function(req, resp){
		var filename = path.join(__dirname, "static", url.parse(req.url).pathname);
		(fs.exists || path.exists)(filename, function(exists){
			if (exists) {
				fs.readFile(filename, function(err, data){
					if (err) {
						// File exists but is not readable (permissions issue?)
						resp.writeHead(500, {
							"Content-Type": "text/plain"
						});
						resp.write("Internal server error: could not read file");
						resp.write("Try adding /chat.html to the end of the url.")
						resp.end();
						return;
					}

					// File exists and is readable
					var mimetype = mime.lookup(filename);
					resp.writeHead(200, {
						"Content-Type": mimetype
					});
					resp.write(data);
					resp.end();
					return;
				});
			}else{
				// File does not exist
				resp.writeHead(404, {
					"Content-Type": "text/plain"
				});
				resp.write("Requested file not found: "+filename);
				resp.end();
				return;
			}
		});
	});
	app.listen(3456);


var chatRooms = [{name:"Welcome", admin:null, password:null, id:0}];
var users = [];

// Do the Socket.IO magic:
var io = socketio.listen(app);
io.sockets.on("connection", function(socket){
	// This callback runs when a new Socket.IO connection is established.

	// send prep data to new connections
	socket.on("send_prep_data", function(data) {
		socket.emit("prep_data", {rooms:chatRooms});
		socket.join(0);
	});

	// add to users
	socket.on("send_username", function(data) {
		//
		var user = {userID:socket.id, name:data["user"], room:0, reports:0};
		users.push(user);
	});

	// when room is created, put it in global array chatRooms and push it to other users
	socket.on("create_room", function(data) {
		var newRoom = {
			name:data["name"],
			admin:data["admin"],
			password:data["password"],
			id:chatRooms.length
		};

		chatRooms.push(newRoom);

		// update array
		for (i in users) {
			if (users[i].userID == socket.id) {
				users[i].room = newRoom.id;
			}
		}

		console.log("new room: " + data["name"]);

		// send the room to all sockets (could do all but the one that sent it to improve speed
		// but why do the hard thing when you can do the easy thing)
		io.sockets.emit("room_created", {room:newRoom});
	});

	// create dm
	socket.on("down_in_the_dm", function(data) {
		var creeped = data["creeped"];
		var creeper = data["creeper"];

		var dm = {
			name:"DM: " + creeped + " and " + creeper,
			admin:null,
			password:null,
			id:chatRooms.length
		};

		var creepedID = null;

		// get socket id and switch around rooms
		for (i in users) {
			if (users[i].name == creeped) {
				creepedID = users[i].userID;
			}
		}

		// send room only to creeped
		io.to(creepedID).emit("room_created", {room:dm});
		socket.emit("room_created", {room:dm});
	});

	// kick user from current chatroom
	socket.on("kick_user", function(data) {
		var kickee = data["kickee"];
		var kickID = null;

		// get socket id
		for (i in users) {
			// if someone kicked them
			if (users[i].name == kickee) {
				kickID = users[i].userID;
				var kicked = io.sockets.connected[kickID];
				kicked.leave(users[i].room);
				kicked.join(0);
				users[i].room = 0;
			}
		}


		io.to(kickID).emit("get_kicked", "get some lad");
	});

	// report user from current chatroom
	socket.on("report_user", function(data) {
		// getting username of reported user
		var reportee = data["reportee"];
		var reportID = null;
		console.log("the reportee is: " + reportee);
		// get socket id
		for (i in users) {
			if (users[i].name == reportee) {

				//incrementing reports
				users[i].reports += 1;
				console.log(users[i].name + " has been reported " + users[i].reports + " times. Users are logged out after 4 reports.");

				console.log(users[i] + " has " + users[i].reports + "reports");
				reportID = users[i].userID;

				// if they have more than 3 reports, kick them
				if (parseInt(users[i].reports) > 3) {

					console.log(users[i].name + "is being disconnected");
					console.log(data["id"]);
					io.to(reportID).emit("get_reported", {id:users[i].userID});


				}
			}
		}

		//console.log(reportee);
		//console.log(users);

	});

	socket.on("ban_user", function(data) {
		var banee = data["banee"];
		var banID = null;

		// get socket id
		for (i in users) {
			if (users[i].name == banee) {
				banID = users[i].userID;
				var banned = io.sockets.connected[banID];
				banned.leave(users[i].room);
				banned.join(0);
				users[i].room = 0;
			}
		}

		io.to(banID).emit("get_banned", {id:data["id"]});
	});

	// switches rooms when client tells it to
	socket.on("switch_rooms", function(data) {
		var currentRoom = data["current"];
		socket.leave(currentRoom);
		socket.join(data["id"]);

		// send changes to everyone
		var currentUsers = [];

		for (i in users) {
			if (users[i].room == data["id"]) {
				currentUsers.push(users[i].name);
			}
		}
		io.sockets.emit("room_users", {id:data["id"], currentUsers:currentUsers});

		// update array
		for (i in users) {
			if (users[i].userID == socket.id) {
				users[i].room = data["id"];
			}
		}
	});

	// return if user is admin of current room or not
	socket.on("check_admin", function(data) {
		var is_admin = false;

		for (r in chatRooms) {
			if (chatRooms[r].id == data["id"] && chatRooms[r].admin == data["user"]) {
				is_admin = true;
			}
		}

		socket.emit("is_admin", {admin:is_admin});
	});

	// send back users in room requested
	socket.on("get_room_users", function(data) {
		var id = data["roomID"];
		var currentUsers = [];

		for (i in users) {
			if (users[i].room == id) {
				currentUsers.push(users[i].name);
			}
		}

		socket.emit("room_users", {id:id, currentUsers:currentUsers});
	});

	// recieves new messages and broadcasts to all in room
	socket.on("new_message", function(data) {
		// send to all clients
		io.sockets.emit("message_to_client", data);
	});

	// disconnect socket on logout
	socket.on("logout", function(data) {
		socket.disconnect();
	});

	// get user out of rooms on disconnect
	socket.on('disconnect', function() {
		for (i in users) {
			if (users[i].userID == socket.id) {
				users.splice(i, 1);
			}
		}
	});

});
