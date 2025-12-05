import React from 'react';

type DifficultySelectorProps = {
    difficulty: 'easy' | 'medium' | 'hard';
    setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
    difficultySelector: string;
    startGame: () => void;
};

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
    difficulty,
    setDifficulty,
    difficultySelector,
    startGame
}) => {
    return (
        <div className={`${difficultySelector} flex-col items-center`}>
            <h2 className="text-lg mb-12">Select Difficulty</h2>
            <div className="flex space-x-8 mb-10">
                <button
                    className={`px-15 py-6 rounded ${difficulty === 'easy' ? 'bg-violet-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setDifficulty('easy')}
                >
                    Easy
                </button>
                <button
                    className={`px-15 py-6 rounded ${difficulty === 'medium' ? 'bg-violet-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setDifficulty('medium')}
                >
                    Medium
                </button>
                <button
                    className={`px-15 py-6 rounded ${difficulty === 'hard' ? 'bg-violet-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setDifficulty('hard')}
                >
                    Hard
                </button>
            </div>
            <button
                className="px-25 py-8 bg-fuchsia-400 text-white rounded"
                onClick={startGame}
            >
                Start Game
            </button>
        </div>
    );
};