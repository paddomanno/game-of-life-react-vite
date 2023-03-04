import React from 'react';

const CELL_SIZE = 20;

type CellProps = {
  x: number;
  y: number;
};

function Cell(props: CellProps) {
  const { x, y } = props;
  return (
    <div
      className="cell"
      style={{
        left: `${CELL_SIZE * x + 1}px`,
        top: `${CELL_SIZE * y + 1}px`,
        width: `${CELL_SIZE - 1}px`,
        height: `${CELL_SIZE - 1}px`,
      }}
    />
  );
}

export default Cell;
