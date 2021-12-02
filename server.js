// This file starts both the Express server, used to serve the
// actual webpage, and the Socket.io server, used to handle
// the realtime connection to the client.
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

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

let board = [
	[-1, -1, -1],
	[-1, -1, -1],
	[-1, -1, -1]
]

let roomNums = 0 
let boards = {}

const joinRoom = (socket) => {
	let currentRoom = roomNums - roomNums % 2
	socket.currentRoom = currentRoom
	let roomIsReady = roomNums % 2 != 0
	roomNums += 1
	socket.join(`room${currentRoom}`)
	socket.emit("set shape", !roomIsReady)
	if (roomIsReady) {
		boards[currentRoom] = [[-1, -1, -1],[-1,-1,-1],[-1,-1,-1]]
		console.log("sending update signal to ", `room${currentRoom}`)
		io.to(`room${currentRoom}`).emit("update board", boards[currentRoom])
	}
}

io.on('connection', (socket) => {
	console.log('a user connected')
	joinRoom(socket)

	socket.on('select', (x, y, isCircle) => {
		var curBoard = boards[socket.currentRoom]
		console.log('player selected tile', x, y)
		if (curBoard[y][x] != -1) {
			console.log("player tried to select already selected tile")
			return 
		}
		console.log(socket.isCircle)
		if (isCircle) {
			curBoard[y][x] = 0
		}
		else {
			curBoard[y][x] = 1
		}
		boards[socket.currentRoom] = curBoard
		io.to(`room${socket.currentRoom}`).emit('update board', boards[socket.currentRoom])
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})


// Start http server
server.listen(app.get("port"), () => {
	console.log("Node app started on port %s", app.get("port"));
});
