import React, { useState, useEffect } from "react";
import { checkWinner } from '@/utils/checkWinner';
import { handleBotMove } from '@/components/handleBotMove';
import { handleBotMove_9 } from '@/components/handleBotMove_9';
import { Dispatch, SetStateAction } from "react";

export const handlePlayerMove_9 = (index_9: number, index: number,
    isPlayerTurn: (string | null),
    board_9: (string | null)[][],
    winner: (string | null)[],
    completedSubs: boolean[],
    nextSubBoard:(number | null),
    winner_9: (string | null)[],
    botMoveTimer: NodeJS.Timeout | null,
    setBoard_9: Dispatch<SetStateAction<(string | null)[][]>>,
    setWinner_9: Dispatch<SetStateAction<(string | null)[]>>,
    setCompletedSubs: Dispatch<SetStateAction<boolean[]>>,
    setNextSubBoard: Dispatch<SetStateAction<number | null>>,
    setIsPlayerTurn: Dispatch<SetStateAction<boolean>>
) => {
  if (!isPlayerTurn || board_9[index_9][index] || winner || completedSubs[index_9]) return;
  if (nextSubBoard !== null && index_9 !== nextSubBoard) return;

  // Calculate new state locally first
  const newBoard = [...board_9.map((sub) => [...sub])];
  newBoard[index_9][index] = "X";

  const updatedWinner_9 = [...winner_9];
  const updatedCompletedSubs = [...completedSubs];

  const w_9 = checkWinner(newBoard[index_9]);
  if (w_9) {
    updatedWinner_9[index_9] = w_9 === "tie" ? null : w_9;
    updatedCompletedSubs[index_9] = true;
  } else if (newBoard[index_9].every((cell) => cell !== null)) {
    updatedCompletedSubs[index_9] = true;
  }

  // const updatedNextSubBoard = (updatedCompletedSubs[index] || updatedWinner_9[index] || newBoard[index].every((cell) => cell !== null))
  //   ? null
  //   : index;
  let updatedNextSubBoard: number | null;
  if (
    updatedCompletedSubs[index] ||
    updatedWinner_9[index] ||
    newBoard[index].every((cell) => cell !== null)
  ) {
    updatedNextSubBoard = null;
  } else {
    updatedNextSubBoard = index;
  }

  // Update all states at once
  setBoard_9(newBoard);
  setWinner_9(updatedWinner_9);
  setCompletedSubs(updatedCompletedSubs);
  setNextSubBoard(updatedNextSubBoard);

  if (botMoveTimer.current) {
    clearTimeout(botMoveTimer.current);
  }

  setIsPlayerTurn(false);
  botMoveTimer.current = setTimeout(() => {
    // Pass the fully updated state to the bot handler
    handleBotMove_9(newBoard, updatedWinner_9, updatedCompletedSubs, updatedNextSubBoard, setBoard_9, setWinner_9, setCompletedSubs, setNextSubBoard, setIsPlayerTurn);
  }, 500);
};

export const handlePlayerMove = (index: number,
  isPlayerTurn: boolean,
  board: (string | null)[],
  winner: string | null,
  setIsPlayerTurn: Dispatch<SetStateAction<boolean>>,
  setBoard: Dispatch<SetStateAction<(string | null)[]>>,
  setWinner: Dispatch<SetStateAction<(string | null)>>

) => {
  if (!isPlayerTurn || board[index] || winner) return
  const newBoard = [...board]
  newBoard[index] = "X"
  setBoard(newBoard)
  const w = checkWinner(newBoard)
  if (w) {
    setWinner(w)
    return
  }
  setIsPlayerTurn(false)
  setTimeout(() => handleBotMove(newBoard, setBoard, setIsPlayerTurn, setWinner, checkWinner), 500)
}