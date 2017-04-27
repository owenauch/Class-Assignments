console.log("Server started on 3001");

// SETUP VARIABLES /////////////////////////////

// import module
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');

// allows us to parse form data with Express
app.use(bodyParser.urlencoded({extended: true}))

// get MongoClient
const MongoClient = require('mongodb').MongoClient;

// save url of db and db as variables
const db_url = "mongodb://food_finder_bot:pizza@ds161950.mlab.com:61950/free-food";
var db;

// allow for Cross-Site Request Scripting (let our other domain GET data from the API)
app.use(cors());

//////////////////////////////////////////////////

// SERVER FUNCTIONS /////////////////////////////

// connect to MongoDB database on MLab
MongoClient.connect(db_url, (err, database) => {
	// catch error connecting to db
	if (err) {
		return console.log(err);
	}

	// set db as the mongo database
	db = database;

	// otherwise, get server going on 3000
	app.listen(3001, function() {
		console.log("New connection to server");

		// sends index.html when connected to main page
		app.get('/', (req, res) => {
	  		res.sendFile(__dirname + '/public/index.html');
		});

		// saves new events to database
		app.post('/new_event', (req, res) => {
			// save form data in collection "events"
			db.collection('events').save(req.body, (err, result) => {
				if (err) {
					return console.log(err);
				}
			console.log("Data saved to DB");
			res.redirect('http://localhost:3000');
			});
		});

		// gets calls to API for all events
		app.get('/get_events', (req, res) => {
	  		db.collection('events').find().toArray(function(err, results) {
				if (err) {
					return console.log(err);
				}
				// sends back all events as json
				res.json(results);
				console.log("GET request made for events");
			});
		});
	});
});

//////////////////////////////////////////////////
