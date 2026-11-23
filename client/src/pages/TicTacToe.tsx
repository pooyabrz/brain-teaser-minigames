import { useEffect, useState } from 'react';
import { GameFrame, GameResult } from '../components/GameFrame';
import { useScore } from '../lib/useScore';
import { botClassic, botUltimate, winner, type Mark, type Result } from '../lib/tictactoe';
import { Grid2X2, Sparkles } from 'lucide-react';
type Phase = 'setup'|'playing'|'done';
type Mode = 'classic'|'ultimate';
const empty = () => Array<Mark>(9).fill(null);
const emptyUltimate = () => Array.from({ length: 9 }, empty);
export default function TicTacToe() {
  const [phase, setPhase] = useState<Phase>('setup'); const [mode, setMode] = useState<Mode>('classic'); const [level, setLevel] = useState<'casual'|'smart'>('smart');
  const [board, setBoard] = useState<Mark[]>(empty); const [boards, setBoards] = useState<Mark[][]>(emptyUltimate); const [owners, setOwners] = useState<Result[]>(Array(9).fill(null));
  const [target, setTarget] = useState<number | null>(null); const [playerTurn, setPlayerTurn] = useState(true); const [result, setResult] = useState<Result>(null); const [elapsed, setElapsed] = useState(0);
  const { saveScore, resetScore, saveState } = useScore('tic-tac-toe');
  useEffect(() => { if (phase !== 'playing') return; const id = window.setInterval(() => setElapsed(n => n + 1), 1000); return () => clearInterval(id); }, [phase]);
  const start = () => { resetScore(); setBoard(empty()); setBoards(emptyUltimate()); setOwners(Array(9).fill(null)); setTarget(null); setPlayerTurn(true); setResult(null); setElapsed(0); setPhase('playing'); };
  const finish = (r: Result) => { setResult(r); setPhase('done'); const outcome = r === 'X' ? 'win' : r === 'O' ? 'loss' : 'draw'; void saveScore(r === 'X' ? (mode === 'ultimate' ? 650 : 350) : r === 'T' ? 120 : 25, elapsed, outcome); };
  const applyUltimate = (sub: number, cell: number, mark: 'X'|'O') => {
    const next = boards.map(b => [...b]); if (next[sub][cell] !== null || owners[sub] !== null) return;
    next[sub][cell] = mark;
    const newOwners = [...owners]; newOwners[sub] = winner(next[sub]);
    const metaResult = winner(newOwners.map(x => x === 'T' ? null : x));
    const ultimateResult = metaResult === 'X' || metaResult === 'O' ? metaResult : newOwners.every(x => x !== null) ? 'T' : null;
    setBoards(next); setOwners(newOwners); setTarget(newOwners[cell] ? null : cell);
    if (ultimateResult) finish(ultimateResult); else setPlayerTurn(mark !== 'X');
  };
  const playerMove = (idx: number, sub?: number) => {
    if (phase !== 'playing' || !playerTurn) return;
    if (mode === 'classic') { if (board[idx]) return; const next = [...board]; next[idx] = 'X'; setBoard(next); const r = winner(next); if (r) finish(r); else setPlayerTurn(false); }
    else if (sub !== undefined && (target === null || target === sub)) applyUltimate(sub, idx, 'X');
  };
  useEffect(() => {
    if (phase !== 'playing' || playerTurn) return;
    const timer = window.setTimeout(() => {
      if (mode === 'classic') {
        const pos = botClassic(board, level); if (pos < 0) return;
        const next = [...board]; next[pos] = 'O'; setBoard(next);
        const r = winner(next); if (r) finish(r); else setPlayerTurn(true);
      } else {
        const move = botUltimate(boards, owners, target);
        if (move) applyUltimate(move[0], move[1], 'O');
      }
    }, 350);
    return () => window.clearTimeout(timer);
    // Values captured for precisely one bot turn; the timeout is canceled when state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, playerTurn, board, boards, owners, target, mode, level]);
  return <GameFrame title="Tic Tac Toe." kicker="STRATEGY / PLAYER VS BOT" elapsed={phase === 'setup' ? undefined : elapsed} onRestart={phase === 'setup' ? undefined : start} instructions="Three in a row wins. Play classic or take on nine connected boards." status={saveState || (mode === 'ultimate' ? 'The cell you choose sends your opponent to the corresponding mini-board.' : 'You play X. The bot plays O.')}>
    {phase === 'setup' ? <div className="game-setup"><div className="setup-icon mint"><Grid2X2 size={40}/></div><h2>Make your move.</h2><p>Choose the board you want to conquer.</p><div className="choice-pills"><button className={mode === 'classic' ? 'selected' : ''} onClick={() => setMode('classic')}>Classic 3×3</button><button className={mode === 'ultimate' ? 'selected' : ''} onClick={() => setMode('ultimate')}>Ultimate 9×9</button></div>{mode === 'classic' && <div className="choice-pills"><button className={level === 'casual' ? 'selected' : ''} onClick={() => setLevel('casual')}>Casual bot</button><button className={level === 'smart' ? 'selected' : ''} onClick={() => setLevel('smart')}>Smart bot</button></div>}<button className="button button-primary button-lg" onClick={start}>Start game <Sparkles size={18}/></button></div> : phase === 'done' ? <GameResult title={result === 'X' ? 'Three cheers for you!' : result === 'O' ? 'The bot wins this round.' : 'A clever draw!'} description={result === 'X' ? 'You outsmarted the machine.' : result === 'O' ? 'Time for a comeback?' : 'No winner this time. Try again!'} score={result === 'X' ? mode === 'ultimate' ? 650 : 350 : result === 'T' ? 120 : 25} onRestart={start}/> : <div className="tic-stage"><div className="turn-badge"><span className={playerTurn ? 'turn-active' : ''}>✕ YOU</span><span className={!playerTurn ? 'turn-active' : ''}>○ BOT</span></div>{mode === 'classic' ? <div className="tic-grid classic-grid">{board.map((cell, i) => <button className={`tic-cell ${cell === 'X' ? 'is-x' : cell === 'O' ? 'is-o' : ''}`} key={i} onClick={() => playerMove(i)} disabled={!!cell || !playerTurn} aria-label={`Row ${Math.floor(i / 3) + 1} column ${i % 3 + 1}: ${cell || 'empty'}`}>{cell === 'X' ? '×' : cell === 'O' ? '○' : ''}</button>)}</div> : <div className="ultimate-grid">{boards.map((subBoard, sub) => <div className={`ultimate-sub ${owners[sub] ? 'sub-complete' : ''} ${!owners[sub] && (target === null || target === sub) ? 'sub-allowed' : ''}`} key={sub}>{owners[sub] ? <span className={`sub-owner ${owners[sub] === 'X' ? 'is-x' : 'is-o'}`}>{owners[sub] === 'T' ? '–' : owners[sub] === 'X' ? '×' : '○'}</span> : <div className="tic-grid mini-grid">{subBoard.map((cell, i) => <button className={`tic-cell ${cell === 'X' ? 'is-x' : cell === 'O' ? 'is-o' : ''}`} key={i} onClick={() => playerMove(i, sub)} disabled={!!cell || !playerTurn || (target !== null && target !== sub)} aria-label={`Board ${sub + 1}, cell ${i + 1}: ${cell || 'empty'}`}>{cell === 'X' ? '×' : cell === 'O' ? '○' : ''}</button>)}</div>}</div>)}</div>}<p className="tic-hint">{playerTurn ? "It's your turn. Make it count!" : 'Bot is thinking…'}</p></div>}
  </GameFrame>;
}
