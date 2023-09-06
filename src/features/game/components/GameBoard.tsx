import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { GRID_SIZE, NUM_MINES, TAP_DELAY } from "../../../constants/constants";
import MinesCounter from "./MinesCounter";

/**
 * Props for the Cell component.
 */
interface CellProps {
  isMine: boolean /**< Indicates if the cell contains a mine. */;
  isRevealed: boolean /**< Indicates if the cell is revealed. */;
  isFlagged: boolean /**< Indicates if the cell is flagged. */;
  adjacentMines: number /**< Number of adjacent mines. */;
  surroundingCells: {
    row: number;
    col: number;
  }[] /**< List of surrounding cells. */;
  handleClick: () => void /**< Callback for cell click. */;
  handleRightClick: (
    event: React.MouseEvent
  ) => void /**< Callback for right-click event. */;
}

/**
 * The Cell component represents a single cell in the Minesweeper game grid.
 * It displays its content based on whether it's revealed, flagged, or contains a mine.
 */
const Cell: React.FC<CellProps> = ({
  isMine,
  isRevealed,
  isFlagged,
  adjacentMines,
  handleClick,
  handleRightClick,
}) => {
  const cellContent = isRevealed
    ? isMine
      ? "💣"
      : adjacentMines
      ? adjacentMines
      : ""
    : isFlagged
    ? "🚩"
    : "";

  return (
    <Box
      onClick={handleClick}
      onContextMenu={handleRightClick}
      borderRadius="md"
      display="flex"
      alignItems="center"
      justifyContent="center"
      width={10}
      height={10}
      backgroundColor={isRevealed ? "transparent" : "gray.200"}
      fontSize="lg"
      borderWidth="3px"
      borderColor="gray.400"
      boxShadow={isRevealed ? "none" : "2px 2px 5px rgba(0, 0, 0, 0.2)"}
      transform={isRevealed ? "translateY(2px)" : "none"}
      transition="background-color 0.3s ease, transform 0.3s ease"
      _hover={{
        backgroundColor: isRevealed ? "#fff" : "#ddd",
        cursor: "pointer",
      }}
    >
      {cellContent}
    </Box>
  );
};

/**
 * Returns an array of surrounding cell positions given row and column.
 * @param {number} row - The row index.
 * @param {number} col - The column index.
 * @returns {Array} - An array of surrounding cell positions.
 */
const surroundingCells = (row: number, col: number) => {
  const surroundingCells = [];
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (
        newRow >= 0 &&
        newRow < GRID_SIZE.row &&
        newCol >= 0 &&
        newCol < GRID_SIZE.col
      ) {
        surroundingCells.push({ row: newRow, col: newCol });
      }
    }
  }
  return surroundingCells;
};

/**
 * Returns the number of adjacent mines for a given cell.
 * @param {number} row - The row index of the cell.
 * @param {number} col - The column index of the cell.
 * @param {Array} board - The game board represented as a 2D array of CellProps.
 * @returns {number} - The number of adjacent mines.
 */
const adjacentMines = (row: number, col: number, board: CellProps[][]) => {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (
        newRow >= 0 &&
        newRow < GRID_SIZE.row &&
        newCol >= 0 &&
        newCol < GRID_SIZE.col &&
        board[newRow][newCol].isMine
      ) {
        count++;
      }
    }
  }
  return count;
};

/**
 * Randomly places mines on the game board.
 * @param {number} numMines - The total number of mines to be placed.
 * @param {Array} board - The game board represented as a 2D array of CellProps.
 */
const setMines = (numMines: number, board: CellProps[][]) => {
  let minesPlaced = 0;
  while (minesPlaced < numMines) {
    const randomRow = Math.floor(Math.random() * board.length);
    const randomCol = Math.floor(Math.random() * board[0].length);
    if (!board[randomRow][randomCol].isMine) {
      board[randomRow][randomCol].isMine = true;
      minesPlaced++;
    }
  }
};

/**
 * The GameBoard component represents the main Minesweeper game board.
 * It manages game state, user interactions, and cell rendering.
 */
