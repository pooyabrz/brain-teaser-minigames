import React from 'react';

type SudokuBoardProps = {
    board: (number | null)[][];
    initialBoard: (number | null)[][];
    selectedCell: [number, number] | null;
    handleCellClick: (row: number, col: number) => void;
    isGameActive: () => void;
};

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
    board,
    initialBoard,
    selectedCell,
    handleCellClick,
    isGameActive,
}) => {
    return (
        <div className="grid grid-cols-9 gap-0 border-4 border-black">
            {board.map((row, rowIndex) => (
                row.map((cell, colIndex) => {
                    const isInitial = initialBoard[rowIndex][colIndex] !== null;
                    const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex;
                    
                    const borderClasses = [
                        rowIndex % 3 === 0 ? 'border-t-4' : 'border-t',
                        colIndex % 3 === 0 ? 'border-l-4' : 'border-l',
                        colIndex % 3 === 2 ? 'border-r-4' : 'border-r-0',
                        rowIndex % 3 === 2 ? 'border-b-4' : 'border-b-0'
                    ].join(' ');

                    const cellClass = `w-10 h-10 flex items-center justify-center 
                        ${borderClasses}
                        ${isInitial ? 'font-bold bg-gray-100' : ''} 
                        ${isSelected ? 'bg-blue-200' : ''}
                        border-black`;

                    return (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={cellClass}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                            {cell}
                        </div>
                    );
                })
            ))}
        </div>
    );
};