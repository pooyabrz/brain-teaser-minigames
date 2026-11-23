import React, { useState } from "react";
import { checkWinner } from '@/utils/checkWinner';
import { Dispatch, SetStateAction } from "react";

const getBotMoveIndex = (currentBoard: (string | null)[]) => {
  const emptyIndexes = currentBoard.map((cell, idx) => (cell === null ? idx : null)).filter((idx) => idx !== null) as number[];
  if (emptyIndexes.length === 0) return null;

  for (let idx of emptyIndexes) {
    const tempBoard = [...currentBoard];
    tempBoard[idx] = "O";
    if (checkWinner(tempBoard) === "O") return idx;
  }

  for (let idx of emptyIndexes) {
    const tempBoard = [...currentBoard];
    tempBoard[idx] = "X";
    if (checkWinner(tempBoard) === "X") return idx;
  }

  // if (emptyIndexes.includes(4)) return 4;

  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(c => emptyIndexes.includes(c));
  if (availableCorners.length > 0) return availableCorners[Math.floor(Math.random() * availableCorners.length)];

  const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  return randomIndex;
};

export const handleBotMove_9 = (
  currentBoard: (string | null)[][],
  currentWinner_9: (string | null)[],
  currentCompletedSubs: boolean[],
  currentNextSubBoard: number | null,
  setBoard_9: Dispatch<SetStateAction<(string | null)[][]>>,
  setWinner_9: Dispatch<SetStateAction<(string | null)[]>>,
  setCompletedSubs: Dispatch<SetStateAction<boolean[]>>,
  setNextSubBoard: Dispatch<SetStateAction<number | null>>,
  setIsPlayerTurn: Dispatch<SetStateAction<boolean>>
) => {
  const newBoard = [...currentBoard.map((sub) => [...sub])];
  const newWinner_9 = [...currentWinner_9];
  const newCompletedSubs = [...currentCompletedSubs];

  let subIndex: number;
  if (currentNextSubBoard !== null && !newCompletedSubs[currentNextSubBoard]) {
    subIndex = currentNextSubBoard;
  } else {
    const availableSubs = newCompletedSubs.map((c, i) => (!c ? i : null)).filter((i) => i !== null) as number[];
    if (availableSubs.length === 0) {
      setIsPlayerTurn(true);
      return;
    }
    subIndex = availableSubs[Math.floor(Math.random() * availableSubs.length)];
  }

  const subBoard = newBoard[subIndex];
  const botMoveIndex = getBotMoveIndex(subBoard);

  if (botMoveIndex === null) {
    setIsPlayerTurn(true);
    return;
  }
  
  subBoard[botMoveIndex] = "O";

  const w = checkWinner(subBoard);
  if (w) {
    newWinner_9[subIndex] = w === "tie" ? null : w;
    newCompletedSubs[subIndex] = true;
  } else if (subBoard.every((cell) => cell !== null)) {
    newCompletedSubs[subIndex] = true;
  }

  // const newNext = (newCompletedSubs[botMoveIndex] || newWinner_9[botMoveIndex] || newBoard[botMoveIndex].every((cell) => cell !== null))
  //   ? null
  //   : botMoveIndex;

  let newNext: number | null;
  if (
    newCompletedSubs[botMoveIndex] ||
    newWinner_9[botMoveIndex] ||
    newBoard[botMoveIndex].every((cell) => cell !== null)
  ) {
    newNext = null;
  } else {
    newNext = botMoveIndex;
  }

  setBoard_9(newBoard);
  setWinner_9(newWinner_9);
  setCompletedSubs(newCompletedSubs);
  setNextSubBoard(newNext);
  setIsPlayerTurn(true);
};