const GameBoard = () => {
  const [board, setBoard] = useState<CellProps[][]>([]);
  const [flagCount, setFlagCount] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [isGameStart, setIsGameStart] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);

  /**
   * Recursively reveals surrounding cells when an empty cell is clicked.
   * @param {Array} surrounding - The list of surrounding cell positions.
   */
  const recursiveSurroundCells = (
    surrounding: { row: number; col: number }[]
  ) => {
    surrounding.forEach((cell) => {
      if (
        !board[cell.row][cell.col].isFlagged &&
        !board[cell.row][cell.col].isMine &&
        !board[cell.row][cell.col].isRevealed
      ) {
        board[cell.row][cell.col].isRevealed = true;
        setRevealedCount((prev) => prev + 1);
        if (board[cell.row][cell.col].adjacentMines === 0) {
          recursiveSurroundCells(board[cell.row][cell.col].surroundingCells);
        }
      }
    });
  };

  /**
   * Handles left-click on a cell.
   * @param {number} row - The row index of the clicked cell.
   * @param {number} col - The column index of the clicked cell.
   */
  let clickCount = 0;
  const handleClick = (row: number, col: number) => {
    clickCount++;

    if (clickCount < 2) {
      setTimeout(() => {
        if (clickCount < 2) {
          revealedCell(row, col);
        }
        clickCount = 0;
      }, TAP_DELAY);
    } else {
      flagToggleSet(row, col);
    }
  };

  /**
   * Handles revealing a cell when left-clicked.
   *
   * @param {number} row - The row index of the clicked cell.
   * @param {number} col - The column index of the clicked cell.
   */
  const revealedCell = (row: number, col: number) => {
    const newBoard = [...board];
    const { isMine, isRevealed, isFlagged, adjacentMines, surroundingCells } =
      newBoard[row][col];

    if (isRevealed || isFlagged) return;

    newBoard[row][col] = {
      ...newBoard[row][col],
      isRevealed: true,
    };
    setRevealedCount((prev) => prev + 1);

    setIsGameStart(true);

    if (isMine) {
      setIsGameOver(true);
      newBoard.map((row) => row.map((cell) => (cell.isRevealed = true)));
    } else if (
      revealedCount ===
      GRID_SIZE.row * GRID_SIZE.col - NUM_MINES - 1
    ) {
      setIsGameWon(true);
      newBoard.map((row) =>
        row.map((cell) => {
          if (cell.isRevealed === false && cell.isFlagged === false) {
            cell.isFlagged = true;
            setFlagCount((prev) => prev + 1);
          }
        })
      );
    } else if (adjacentMines === 0) {
      recursiveSurroundCells(surroundingCells);
    }
    setBoard(newBoard);
  };

  /**
   * Handles Desktop right-click on a cell.
   *
   * @param {React.MouseEvent} event - The right-click event.
   * @param {number} row - The row index of the clicked cell.
   * @param {number} col - The column index of the clicked cell.
   */
  const handleDesktopRightClick = (
    event: React.MouseEvent,
    row: number,
    col: number
  ) => {
    event.preventDefault();
    flagToggleSet(row, col);
  };

  /**
   * Toggles the flag on a cell when right-clicked.
   *
   * @param {number} row - The row index of the clicked cell.
   * @param {number} col - The column index of the clicked cell.
   */
  const flagToggleSet = (row: number, col: number) => {
    if (!board[row][col].isRevealed) {
      const newBoard = [...board];

      if (newBoard[row][col].isFlagged) {
        setFlagCount((prev) => prev - 1);
        newBoard[row][col] = { ...newBoard[row][col], isFlagged: false };
      } else {
        setFlagCount((prev) => prev + 1);
        newBoard[row][col] = { ...newBoard[row][col], isFlagged: true };
      }

      if (revealedCount === GRID_SIZE.row * GRID_SIZE.col - NUM_MINES) {
        setIsGameWon(true);
      }

      setIsGameStart(true);
      setBoard(newBoard);
    }
  };

  /**
   * Initializes the game board by creating a new board with cells and mines.
   */
  const initializeBoard = () => {
    /**
     * Initializes a single cell with default values.
     * @returns {CellProps} A cell object with default properties.
     */
    const initializeCell = (): CellProps => {
      return {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
        surroundingCells: [],
        handleClick: () => {}, // do not register here
        handleRightClick: () => {}, // do not register here
      };
    };

    const newBoard: CellProps[][] = new Array(GRID_SIZE.row)
      .fill([])
      .map(() =>
        new Array(GRID_SIZE.col).fill(undefined).map(() => initializeCell())
      );

    setMines(NUM_MINES, newBoard);

    newBoard.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        !cell.isMine &&
          (cell.adjacentMines = adjacentMines(rowIndex, colIndex, newBoard));
        cell.surroundingCells = surroundingCells(rowIndex, colIndex);
      })
    );

    setBoard(newBoard);
  };

  /**
   * Handles click on the face button to start a new game.
   */
  const handleFaceClick = () => {
    setFlagCount(0);
    setRevealedCount(0);
    setIsGameStart(false);
    setIsGameOver(false);
    setIsGameWon(false);
    initializeBoard();
  };

  useEffect(() => {
    initializeBoard();
  }, []);

  return (
    <Flex
      alignItems="center"
      display="inline-block"
      border="2px solid #333"
      padding="10px"
      maxWidth="375"
    >
      <Box padding="2px">
        <MinesCounter
          mines={NUM_MINES - flagCount}
          handleClick={handleFaceClick}
          isGameStart={isGameStart}
          isGameOver={isGameOver}
          isGameWon={isGameWon}
        />
      </Box>
      <Box padding="2px">
        {board.map((row, rowIndex) => (
          <Box key={rowIndex} display="flex">
            {row.map((cell, columnIndex) => (
              <Cell
                key={columnIndex}
                isMine={cell.isMine}
                isRevealed={cell.isRevealed}
                isFlagged={cell.isFlagged}
                adjacentMines={cell.adjacentMines}
                surroundingCells={cell.surroundingCells}
                handleClick={() => handleClick(rowIndex, columnIndex)}
                handleRightClick={(event: React.MouseEvent) =>
                  handleDesktopRightClick(event, rowIndex, columnIndex)
                }
              />
            ))}
          </Box>
        ))}
      </Box>
      {!isGameOver && !isGameWon && (
        <Text fontSize="xl" color="blue">
          Hang in there!
        </Text>
      )}
      {isGameOver && (
        <Text fontSize="xl" color="red">
          Game Over
        </Text>
      )}
      {isGameWon && (
        <Text fontSize="xl" color="green">
          Congratulations! You won!
        </Text>
      )}
    </Flex>
  );
};

export default GameBoard;
