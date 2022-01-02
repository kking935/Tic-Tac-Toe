let socket = io();

let shape = ''

const joinGame = (vsCPU) => {
	console.log("requesting to join room")

	socket.emit('join game', vsCPU)

	document.getElementById('lobby').classList = 'actionScreen invisible'
	document.getElementById('quit').classList = 'actionScreen invisible'
	document.getElementById('game').classList = 'invisible'
	document.getElementById('waiting').classList = 'actionScreen visible'
	document.getElementById('restart-button-human').classList = 'actionButton invisible'
	document.getElementById('restart-button-cpu').classList = 'actionButton invisible'
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

socket.on("start game", (board, turn, isCircle) => {
	console.log('is circle', isCircle)
	handleSetShape(isCircle)
	document.getElementById('waiting').classList = 'actionScreen invisible'
	document.getElementById('game').classList = 'visible'
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
	// document.getElementById('game').classList = 'invisible'
	// document.getElementById('quit').classList = 'actionScreen visible'
	document.getElementById('restart-button-human').classList = 'actionButton visible'
	document.getElementById('restart-button-cpu').classList = 'actionButton visible'
})

socket.on("leave room", () => {
	console.log("the other player disconnected")
	document.getElementById('game').classList = 'invisible'
	document.getElementById('quit').classList = 'actionScreen visible'
})

socket.on("disconnect", () => {
	console.log("the player disconnected")
	document.getElementById('game').classList = 'invisible'
	document.getElementById('quit').classList = 'actionScreen visible'
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