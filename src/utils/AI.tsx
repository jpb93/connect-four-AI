import { winningMove } from './gameUtils';

type Board = string[][];

export const AIMove = (
  difficulty: number, board: Board
): number => {

  const AIColumn: number = decisionGraph(
    board, difficulty, Number.MIN_VALUE, Number.MAX_VALUE, true
  )[0];

  return AIColumn;
}

// might be unnecessary 
const simulateDropPiece = (
  board: Board, row: number, col: number, piece: string
): void => {
  board[row][col] = piece;
}

const ratingDistribution = (row: number, col: number): number => {
  // priority - biases the AI towards the center. numbers can be tweaked
  const prio: number = 13;
  const distrubution: number[][] = [
    [prio - 10, prio - 9, prio - 8, prio - 6, prio - 8, prio - 9, prio - 10],
    [prio - 9 , prio - 7, prio - 5, prio - 3, prio - 5, prio - 7,  prio - 9],
    [prio - 8 , prio - 5, prio - 2, prio,     prio - 2, prio - 5,  prio - 8],
    [prio - 8 , prio - 5, prio - 2, prio,     prio - 2, prio - 5,  prio - 8],
    [prio - 9 , prio - 7, prio - 5, prio - 3, prio - 5, prio - 7 , prio - 9],
    [prio - 10, prio - 9, prio - 8, prio - 6, prio - 8, prio - 9,  prio - 10],
  ];

  return distrubution[row][col];
}

const rateCurrentPosition = (board: Board): number => {
  const numRows = board.length;
  const numCols = board[0].length;
  const playerPiece = '1';
  const AIPiece = '2';
  const weight = 138;
  let rating: number = 0;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (board[row][col] === AIPiece) 
        rating += ratingDistribution(row, col);
      else if (board[row][col] === playerPiece)
        rating -= ratingDistribution(row, col);
    }
  }

  return rating + weight;
}

const getOpenPositions = (board: Board): number[] => {
  const topRow = board[0];
  const openCols = topRow.map((num, index) => num === '0' ? index : -1)
                            .filter(num => num > -1);

  return openCols; 
}

const getOpenRowIndex = (board: Board, col: number): number => {
  const numRows: number = board.length;
  for (let row = numRows - 1; row >= 0; row--){
    if (board[row][col] === '0')
      return row;
  }

  return -1;
}

const endOfGraph = (board: Board): boolean => {
  const playerPiece: string = '1';
  const AIPiece: string = '2';
  return winningMove(board, playerPiece) || winningMove(board, AIPiece) || (!getOpenPositions(board))
}

const copyAndDropPiece = (
  board: Board, column: number, piece: string
): Board => {
  const copyBoard = board.map(row => [...row]);
  const row = getOpenRowIndex(copyBoard, column);
  simulateDropPiece(copyBoard, row, column, piece);
  return copyBoard;
}

const decisionGraph = (
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean
): number[] => {

  const playerPiece: string = '1';
  const AIPiece: string = '2';
  const openColumns: number[] = getOpenPositions(board);

  if (depth === 0 || endOfGraph(board)) {
    if (endOfGraph(board)) {
      if (winningMove(board, AIPiece))
        return [0, 999999999];
      else if (winningMove(board, playerPiece))
        return [0, -999999999];
      else
        return [0, 0];
    } else {
      return [0, rateCurrentPosition(board)];
    }
  }

  if (isMaximizingPlayer) {
    let value: number = Number.MIN_VALUE;
    let bestColumn: number = openColumns[0];

    for (const col of openColumns) {
      const copyBoard: Board = copyAndDropPiece(board, col, AIPiece);
      const newScore: number = decisionGraph(copyBoard, depth - 1, alpha, beta, false)[1];

      if (newScore > value) {
        value = newScore;
        bestColumn = col;
      }

      alpha = Math.max(value, alpha);
      if (alpha >= beta) {
        break;
      }
    }

    return [bestColumn, value];

  } else {
    let value:number = Number.MAX_VALUE;
    let bestColumn = openColumns[0];

    for (const col of openColumns) {
      const copyBoard: Board = copyAndDropPiece(board, col, playerPiece);
      const newScore: number = decisionGraph(copyBoard, depth - 1, alpha, beta, true)[1];
    
      if (newScore < value) {
        value = newScore;
        bestColumn = col;
      }

      beta = Math.min(beta, value);
      if (alpha >= beta) {
        break;
      }

    }
    return [bestColumn, value];
  }
}

