from game import Game

class Agent:
    def __init__(self, game, shape, opponent):
        self.game = game
        self.shape = shape
        self.opp_shape = opponent

    def getOpenSpaces(self):
        spaces = []
        for y in range(len(self.game.board)):
            for x in range(len(self.game.board[0])):
                if self.game.board[y][x] == ' ':
                    spaces.append((x, y))
        return spaces

    def getBestMove(self, maxi_player):
        winner = self.game.checkWinner()
        spaces = self.getOpenSpaces()
        if not winner == ' ' or spaces == []:
            score = 0
            if winner == self.shape:
                score = 1
            elif winner == self.opp_shape:
                score = -1
            return (None, score)

        best_move = spaces[0]
        best_eval = float('-inf') if maxi_player else float('inf')

        for x, y in spaces:
            self.game.board[y][x] = self.shape if maxi_player else self.opp_shape
            current_move, current_eval = self.getBestMove(not maxi_player)
            if (maxi_player and current_eval > best_eval) or (not maxi_player and current_eval < best_eval):
                best_eval = current_eval
                best_move = (x, y)
            self.game.board[y][x] = ' '

        return (best_move, best_eval)

# width = 3
# game = Game(width)
# game.board = [
#     [' ', 'X', 'O'],
#     ['O', 'X', ' '],
#     [' ', ' ', ' ']
# ]

# game.printBoard()

# agent = Agent(game, 'X', 'O')
# print(agent.getBestMove(True))
