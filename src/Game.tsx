import React, { useState, useEffect, useRef } from 'react';
import Cell from './Cell';
import './Game.css';

const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

function Game() {
  const rows = HEIGHT / CELL_SIZE;
  const cols = WIDTH / CELL_SIZE;
  const [board, setBoard] = useState<boolean[][]>(makeEmptyBoard());
  const [livingCells, setLivingCells] = useState<
    { x: number; y: number }[]
  >([]);
  const boardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLivingCells(makeCells());
  }, [board]);

  function makeEmptyBoard() {
    const board = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false)) as boolean[][];

    for (let y = 0; y < rows; y++) {
      board[y] = [];
      for (let x = 0; x < cols; x++) {
        board[y][x] = false;
      }
    }
    return board;
  }

  function makeCells() {
    let cells = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (board[y][x]) {
          cells.push({ x, y });
        }
      }
    }
    return cells;
  }

  function getElementOffset() {
    if (boardRef.current === null) {
      return;
    }
    const rect = boardRef.current.getBoundingClientRect();
    const doc = document.documentElement;
    return {
      x: rect.left + window.pageXOffset - doc.clientLeft,
      y: rect.top + window.pageYOffset - doc.clientTop,
    };
  }

  function handleClick(event: React.MouseEvent) {
    if (!boardRef.current) {
      return;
    }

    const elemOffset = getElementOffset();
    if (!elemOffset) {
      return;
    }
    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;
    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);
    if (x >= 0 && x <= cols && y >= 0 && y <= rows) {
      const newBoard = [...board];
      newBoard[y][x] = !newBoard[y][x];
      setBoard(newBoard);
    }
  }

  return (
    <div>
      <div
        className="board"
        style={{
          width: WIDTH,
          height: HEIGHT,
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
        }}
        onClick={handleClick}
        ref={boardRef}
      >
        {livingCells.map((cell) => (
          <Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} />
        ))}
      </div>
    </div>
  );
}

export default Game;
