/**
 * Returns the winner, if there is one
 * @param {the current state of the board} board 
 * @returns 1 if O won, -1 if X won, or 0 if no winner
 */
const getWinner = (board) => {
    console.log("inside get winner", board)
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
	board[move.y][move.x] = shape == 'O' ? 0 : 1
}

const getBestMove = (board, isCircle, takeMin) => {
    console.log(board)
    const winner = getWinner(board)
    if (winner != 0) {
        return {move: undefined, points: winner}
    }

	const availableMoves = getAvailableMoves()
    if (availableMoves.length < 1) {
        return {move: undefined, points: 0}
    }

	outcomes = []
	var bestMin = Number.MAX_SAFE_INTEGER
	var bestMax = Number.MIN_SAFE_INTEGER
    var bestMove = availableMoves[0]

	availableMoves.forEach((move) => {
		var tempBoard = copyBoard(board)
        placeMove(tempBoard, move, isCircle ? 'O' : 'X')
		var tempCost = getBestMove(tempBoard, isCircle, !takeMin)
        if (takeMin && tempCost < bestMin) {
            bestMin = tempCost
            bestMove = move
        }
        else if (!takeMin && tempCost > bestMax) {
            bestMax = tempCost
            bestMove = move
        }
	})

    if (takeMin) {
        return {move: bestMove, points: bestMin}
    }
    else {
        return {move: bestMove, points: bestMax}
    }
}

module.exports = {
    getWinner, getBestMove
}