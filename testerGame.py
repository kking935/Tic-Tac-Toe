from minimax import Game
from agent import Agent

game = Game()
agent = Agent(game, 'X')
while True:
    game.printBoard()
    x = int(input('Enter the x coordinate: '))
    y = int(input('Enter the y coordinate: '))

    game.placeShape(x, y, 'O')
    bestPoints, bestMove = agent.getBestMove(True, 0)
    bestX, bestY = bestMove
    game.placeShape(bestX, bestY, 'X')
    