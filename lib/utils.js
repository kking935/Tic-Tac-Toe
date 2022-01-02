/**
 * Returns the winner, if there is one
 * @param {the current state of the board} board 
 * @returns 1 if O won, -1 if X won, or 0 if no winner
 */
 const getWinner = (board) => {
	for (let row = 0; row < board.length; row++) {
		if (board[row][0] != -1) {
			let allMatch = true
			for (let col = 1; col < board[0].length; col++) {
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
	for (let col = 0; col < board[0].length; col++) {
		if (board[0][col] != -1) {
			let allMatch = true
			for (let row = 1; row < board.length; row++) {
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
	let availableMoves = []
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[0].length; col++) {
			if (board[row][col] == -1) {
				availableMoves.push({x:col, y:row})
			}
		}
	}
	return availableMoves
}

module.exports = {
    getWinner, getAvailableMoves
}