import { useEffect, useState } from 'react';
import { Eraser, Grid3X3, Lightbulb, Pencil, Sparkles } from 'lucide-react';
import { GameFrame, GameResult } from '../components/GameFrame';
import { useScore } from '../lib/useScore';
import { boardComplete, puzzle, type Board, type Difficulty } from '../lib/sudoku';
type Phase = 'setup'|'playing'|'won'|'lost';
export default function Sudoku() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy'); const [phase, setPhase] = useState<Phase>('setup');
  const [initial, setInitial] = useState<Board>([]); const [solution, setSolution] = useState<Board>([]); const [board, setBoard] = useState<Board>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null); const [mistakes, setMistakes] = useState(0); const [hints, setHints] = useState(2); const [elapsed, setElapsed] = useState(0);
  const { saveScore, resetScore, saveState } = useScore('sudoku');
  useEffect(() => { if (phase !== 'playing') return; const id = window.setInterval(() => setElapsed(t => t + 1), 1000); return () => clearInterval(id); }, [phase]);
  const newGame = () => { const p = puzzle(difficulty); resetScore(); setInitial(p.initial); setBoard(p.initial.map(r => [...r])); setSolution(p.solution); setSelected(null); setMistakes(0); setHints(2); setElapsed(0); setPhase('playing'); };
  const finalScore = (time: number, wrong: number, remaining: number) => Math.max(100, (difficulty === 'hard' ? 2400 : difficulty === 'medium' ? 1700 : 1200) - time * 2 - wrong * 100 - (2 - remaining) * 160);
  const update = (value: number, hint = false) => {
    if (phase !== 'playing' || !selected) return;
    const [r, c] = selected;
    if (initial[r][c] !== 0) return;
    if (value !== 0 && value !== solution[r][c]) {
      const next = mistakes + 1; setMistakes(next);
      if (next >= 3) { setPhase('lost'); void saveScore(0, elapsed, 'loss'); }
      return;
    }
    const next = board.map(row => [...row]); next[r][c] = value; setBoard(next);
    const remaining = hints - Number(hint); if (hint) setHints(remaining);
    if (boardComplete(next, solution)) { setPhase('won'); void saveScore(finalScore(elapsed, mistakes, remaining), elapsed, 'completed'); }
  };
  const hint = () => {
    if (phase !== 'playing' || hints <= 0) return;
    let cell = selected;
    if (!cell || initial[cell[0]][cell[1]] !== 0 || board[cell[0]][cell[1]] !== 0) {
      const empty = board.flatMap((row, r) => row.map((n, c) => n === 0 ? [r,c] as [number,number] : null)).filter((n): n is [number,number] => n !== null);
      if (!empty.length) return;
      cell = empty[0]; setSelected(cell);
    }
    const [r,c] = cell; const next = board.map(row => [...row]); next[r][c] = solution[r][c]; setBoard(next); setHints(hints - 1);
    if (boardComplete(next, solution)) { setPhase('won'); void saveScore(finalScore(elapsed, mistakes, hints - 1), elapsed, 'completed'); }
  };
  useEffect(() => {
    const listener = (e: KeyboardEvent) => { if (phase !== 'playing' || !selected) return; if (/^[1-9]$/.test(e.key)) update(Number(e.key)); if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') update(0); };
    window.addEventListener('keydown', listener); return () => window.removeEventListener('keydown', listener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, selected, board, mistakes, hints, elapsed]);
  return <GameFrame title="Sudoku." kicker="LOGIC / NUMBER PUZZLE" elapsed={phase === 'setup' ? undefined : elapsed} instructions="Fill each row, column, and 3 × 3 square with every digit from 1 to 9." onRestart={phase === 'setup' ? undefined : newGame} status={saveState || 'Use your keyboard or the number pad. Wrong guesses count as mistakes.'}>
    {phase === 'setup' ? <div className="game-setup"><div className="setup-icon violet"><Grid3X3 size={40}/></div><h2>Think in numbers.</h2><p>Pick a difficulty to begin your puzzle.</p><div className="choice-pills">{(['easy','medium','hard'] as Difficulty[]).map(d => <button className={difficulty === d ? 'selected' : ''} onClick={() => setDifficulty(d)} key={d}>{d[0].toUpperCase() + d.slice(1)}</button>)}</div><button className="button button-primary button-lg" onClick={newGame}>Start puzzle <Sparkles size={18}/></button></div> : phase !== 'playing' ? <GameResult title={phase === 'won' ? 'Puzzle solved. Brilliant!' : 'Three strikes. Try again!'} description={phase === 'won' ? `Solved in ${elapsed} seconds with ${mistakes} mistakes.` : 'A fresh grid is your next challenge.'} score={phase === 'won' ? finalScore(elapsed, mistakes, hints) : 0} onRestart={newGame}/> : <div className="sudoku-stage"><div className="sudoku-top"><span><Pencil size={17}/> {difficulty.toUpperCase()}</span><span className="mistake-count">Mistakes <b>{mistakes}/3</b></span><span><Lightbulb size={17}/> {hints} hints</span></div>
      <div className="sudoku-board" role="grid" aria-label="Sudoku puzzle">{board.map((row, r) => row.map((value, c) => {
        const active = selected?.[0] === r && selected?.[1] === c;
        const same = value && selected && board[selected[0]][selected[1]] === value;
        return <button type="button" role="gridcell" aria-selected={!!active} aria-label={`Row ${r + 1}, column ${c + 1}, ${value || 'empty'}`} key={`${r}-${c}`} onClick={() => setSelected([r,c])} className={`sudoku-cell ${initial[r][c] ? 'given' : 'entered'} ${active ? 'selected' : ''} ${same && !active ? 'matching' : ''} ${r % 3 === 2 ? 'block-row' : ''} ${c % 3 === 2 ? 'block-col' : ''}`}>{value || ''}</button>;
      }))}</div>
      <div className="number-pad">{[1,2,3,4,5,6,7,8,9].map(n => <button key={n} onClick={() => update(n)} aria-label={`Enter ${n}`}>{n}</button>)}</div><div className="sudoku-actions"><button className="button button-outline" onClick={() => update(0)}><Eraser size={17}/> Erase</button><button className="button button-outline" disabled={hints === 0} onClick={hint}><Lightbulb size={17}/> Hint ({hints})</button></div></div>}
  </GameFrame>;
}
