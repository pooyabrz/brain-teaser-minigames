import React, { useState } from 'react';
import { DifficultySelector } from '../components/DifficultySelector';
import { SudokuBoard } from '../components/SudokuBoard';
import { GameControls } from '../components/GameControls';
import { Timer } from '../components/Timer';

type CellValue = number | null;
type Board = CellValue[][];
type Difficulty = 'easy' | 'medium' | 'hard';

const Sudoku = () => {
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [difficultySelector, setDifficultySelector] = useState("flex");
    const [gamePage, setGamePage] = useState("hidden");
    const [gameOver, setGameOver] = useState(false);
    const [board, setBoard] = useState<Board>([]);
    const [initialBoard, setInitialBoard] = useState<Board>([]);
    const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [mistakes, setMistakes] = useState(0);
    const [isSolved, setIsSolved] = useState(false);
    const isGameActive = isRunning && !gameOver && !isSolved;



    // ---------- Helper functions ----------
    const createEmptyBoard = (): Board =>
        Array.from({ length: 9 }, () => Array(9).fill(null));

    const isSafe = (board: Board, row: number, col: number, num: number): boolean => {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) return false;
        }
        // Check column
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num) return false;
        }
        // Check 3x3 box
        const startRow = row - (row % 3);
        const startCol = col - (col % 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i + startRow][j + startCol] === num) return false;
            }
        }
        return true;
    };
    
//     const shuffleArray = (array) => {
//     const arr = [...array];
//     for (let i = arr.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [arr[i], arr[j]] = [arr[j], arr[i]];
//     }
//     return arr;
// };

    const fillBoard = (board: Board): boolean => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === null) {
                    const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
                    // const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

                    for (let num of nums) {
                        if (isSafe(board, row, col, num)) {
                            board[row][col] = num;
                            if (fillBoard(board)) return true;
                            board[row][col] = null;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };

    const removeCells = (board: Board, difficulty: Difficulty) => {
        let attempts = difficulty === "easy" ? 35 : difficulty === "medium" ? 45 : 55;
        while (attempts > 0) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (board[row][col] !== null) {
                board[row][col] = null;
                attempts--;
            }
        }
    };

    // ---------- Generate New Board ----------
    const generateNewBoard = (difficulty: Difficulty) => {
        let newBoard = createEmptyBoard();
        fillBoard(newBoard);
        let puzzle = JSON.parse(JSON.stringify(newBoard));
        removeCells(puzzle, difficulty);

        setBoard(puzzle);
        setInitialBoard(puzzle);
    };

    const startGame = () => {
        generateNewBoard(difficulty);
        setDifficultySelector("hidden");
        setGamePage("flex");
        setTime(0);
        setMistakes(0);
        setIsRunning(true);
        setIsSolved(false);
        setGameOver(false);
    };

    const handleCellClick = (row: number, col: number) => {
        
        if (!isGameActive || initialBoard[row][col] !== null) return;
        setSelectedCell([row, col]);
    };

    const handleNumberInput = (num: number) => {
        if (!isGameActive || !selectedCell) return;
        const [row, col] = selectedCell;
        const newBoard = [...board.map(r => [...r])];
        newBoard[row][col] = num;
        setBoard(newBoard);

        if (!isValidMove(newBoard, row, col, num)) {
            setMistakes(mistakes + 1);
            if (mistakes + 1 >= 3) {
                setGameOver(true);
                setIsRunning(false);
            }
        }

        if (isBoardSolved(newBoard)) {
            setIsSolved(true);
            setIsRunning(false);
        }
    };

    const isValidMove = (board: Board, row: number, col: number, num: number): boolean => {
        for (let i = 0; i < 9; i++) {
            if (i !== col && board[row][i] === num) return false;
        }
        for (let i = 0; i < 9; i++) {
            if (i !== row && board[i][col] === num) return false;
        }
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if ((i !== row || j !== col) && board[i][j] === num) return false;
            }
        }
        return true;
    };

    const isBoardSolved = (board: Board): boolean => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === null || !isValidMove(board, i, j, board[i][j]!)) {
                    return false;
                }
            }
        }
        return true;
    };

    const handleClearCell = () => {
        if (!selectedCell) return;
        const [row, col] = selectedCell;
        if (initialBoard[row][col] !== null) return;
        const newBoard = [...board.map(r => [...r])];
        newBoard[row][col] = null;
        setBoard(newBoard);
    };

    const handleReset = () => {
        setBoard(JSON.parse(JSON.stringify(initialBoard)));
        setTime(0);
        setMistakes(0);
        setIsRunning(true);
        setIsSolved(false);
        setGameOver(false);
    };

    const handleBackToMenu = () => {
        setDifficultySelector("flex");
        setGamePage("hidden");
        setIsRunning(false);
    };

    return (

    <div className="bg-purple-200 flex justify-center items-center flex-col h-screen">
    
        <div className="bg-purple-200 flex justify-center items-center flex-col h-screen">
            <h1 className="text-2xl text-dark-blue mb-4"><b>Sudoku</b></h1>
            
            <DifficultySelector
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                difficultySelector={difficultySelector}
                startGame={startGame}
            />
            
            <div id="game-page" className={`${gamePage} justify-center items-center flex-col`}>
                <div className="mb-4 flex justify-between w-full">
                    <Timer time={time} setTime={setTime} isRunning={isRunning} />
                    <div className="text-red-500">Mistakes: {mistakes}/3</div>
                </div>
                
                <SudokuBoard 
                    board={board}
                    initialBoard={initialBoard}
                    selectedCell={selectedCell}
                    handleCellClick={handleCellClick}
                    isGameActive={isGameActive}
                />
                
                <GameControls 
                    handleNumberInput={handleNumberInput}
                    handleClearCell={handleClearCell}
                    handleReset={handleReset}
                    handleBackToMenu={handleBackToMenu}
                    isGameActive={isGameActive}
                />
                
                {gameOver && (
                    <div className="mt-4 text-red-500 text-xl">
                        Game Over! Too many mistakes.
                    </div>
                )}
                
                {isSolved && (
                    <div className="mt-4 text-teal-500 text-xl">
                        Congratulations! You solved the puzzle in {Math.floor(time / 60)}:{time % 60 < 10 ? '0' : ''}{time % 60}
                    </div>
                )}
            </div>
        </div>
      </div>
    );
};

export default Sudoku;
