// This file starts both the Express server, used to serve the
// actual webpage, and the Socket.io server, used to handle
// the realtime connection to the client.
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { getWinner, getBestMove, GameAgent } = require('./lib/game_manager');
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

const createBoard = () => {
	return [
		[-1, -1, -1],
		[-1, -1, -1],
		[-1, -1, -1]
	]
}

let games = new Map()
let waitingPlayer = undefined

const handleJoinRoom = (socket) => {
	console.log('inside join room')
	if (waitingPlayer == undefined) {
		console.log("Adding player to game queue")
		waitingPlayer = socket
		socket.isCircle = true
		return
	}
	socket.isCircle = false
	let currentRoom = socket.id + waitingPlayer.id
	socket.currentRoom = currentRoom
	waitingPlayer.currentRoom = currentRoom
	socket.join(`room${currentRoom}`)
	waitingPlayer.join(`room${currentRoom}`)
	games.set(currentRoom, {
		board: createBoard(),
		turn: true,
		players: [socket, waitingPlayer],
		roomId: currentRoom
	})
	console.log("creating new room" , currentRoom)
	waitingPlayer.emit("start game", games.get(currentRoom).board, games.get(currentRoom).turn, true)
	socket.emit("start game", games.get(currentRoom).board, games.get(currentRoom).turn, false)
	waitingPlayer = undefined
}

const handleJoinCPURoom = (socket) => {
	console.log('inside join cpu room')
	socket.isCircle = true
	let currentRoom = socket.id
	socket.currentRoom = currentRoom
	socket.vsCPU = true
	socket.join(`room${currentRoom}`)
	games.set(currentRoom, {
		board: createBoard(),
		turn: true,
		players: [socket],
		roomId: currentRoom
	})
	socket.emit("start game", games.get(currentRoom).board, games.get(currentRoom).turn, true)
}

const handleSelect = (socket, x, y, isCircle) => {
	if (!socket.currentRoom || !games.has(socket.currentRoom)) {
		console.log("Could not select move because board could not be found")
		return
	}
	var curGame = games.get(socket.currentRoom)
	if (curGame.turn != socket.isCircle) {
		console.log("A player tried to play out of turn, ignoring...")
		return
	}
	if (curGame.board[y][x] != -1) {
		console.log("player tried to select already selected tile")
		return 
	}

	if (isCircle) {
		curGame.board[y][x] = 0
	}
	else {
		curGame.board[y][x] = 1
	}

	games.set(socket.currentRoom, {...curGame, turn: !curGame.turn})

	const winner = getWinner(curGame.board)
	if (winner != 0) {
		handleGameOver(curGame, winner)
		return
	}

	io.to(`room${socket.currentRoom}`).emit('update board', games.get(socket.currentRoom).board, games.get(socket.currentRoom).turn)

	if (socket.vsCPU) {
		var curGame = games.get(socket.currentRoom)
		const bestOption = getBestMove(curGame.board, false, true)
		
		if (isCircle) {
			curGame.board[bestOption.move.y][bestOption.move.x] = 1
		}
		else {
			curGame.board[bestOption.move.y][bestOption.move.x] = 0
		}

		games.set(socket.currentRoom, {...curGame, turn: !curGame.turn})

		const winner = getWinner(curGame.board)
		if (winner != 0) {
			handleGameOver(curGame, winner)
			return
		}

		io.to(`room${socket.currentRoom}`).emit('update board', games.get(socket.currentRoom).board, games.get(socket.currentRoom).turn)
	}
}

const handleGameOver = (game, winner) => {
	io.to(`room${game.roomId}`).emit('game over', game.board, winner == 1)
	game.players.forEach((playerSocket) => {
		playerSocket.leave(`room${game.roomId}`)
	})
	games.delete(game.roomId)
}

const handleDisconnect = (socket) => {
	console.log('user disconnected')
	if (waitingPlayer == socket) {
		waitingPlayer = undefined
	}
	if (socket.currentRoom && games.has(socket.currentRoom)) {
		console.log("Deleting room ", socket.currentRoom)
		var curPlayers = games.get(socket.currentRoom).players
		curPlayers.forEach((playerSocket) => {
			playerSocket.leave(`room${socket.currentRoom}`)
			playerSocket.emit('leave room')
		})
		games.delete(socket.currentRoom)
	}
}

io.on('connection', (socket) => {
	console.log('a user connected')

	socket.on('join game', (vsCPU) => {
		console.log("new request to join game!")
		handleJoinRoom(socket)
	})

	socket.on('join cpu game', () => {
		console.log("new request to join cpu game!")
		handleJoinCPURoom(socket)
	})

	socket.on('select', (x, y, isCircle) => {
		handleSelect(socket, x, y, isCircle)
	})

	socket.on('disconnect', () => {
		handleDisconnect(socket)
	})
})

server.listen(app.get("port"), () => {
	console.log("Node app started on port %s", app.get("port"));
});
