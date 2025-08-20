import React, { useState } from "react";
import { checkWinner } from '@/utils/checkWinner';


export const handleBotMove = (
    currentBoard: (string | null)[],
    setBoard: React.Dispatch<React.SetStateAction<(string | null)[]>>,
    setIsPlayerTurn: React.Dispatch<React.SetStateAction<boolean>>,
    setWinner: React.Dispatch<React.SetStateAction<string | null>>,
    checkWinner: (b: (string | null)[]) => string | null
    ) => {
        const emptyIndexes = currentBoard
            .map((cell, idx) => (cell === null ? idx : null))
            .filter((idx) => idx !== null) as number[]
        if (emptyIndexes.length === 0) return

        const makeMove = (newBoard: (string | null)[]) => {
        setBoard(newBoard)
        const w = checkWinner(newBoard)
        if (w) {
            setWinner(w)
            return
        }
        setIsPlayerTurn(true)
        }

        for (let idx of emptyIndexes) {
            const tempBoard: (string | null)[] = [...currentBoard]
            tempBoard[idx] = "O"
            if (checkWinner(tempBoard) === "O") {
            makeMove( tempBoard)
            return
            }
        }

        for (let idx of emptyIndexes) {
            const tempBoard: (string | null)[] = [...currentBoard]
            tempBoard[idx] = "X"
            if (checkWinner(tempBoard) === "X") {
                const newBoard: (string | null)[] = [...currentBoard];
                newBoard[idx] = "O"
                makeMove(newBoard)
                return
            }
        }
        if (emptyIndexes.includes(4)) {
            const tempBoard = [...currentBoard]
            tempBoard[4] = "O"
            makeMove(tempBoard)
            return
        }
        const corners = [0, 2, 6, 8]
        const availableCorners = corners.filter(c => emptyIndexes.includes(c))
        if (availableCorners.length > 0) {
            const idx = availableCorners[Math.floor(Math.random() * availableCorners.length)]
            const tempBoard = [...currentBoard]
            tempBoard[idx] = "O"
            makeMove(tempBoard)
            return
        }
        const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)]
        const tempBoard = [...currentBoard]
        tempBoard[randomIndex] = "O"
        makeMove(tempBoard)
}