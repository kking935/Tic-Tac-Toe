var socket = io();

var shape = ''
var turn = true

const getAvailableMoves = (board) => {
	var availableMoves = []
	for (var row = 0; row < board.length; row++) {
		for (var col = 0; col < board[0].length; col++) {
			if (board[row][col] == -1) {
				availableMoves.push({x:col, y:row})
			}
		}
	}
	return availableMoves
}

/**
 * Returns the winner, if there is one
 * @param {the current state of the board} board 
 * @returns 1 if O won, -1 if X won, or 0 if no winner
 */
const getWinner = (board) => {
	for (var row = 0; row < board.length; row++) {
		if (board[row][0] != -1) {
			var allMatch = true
			for (var col = 1; col < board[0].length; col++) {
				if (board[row][col] != board[row][0]) {
					allMatch = false
					break
				}
			}
			if (allMatch) {
				if (board[row][0] == 0) {
					return 1
				}
				else {
					return -1
				}
			}
		}
	}
	for (var col = 0; col < board[0].length; col++) {
		if (board[0][col] != -1) {
			var allMatch = true
			for (var row = 1; row < board.length; row++) {
				if (board[row][col] != board[0][col]) {
					allMatch = false
					break
				}
			}
			if (allMatch) {
				if (board[0][col] == 0) {
					return 1
				}
				else {
					return -1
				}
			}
		}
	}
	if (board[0][0] != -1 && board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
		if (board[0][0] == 0) {
			return 1
		}
		else {
			return -1
		}
	}
	if (board[0][2] != -1 && board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
		if (board[0][2] == 0) {
			return 1
		}
		else {
			return -1
		}
	}

	return 0
}

const createMove = (currentBoard, move, shape) => {
	var value = shape == 'O' ? 0 : 1
	var newBoard = []
	for (var row = 0; row < currentBoard.length; row++) {
		newRow = []
		for (var col = 0; col < currentBoard[0].length; col++) {
			newRow.push(currentBoard[row][col])
		}
		newBoard.push(newRow)
	}
	newBoard[move.y][move.x] = value
	return newBoard
}

const getBestMove = (board, takeMin) => {
	var winner = getWinner(board)
	if (winner != 0) {
		return winner
	}
	var availableMoves = getAvailableMoves()
	
	outcomes = []
	var min = Number.MAX_SAFE_INTEGER
	var max = Number.MIN_SAFE_INTEGER

	availableMoves.forEach((move) => {
		var tempBoard = createMove(board, move, shape)
		var tempCost = getBestMove(tempBoard, !takeMin)

		outcomes.push({move, createMove(board, move, shape)})
	})
}

socket.on("set shape", (isCircle) => {
	if (isCircle) {
		shape = 'O'
		turn = false
	}
	else {
		shape = 'X'
	}
})

const updateStatus = () => {
	var message = ''
	if (turn) {
		console.log('your turn')
		message = 'Your Turn'
	}
	else {
		message = 'Opponents Turn'
	}
	document.getElementById("status-bar").innerHTML = message
}

socket.on('update board', (board) => {
	console.log(board)
	turn = !turn
	updateStatus()
	for (y = 0; y < 3; y++) {
		for (x = 0; x < 3; x++) {
			if (board[y][x] != -1) {
				if (board[y][x] == 0) {
					document.getElementById(`cell-${x}${y}`).innerHTML = "O"
				}
				else {
					document.getElementById(`cell-${x}${y}`).innerHTML = "X"
				}
				console.log('updated cell ', x, y, ' to value ', board[y][x])
			}
		}
	}
})

function playTile(x, y) {
	socket.emit('select', x, y, shape == 'O')
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