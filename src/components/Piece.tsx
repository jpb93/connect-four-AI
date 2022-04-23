import React from 'react';
import './Piece.css'

type PieceProps = {
  piece: string;
}

const Piece = ({ piece }: PieceProps) => {

  const currentPiece: string = piece === '0'
    ? 'no-piece'
    : piece === '1'
      ? 'player1'
      : 'player2';

  return (
    <div className='piece-container'>
      <div className={`board-piece ${currentPiece}`}></div>
    </div>
  );
}

export default Piece;