const io = require("socket.io-client");
const { getBestMove } = require('./agent');
const { getWinner, getAvailableMoves } = require('./utils');

const createBoard = () => {
	return [
		[-1, -1, -1],
		[-1, -1, -1],
		[-1, -1, -1]
	]
}

let games = new Map()
let waitingPlayer = undefined

const createServer = (io) => {
	const handleJoinRoom = (socket) => {
		console.log('inside join room')
		socket.vsCPU = false

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
		waitingPlayer.emit("start game", games.get(currentRoom).board, games.get(currentRoom).turn, true, socket.username)
		socket.emit("start game", games.get(currentRoom).board, games.get(currentRoom).turn, false, waitingPlayer.username)
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
		socket.emit("start game", games.get(currentRoom).board, games.get(currentRoom).turn, true, "CPU")
	}
	
	const handleMove = async (move, roomId, isCircle) => {
		if (!roomId || !games.has(roomId)) {
			console.log("Could not select move because board could not be found")
			return false
		}
		let curGame = games.get(roomId)
		if (curGame.turn != isCircle) {
			console.log("A player tried to play out of turn, ignoring...")
			return false
		}
		if (curGame.board[move.y][move.x] != -1) {
			console.log("player tried to select already selected tile")
			return false
		}
	
		curGame.board[move.y][move.x] = isCircle ? 0 : 1
		curGame.turn = !curGame.turn
	
		console.log(`${isCircle ? 'Human' : 'Computer'} is playing and the turn is`, games.get(roomId).turn)
		games.set(roomId, curGame)
		console.log(`${isCircle ? 'Human' : 'Computer'} is playing and the new turn is`, games.get(roomId).turn)
	
		const winner = getWinner(curGame.board)
		const spaces = getAvailableMoves(curGame.board)
		if (winner != 0 || spaces.length == 0) {
			console.log("Ending the game...")
			handleGameOver(curGame, winner)
			return false
		}
	
		io.to(`room${roomId}`).emit('update board', curGame.board, curGame.turn)
		return true
	}
	
	const handleSelect = async (move, roomId, isCircle, vsCPU) => {
		if (await handleMove(move, roomId, isCircle) && vsCPU) {
			const bestOption = getBestMove(games.get(roomId).board, false, true)
			setTimeout(async () => {
				await handleMove(bestOption.move, roomId, false)
			}, 1000)
		}
	}
	
	const handleGameOver = (game, winner) => {
		console.log("Sending disconnect signal")
		io.to(`room${game.roomId}`).emit('game over', game.board, winner)
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
			let curPlayers = games.get(socket.currentRoom).players
			curPlayers.forEach((playerSocket) => {
				playerSocket.leave(`room${socket.currentRoom}`)
				playerSocket.emit('leave room')
			})
			games.delete(socket.currentRoom)
		}
	}
	
	io.on('connection', (socket) => {
		console.log('a user connected')
	
		socket.on('join game', (username, vsCPU) => {
			socket.username = username
			if (vsCPU) {
				console.log("new request to join cpu game!")
				handleJoinCPURoom(socket)
			}
			else {
				console.log("new request to join game!")
				handleJoinRoom(socket)
			}
		})
	
		socket.on('select', async (move) => {
			await handleSelect(move, socket.currentRoom, socket.isCircle, socket.vsCPU)
		})
	
		socket.on('disconnect', () => {
			handleDisconnect(socket)
		})
	})
}

module.exports = {
    createServer
}