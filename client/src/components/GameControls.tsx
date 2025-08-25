import React from 'react';

type GameControlsProps = {
    handleNumberInput: (num: number) => void;
    handleClearCell: () => void;
    handleReset: () => void;
    handleBackToMenu: () => void;
    isGameActive: () => void;
};

export const GameControls: React.FC<GameControlsProps> = ({
    handleNumberInput,
    handleClearCell,
    handleReset,
    handleBackToMenu,
    isGameActive

}) => {
    return (
        <div className="mt-6 flex flex-col items-center">
            <div className="grid grid-cols-5 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                        key={num}
                        className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center"
                        onClick={() => handleNumberInput(num)}
                    >
                        {num}
                    </button>
                ))}
                <button
                    className="w-10 h-10 bg-rose-800 rounded col-span-5"
                    onClick={handleClearCell}
                >
                    Clear
                </button>
            </div>
            <div className="flex space-x-4">
                <button
                    className="px-4 py-2 bg-fuchsia-400 text-white rounded"
                    onClick={handleReset}
                >
                    Reset
                </button>
                <button
                    className="px-4 py-2 bg-violet-500 text-white rounded"
                    onClick={handleBackToMenu}
                >
                    Back to Menu
                </button>
            </div>
        </div>
    );
};