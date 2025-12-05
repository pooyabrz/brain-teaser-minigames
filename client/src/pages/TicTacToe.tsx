import React, { useEffect, useState , useRef} from 'react';
import { Button } from '@/components/ui/button';
import { handlePlayerMove, handlePlayerMove_9 } from '@/components/handlePlayerMove';
// import { useAuth } from '../context/AuthContext';// todo
// import { useNavigate } from 'react-router-dom';

export default function TicTacToe() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [display_start_3, setDisplay_start_3] = useState<string>("hidden");
  const [display_restart, setDisplay_restart] = useState<string>("hidden");
  const [display_first, setDisplay_first] = useState<string>("flex");
  const [display_result, setDisplay_result] = useState<string>();
  const [display_start_9, setDisplay_start_9] = useState<string>("hidden");
  const [board_9, setBoard_9] = useState<(string | null)[][]>(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [winner_9, setWinner_9] =  useState<(string | null)[]>(Array(9).fill(null));
  const [completedSubs, setCompletedSubs] = useState<boolean[]>(Array(9).fill(false));
  const [nextSubBoard, setNextSubBoard] = useState<number | null>(null);
  const botMoveTimer = useRef<NodeJS.Timeout | null>(null);

  const start_game_3 = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
    setDisplay_start_3("grid");
    setDisplay_restart("flex");
    setDisplay_first("hidden");
    setDisplay_result("flex");
    
  }

  const start_game_9 = () => {
    setBoard_9(Array(9).fill(null).map(() => Array(9).fill(null)));
    setBoard(Array(9).fill(null));
    setCompletedSubs(Array(9).fill(false));
    setWinner_9(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
    setDisplay_restart("flex");
    setDisplay_first("hidden");
    setDisplay_result("flex");
    setDisplay_start_9("grid");
    
  }

  const resetGame = () => {
    setDisplay_first("flex")
    setDisplay_start_3("hidden")
    setDisplay_restart("hidden")
    setDisplay_result("hidden")
    setDisplay_start_9("hidden");
    setBoard(Array(9).fill(null));
    setBoard_9(Array(9).fill(null).map(() => Array(9).fill(null)));
    setWinner_9(Array(9).fill(null));
    setCompletedSubs(Array(9).fill(false));
    setNextSubBoard(null);
    setWinner(null);
    setIsPlayerTurn(true);
  }

  useEffect(() => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let hasWinner = false;
  for (const [a, b, c] of lines) {
    if (winner_9[a] && winner_9[a] === winner_9[b] && winner_9[a] === winner_9[c]) {
      setWinner(winner_9[a]);
      hasWinner = true;
      return;
    }
  }
  if (!hasWinner && completedSubs.every((c) => c)) {
    setWinner("tie");
  }
}, [winner_9, completedSubs]);

  return (
    <div className="flex flex-col items-center justify-center w-full bg-[#F5EEDC]">
      <div className="text-2xl font-bold mb-[30px]">Tic Tac Toe</div>
      <div className={`${display_first} flex-col gap-3`}>
        <Button onClick={start_game_3} variant="default" className="w-30">3*3</Button>
        <Button  onClick={start_game_9} variant="default" className="w-30">9*9</Button>
      </div>
      <div className={`${display_start_3} grid-cols-3 gap-2 place-items-center bg-primary shadow-lg shadow-primary`}>
        {board.map((cell, i) => (
            <Button
            key={i}
            variant="outline"
            onClick={() => handlePlayerMove(i, isPlayerTurn, board, winner, setIsPlayerTurn, setBoard, setWinner)}
            disabled={Boolean(cell) || winner !== null || !isPlayerTurn}
            className="h-16 text-3xl text-white font-bold w-[64px] gap-[10px] rounded-[0px] bg-[#DDA853] border-[0px]  disabled:bg-[#DDA853]"
            >
            {cell}
            </Button>
        ))}
        </div>

      <div id="9*9">
        <div className={`${display_start_9} grid-cols-3  gap-2 place-items-center bg-primary shadow-lg shadow-primary`}>
          {board_9.map((cell_9,index_9) => (
          <div key={index_9} className={`${display_start_9} grid-cols-3 gap-2 place-items-center bg-white`}>
          {cell_9.map((cell, index) => (
              <Button
              key={index}
              variant="outline"
              onClick={() => handlePlayerMove_9(index_9, index, isPlayerTurn, board_9, winner, completedSubs, nextSubBoard, winner_9, botMoveTimer, setBoard_9, setWinner_9, setCompletedSubs, setNextSubBoard, setIsPlayerTurn)}
              disabled={Boolean(cell_9[index])  || winner !== null || !isPlayerTurn || completedSubs[index_9] || (nextSubBoard !== null && index_9 !== nextSubBoard)}
              className="h-16 text-3xl text-white font-bold w-[64px] gap-[10px] rounded-[0px] bg-[#DDA853] border-[0px]  disabled:bg-[#DDA853]"
              >
              {cell}
              </Button>
          ))}
          </div>
          ))}
        </div>
      </div>

      {winner=="X" && <p className={`${display_result} text-lg font-bold text-green-600 mt-[10px]`}>You Win</p>}
      {winner=="O" && <p className={`${display_result} text-lg font-bold text-red-600 mt-[10px]`}>You Lose</p>}
      {winner=="tie" && <p className={`${display_result} text-lg font-bold text-[#154D71] mt-[10px] mb-[10px]mt-[10px]`}>No winner</p>}
      <Button onClick={resetGame} variant="default" className={`${display_restart} mt-[20px]`}>Restart</Button>
    </div>
  )
}