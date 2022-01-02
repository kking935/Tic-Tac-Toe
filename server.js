// This file starts both the Express server, used to serve the
// actual webpage, and the Socket.io server, used to handle
// the realtime connection to the client.
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { createServer } = require('./lib/game_manager');

app.set("port", (process.env.PORT || 3001));  // Use either given port or 3001 as default
app.use(express.static("public"));  // Staticly serve pages, using directory 'public' as root 

// User connects to server
app.get("/", function(req, res) {
	// Will serve static pages, no need to handle requests
	console.log('new user connected');
});

// If any page not handled already handled (ie. doesn't exists)
app.get("*", function(req, res) {
	res.status(404).send("Error 404 - Page not found");
});

createServer(new Server(server))

server.listen(app.get("port"), () => {
	console.log("Node app started on port %s", app.get("port"));
});
