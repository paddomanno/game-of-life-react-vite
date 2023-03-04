import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
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
  const [gameInterval, setGameInterval] = useState<number>(100);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const runningRef = useRef(isRunning);
  runningRef.current = isRunning;
  const gameIntervalRef = useRef(gameInterval);
  gameIntervalRef.current = gameInterval;

  useEffect(() => {
    setLivingCells(makeCells());
  }, [board]);

  const makeCells = useCallback(() => {
    let cells = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (board[y][x]) {
          cells.push({ x, y });
        }
      }
    }
    return cells;
  }, [board]);

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setBoard((prevBoard) => {
      let newBoard = makeEmptyBoard();

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let neighbors = countNeighbors(prevBoard, x, y);
          if (prevBoard[y][x]) {
            if (neighbors === 2 || neighbors === 3) {
              newBoard[y][x] = true;
            } else {
              newBoard[y][x] = false;
            }
          } else {
            if (!prevBoard[y][x] && neighbors === 3) {
              newBoard[y][x] = true;
            }
          }
        }
      }
      return newBoard;
    });
    setTimeout(runSimulation, gameIntervalRef.current);
  }, []);

  function makeEmptyBoard() {
    const board = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false)) as boolean[][];
    return board;
  }

  function countNeighbors(board: boolean[][], x: number, y: number) {
    let neighbors = 0;
    const dirs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
    ];
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      let y1 = y + dir[0];
      let x1 = x + dir[1];

      if (
        x1 >= 0 &&
        x1 < cols &&
        y1 >= 0 &&
        y1 < rows &&
        board[y1][x1]
      ) {
        neighbors++;
      }
    }

    return neighbors;
  }

  function handleClick(event: React.MouseEvent) {
    // add new cells on click
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
      setLivingCells(makeCells());
    }
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

  function runGame() {
    setIsRunning(true);
    runningRef.current = true;
    runSimulation();
  }
  function stopGame() {
    setIsRunning(false);
  }

  function handleIntervalChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const newValue = parseInt(event.target.value, 10);
    setGameInterval(newValue);
    gameIntervalRef.current = newValue;
  }

  function handleClickRandom() {
    const board = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false)) as boolean[][];

    for (let y = 0; y < rows; y++) {
      board[y] = [];
      for (let x = 0; x < cols; x++) {
        board[y][x] = Math.random() > 0.7 ? true : false;
      }
    }
    setBoard(board);
  }

  function handleClickClear() {
    const board = makeEmptyBoard();
    setBoard(board);
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
      <div className="controls">
        <span>Update every</span>
        <input
          type="number"
          value={gameInterval}
          onChange={handleIntervalChange}
        />
        <span>msec</span>
        {isRunning ? (
          <button className="button" onClick={stopGame}>
            Stop
          </button>
        ) : (
          <button className="button" onClick={runGame}>
            Run
          </button>
        )}
        <button onClick={handleClickRandom}>random</button>
        <button onClick={handleClickClear}>clear</button>
      </div>
    </div>
  );
}

export default Game;
