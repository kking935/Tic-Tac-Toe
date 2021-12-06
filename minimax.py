class Game:
    def __init__(self, width=3):
        self.width = width
        self.board = [[''] * width for y in range(width)]

    def placeShape(self, x, y, shape):
        if x < 0 or y < 0 or x >= self.width or y >= self.width:
            print("ERROR: Failed to place shape due to invalid coordinates", x, y)
            return

        if not self.board[y][x] == '':
            print("ERROR: Failed to place shape because space already occupied", x, y)
            return

        self.board[y][x] = shape

    def checkRow(self, x, y, slope):
        shape = self.board[y][x]
        if shape == '':
            return ''
        
        x += slope[0]
        y += slope[1]

        while x >= 0 and y >= 0 and x < self.width and y < self.width:
            if not self.board[y][x] == shape:
                return ''
            x += slope[0]
            y += slope[1]
        
        return shape

    def checkWinner(self):
        # check rows
        for y in range(self.width):
            shape = self.checkRow(0, y, [1, 0])
            if not shape == '':
                return shape

        # check columns
        for x in range(self.width):
            shape = self.checkRow(x, 0, [0, 1])
            if not shape == '':
                return shape

        # check diagonals
        shape = self.checkRow(0, 0, [1, 1])
        if not shape == '':
            return shape
        
        shape = self.checkRow(0, self.width - 1, [1, -1])
        if not shape == '':
            return shape
        
        return ''
                
    def printBoard(self):
        for y in range(self.width):
            print(self.board[y])



