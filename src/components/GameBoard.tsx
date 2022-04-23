import React from 'react';
import { useState, useEffect, MouseEvent } from 'react';
import { winningMove } from '../utils/gameUtils';
import { AIMove } from '../utils/AI';

import './GameBoard.css';
import Row from './Row';

type Board = string[][];

const GameBoard = () => {
  const numCols: number = 7;
  const numRows: number = 6;
  const maxDepth: number = 7;
  const playerPiece: string = '1';
  const AIPiece: string = '2';
  const emptyPiece: string = '0';
  
  // would be good to move all of this state to a single useReducer
  // 2D array of character '0' representing empty location
  const [ mainBoard, setMainBoard ] = useState(
    Array.from(Array(numRows), () => Array(numCols).fill(emptyPiece))
  );
  
  // need a better name... something capturing "next index to drop"
  const [ openCols, setOpenCols ] = useState(Array(numCols).fill(numRows - 1));
  const [ gameOver, setGameOver ] = useState(false);
  const [ winnerText, setWinnerText ] = useState('');
  const [ difficulty, setDifficulty ] = useState(maxDepth);
  const [ isPlayerTurn, setIsPlayerTurn ] = useState(true);

  // hacky way to map clicks to a column index until I figure out typescript react events
  const getSelectedColumn = ( rawXCoords: number ): number => {
    // these are recalculated onclick because width could change after first render
    const boardWidth: number = window.innerWidth / 2;
    const pieceWidth: number = boardWidth / numCols;
    const boardMargins: number = boardWidth / 2;
    const selectedColumn: number = Math.floor(
      (rawXCoords - boardMargins) / pieceWidth
    );
    
    return selectedColumn;
  }

  const hasOpenCols = (column: number): boolean => openCols[column] > -1;

  // this function name is inaccurate now. should be something like "play round"
  const dropPiece = (event: MouseEvent): void => {
    const selectedCol: number = getSelectedColumn(event.pageX);

    if (hasOpenCols(selectedCol) && !gameOver) {
      const newBoard: Board = mainBoard.map(row => [...row]);
      const newOpenCols: number[] = [...openCols];
      const selectedRow: number = newOpenCols[selectedCol];

      newOpenCols[selectedCol] -= 1;
      newBoard[selectedRow][selectedCol] = playerPiece;
      
      setMainBoard(newBoard);
      setOpenCols(newOpenCols);

      if (winningMove(newBoard, playerPiece)) {
        setWinnerText(`Player wins!`);
        setGameOver(true);
        return;
      }
      setIsPlayerTurn(false);
    }
  }

  const resetBoard = (): void => {
    const blankBoard = Array.from(Array(numRows), () => Array(numCols).fill(emptyPiece));
    const blankOpenCols = Array(numCols).fill(numRows - 1);
    const blankMessage = '';

    setMainBoard(blankBoard);
    setOpenCols(blankOpenCols);
    setWinnerText(blankMessage);
    setGameOver(false);
  }

  const gameRows = mainBoard.map((row, index) => {
    return <Row boardRow={row} key={`row${index + 1}`}/>
  });

  useEffect(() => {
    const calculateAIMove = (): void => {
     
    const AIBoard: Board = mainBoard.map(row => [...row]);
    const AIColumn = AIMove(difficulty, AIBoard);
    const AIOpenCols: number[] = [...openCols];
    const AIRow: number = AIOpenCols[AIColumn];

    AIOpenCols[AIColumn] -= 1;
    AIBoard[AIRow][AIColumn] = AIPiece;

    setMainBoard(AIBoard);
    setOpenCols(AIOpenCols);

    if (winningMove(AIBoard, AIPiece)) {
      setWinnerText(`Computer wins!`);
      setGameOver(true);
      return;
    }
  }
    if (!isPlayerTurn) {
      calculateAIMove();
      setIsPlayerTurn(true);
    }
  }, [isPlayerTurn, difficulty, mainBoard, openCols])
 
  return (
    <main>
      <div id="game-board" onClick={dropPiece}>
        {gameRows}
      </div>
      <div className='winning-text'>
        {winnerText}
      </div>
      {/* //TODO make this its own component that turns visible/invisible  */}
      <button className='btn reset-btn' onClick={resetBoard}>
        Reset
      </button>
    </main>
  );
}

export default GameBoard;