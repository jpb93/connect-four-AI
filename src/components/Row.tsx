import React from 'react';
import Piece from './Piece'
import './Row.css'

type RowProps = {
  boardRow: string[];
}

const Row = ({ boardRow }: RowProps) => {
  return (
    <>
      {/* what to add for key? index not unique...*/}
      {boardRow.map((piece, index) => <Piece key={index} piece={piece}/>)}
    </>
  );
}

export default Row;