let socket = io();

let shape = ''

const joinGame = (vsCPU) => {
	let name = document.getElementById('player-name').value
	if (!name) {
		name = "Anon"
	}

	console.log("requesting to join room")
	document.getElementById('restart-banner').classList = 'invisible'
	
	socket.emit('join game', name, vsCPU)

	document.getElementById('lobby').classList = 'actionScreen invisible'
	document.getElementById('game').classList = 'invisible'
	document.getElementById('waiting').classList = 'actionScreen visible'
}

const handleSetShape = (isCircle) => {
	if (isCircle) {
		shape = 'O'
	}
	else {
		shape = 'X'
	}
	console.log("Shape is ", shape)
}

const updateTurnStatus = (turn) => {
	let message = ''
	if ((turn && shape == 'O') || (!turn && shape == 'X')) {
		console.log('your turn')
		message = 'Your Turn'
	}
	else {
		message = 'Opponents Turn'
	}
	document.getElementById("status-bar").innerHTML = message
}

const updateWinnerStatus = (winner) => {
	let message = ''
	if ((winner == 1 && shape == 'O') || (winner == -1 && shape == 'X')) {
		message = 'You Win!'
	}
	else if (winner == 0) {
		message = 'You Tie!'
	}
	else {
		message = 'You Lose!'
	}
	document.getElementById("status-bar").innerHTML = message
}

const handleUpdateBoard = (board) => {
	console.log(board)
	for (y = 0; y < 3; y++) {
		for (x = 0; x < 3; x++) {
			if (board[y][x] == 0) {
				document.getElementById(`cell-${x}${y}`).innerHTML = "O"
			}
			else if (board[y][x] == 1) {
				document.getElementById(`cell-${x}${y}`).innerHTML = "X"
			}
			else {
				document.getElementById(`cell-${x}${y}`).innerHTML = ""
			}
		}
	}
}

socket.on("start game", (board, turn, isCircle, oppName) => {
	console.log('is circle', isCircle)
	handleSetShape(isCircle)
	document.getElementById('waiting').classList = 'actionScreen invisible'
	document.getElementById('restart-banner').classList = 'invisible'
	document.getElementById('game').classList = 'visible'
	document.getElementById("oppName").innerHTML = 'VS ' + oppName
	handleUpdateBoard(board)
	updateTurnStatus(turn)
})

socket.on('update board', (board, turn) => {
	handleUpdateBoard(board)
	updateTurnStatus(turn)
})

socket.on("game over", (board, winner) => {
	console.log(winner, ' won the game')
	handleUpdateBoard(board)
	updateWinnerStatus(winner)
	document.getElementById('restart-banner').classList = 'visible'
	// document.getElementById('game').classList = 'invisible'
	// document.getElementById('lobby').classList = 'actionScreen visible'
})

socket.on("leave room", () => {
	console.log("the other player disconnected")
	document.getElementById('game').classList = 'invisible'
	document.getElementById('lobby').classList = 'actionScreen visible'
	document.getElementById('player-name').classList = 'invisible'
	document.getElementById('left-message').classList = 'visible'
})

socket.on("disconnect", () => {
	console.log("the player disconnected")
	document.getElementById('game').classList = 'invisible'
	document.getElementById('lobby').classList = 'actionScreen visible'
})

function playTile(x, y) {
	socket.emit('select', {x, y})
}

function playTile0() {
	playTile(0, 0)
}

function playTile1() {
	playTile(1, 0)
}

function playTile2() {
	playTile(2, 0)
}

function playTile3() {
	playTile(0, 1)
}

function playTile4() {
	playTile(1, 1)
}

function playTile5() {
	playTile(2, 1)
}

function playTile6() {
	playTile(0, 2)
}

function playTile7() {
	playTile(1, 2)
}

function playTile8() {
	playTile(2, 2)
}