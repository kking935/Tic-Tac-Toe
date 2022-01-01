const io = require("socket.io-client");
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

const copyBoard = (currentBoard) => {
	var newBoard = []
	for (var row = 0; row < currentBoard.length; row++) {
		newRow = []
		for (var col = 0; col < currentBoard[0].length; col++) {
			newRow.push(currentBoard[row][col])
		}
		newBoard.push(newRow)
	}
	return newBoard
}

const placeMove = (board, move, shape) => {
	board[move.y][move.x] = shape
}

const getBestMove = (board, takeMax) => {
	const winner = getWinner(board)
	const spaces = getAvailableMoves(board)
	if (winner != 0 || spaces.length == 0) {
        return {move: undefined, points: winner}
	}

	let best_move = spaces[0]
	let best_eval = takeMax ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER

	spaces.forEach((move) => {
        placeMove(board, move, takeMax ? 0 : 1)
		var currentOutcome = getBestMove(board, !takeMax)

		if ((takeMax && currentOutcome.points > best_eval) || (!takeMax && currentOutcome.points < best_eval)) {
			best_eval = currentOutcome.points
			best_move = move
		}

        placeMove(board, move, -1)
	})

	return {move: best_move, points: best_eval}
}

module.exports = {
    getWinner, getBestMove
}