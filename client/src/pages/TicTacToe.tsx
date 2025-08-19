import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { handleBotMove } from '@/components/handleBotMove';
import { checkWinner } from '@/utils/checkWinner';
// import { useAuth } from '../context/AuthContext';// todo
// import { useNavigate } from 'react-router-dom';

export default function TicTacToe() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [display_start, setDisplay_start] = useState<string>("hidden");
  const [display_restart, setDisplay_restart] = useState<string>("hidden");
  const [display_first, setDisplay_first] = useState<string>("flex");
  const [display_result, setDisplay_result] = useState<string>("");

  const start_game = () => {
    setBoard(Array(9).fill(null))
    setWinner(null)
    setIsPlayerTurn(true)
    setDisplay_start("grid");
    setDisplay_restart("flex");
    setDisplay_first("hidden");
    setDisplay_result("flex")
    
  }

  const handlePlayerMove = (index: number) => {
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

  const resetGame = () => {
    setDisplay_first("flex")
    setDisplay_start("hidden")
    setDisplay_restart("hidden")
    setDisplay_result("hidden")
  }

  return (

    <div className="flex flex-col items-center justify-center w-full bg-[#F5EEDC]">
      <div className="text-2xl font-bold mb-[30px]">Tic Tac Toe</div>
      <div id="start_game" className={`${display_first} flex-col gap-3`}>
        <Button onClick={start_game} variant="default" className="w-30">3*3</Button>
        <Button  variant="default" className="w-30">9*9</Button>
      </div>
      <div className={`${display_start} grid-cols-3 gap-2 place-items-center bg-primary shadow-lg shadow-primary`}>
        {board.map((cell, i) => (
            <Button
            key={i}
            variant="outline"
            onClick={() => handlePlayerMove(i)}
            disabled={Boolean(cell) || winner !== null || !isPlayerTurn}
            className="h-16 text-3xl text-white font-bold w-[64px] gap-[10px] rounded-[0px] bg-[#DDA853] border-[0px]  disabled:bg-[#DDA853]"
            >
            {cell}
            </Button>
        ))}
        </div>

        {winner=="X" && <p className={`${display_result} text-lg font-bold text-green-600 mt-[10px]`}>You Win</p>}
        {winner=="O" && <p className={`${display_result} text-lg font-bold text-red-600 mt-[10px]`}>You Lose</p>}
        {winner=="tie" && <p className={`${display_result} text-lg font-bold text-[#154D71] mt-[10px] mb-[10px]mt-[10px]`}>No winner</p>}
        <Button onClick={resetGame} variant="default" className={`${display_restart} mt-[10px]`}>Restart</Button>
    </div>
  )

}