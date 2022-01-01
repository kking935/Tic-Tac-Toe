from game import Game
from agent import Agent

game = Game()
agent = Agent(game, 'X', 'O')

turn = True

print("Starting game...")

while True:
    print("\nCurrent Board State:")
    game.printBoard()
    if turn:
        print("\nYour turn!")
        x = int(input('Enter the x coordinate: '))
        y = int(input('Enter the y coordinate: '))
        game.placeShape(x, y, 'O')
    else:
        print("\nAI is searching for optimal move...")
        best_move, best_score = agent.getBestMove(True)
        game.placeShape(best_move[0], best_move[1], 'X')

    turn = not turn

    winner = game.checkWinner()
    if not winner == ' ':
        print("\nThe winner is ", winner)
        game.printBoard()
        break
    elif len(agent.getOpenSpaces()) == 0:
        print("\nIt is a tie game")
        game.printBoard()
        break
    