const { getWinner, getAvailableMoves } = require('./utils');

const getBestMove = (board, takeMax, depth) => {
	const winner = getWinner(board)
	const spaces = getAvailableMoves(board)
	if (winner != 0 || spaces.length == 0) {
        return {move: undefined, points: winner, depth}
	}

	let bestOutcome = {
		move: spaces[0],
		points: takeMax ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER,
		depth: Number.MAX_SAFE_INTEGER
	}

	spaces.forEach((move) => {
		board[move.y][move.x] = takeMax ? 0 : 1
		let currentOutcome = getBestMove(board, !takeMax, depth + 1)
		if ((takeMax && currentOutcome.points > bestOutcome.points) 
			|| (!takeMax && currentOutcome.points < bestOutcome.points)
			|| (currentOutcome.points == bestOutcome.points && currentOutcome.depth < bestOutcome.depth)) {
			bestOutcome = {...currentOutcome, move}
		}
		board[move.y][move.x] = -1
	})

	return bestOutcome
}

module.exports = {
    getBestMove
}