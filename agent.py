from minimax import Game

class Agent:
    def __init__(self, game, shape):
        self.game = game
        self.shape = shape

    def getOpenSpaces(self):
        spaces = []
        for y in range(len(self.game.board)):
            for x in range(len(self.game.board[0])):
                if self.game.board[y][x] == '':
                    spaces.append((x, y))
        return spaces

    def getBestMove(self, getMax, depth):
        winner = self.game.checkWinner()
        if not winner == '':
            print("Found a winner", winner)
            return (1 / depth if winner == self.shape else -1 / depth, None)

        spaces = self.getOpenSpaces()
        if len(spaces) == 0:
            print("No more open spaces and no winner")
            return (0, None)

        bestPoints = float('-inf') if getMax else float('inf')
        bestMove = None
        for x, y in spaces:
            # print('Checking move', x, y)
            self.game.board[y][x] = self.shape
            # self.game.printBoard()
            possiblePoints, possibleMove = self.getBestMove(not getMax, depth + 1)
            # print('points', possiblePoints)
            if (getMax and possiblePoints > bestPoints) or (not getMax and possiblePoints < bestPoints):
                # print("FOUND A NEW BEST", (x, y))
                bestPoints = possiblePoints
                bestMove = (x, y)
            self.game.board[y][x] = ''
            # print('updating board back to previous state')
            # self.game.printBoard()

        return (bestPoints, bestMove)
    

# width = 3

# game = Game(width)
# game.board = [
#     ['O','X','X'],
#     ['X','O','X'],
#     ['','O','']
# ]
# game.printBoard()

# agent = Agent(game, 'X')
# print(agent.getBestMove(True, 0))