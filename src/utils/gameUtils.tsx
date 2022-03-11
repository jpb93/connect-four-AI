export const winningMove = (board: string[][], piece: string): boolean => {
  const numRows = board.length; // height
  const numCols = board[0].length; // width
  const midPoint = Math.floor(numCols / 2);

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (board[row][col] === '0') {
        continue;
      }

      if (col + midPoint < numCols &&
          piece === board[row][col] &&
          piece === board[row][col + 1] && // look right
          piece === board[row][col + 2] &&
          piece === board[row][col + 3])
          return true;
          
      if (row + midPoint < numRows) {
        if (piece === board[row][col] &&
            piece === board[row + 1][col] && // look up
            piece === board[row + 2][col] &&
            piece === board[row + 3][col]) 
            return true;
            
        if (col + midPoint < numCols &&
            piece === board[row][col] &&
            piece === board[row + 1][col + 1] && // look up & right
            piece === board[row + 2][col + 2] &&
            piece === board[row + 3][col + 3])
            return true;
        if (col - midPoint >= 0 &&
            piece === board[row][col] &&
            piece === board[row + 1][col - 1] && // look up & left
            piece === board[row + 2][col - 2] &&
            piece === board[row + 3][col - 3])
            return true;
      } 
    }
  }
  return false;
}