import { useEffect, useRef, useState } from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { GameFrame, GameResult } from '../components/GameFrame';
import { useScore } from '../lib/useScore';
const symbols = ['🚀','🌈','🍒','🧩','🦊','🎸','🌙','🪐','🦄','🍩','🎨','⚡'];
type Card = { id: number; symbol: string };
function makeCards(pairs: number): Card[] {
  const cards = symbols.slice(0, pairs).flatMap((symbol, i) => [{ symbol, id: 2*i }, { symbol, id: 2*i+1 }]);
  for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [cards[i],cards[j]] = [cards[j],cards[i]]; }
  return cards;
}
export default function MemoryMatch() {
  const [pairs, setPairs] = useState(8); const [phase, setPhase] = useState<'setup'|'playing'|'done'>('setup');
  const [cards, setCards] = useState<Card[]>([]); const [flipped, setFlipped] = useState<number[]>([]); const [matched, setMatched] = useState<number[]>([]); const [moves, setMoves] = useState(0); const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);
  const { saveScore, resetScore, saveState } = useScore('memory-match');
  useEffect(() => { if (phase !== 'playing') return; const id = window.setInterval(() => setElapsed(s => s + 1), 1000); return () => clearInterval(id); }, [phase]);
  useEffect(() => () => { if (timerRef.current !== null) window.clearTimeout(timerRef.current); }, []);
  const start = () => { if (timerRef.current !== null) window.clearTimeout(timerRef.current); timerRef.current = null; resetScore(); setCards(makeCards(pairs)); setFlipped([]); setMatched([]); setMoves(0); setElapsed(0); setPhase('playing'); };
  const scoreFor = (count: number, time: number) => Math.max(100, pairs * 160 - Math.max(0, count - pairs) * 45 - time * 2);
  const flip = (id: number) => {
    if (phase !== 'playing' || flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    if (flipped.length === 0) { setFlipped([id]); return; }
    const a = cards.find(c => c.id === flipped[0]); const b = cards.find(c => c.id === id);
    if (!a || !b) return;
    const nextMoves = moves + 1; setMoves(nextMoves); setFlipped([flipped[0], id]);
    if (a.symbol === b.symbol) {
      const next = [...matched, flipped[0], id]; setMatched(next);
      timerRef.current = window.setTimeout(() => { setFlipped([]); timerRef.current = null; }, 300);
      if (next.length === cards.length) { setPhase('done'); void saveScore(scoreFor(nextMoves, elapsed), elapsed, 'completed'); }
    } else timerRef.current = window.setTimeout(() => { setFlipped([]); timerRef.current = null; }, 850);
  };
  return <GameFrame title="Memory Match." kicker="MEMORY / CARD FLIP" elapsed={phase === 'setup' ? undefined : elapsed} instructions="Find all the pairs. Take your time, remember what you've seen, and flip wisely." onRestart={phase === 'setup' ? undefined : start} status={saveState || 'Flip two cards at a time. Fewer moves and less time earn more points.'}>
    {phase === 'setup' ? <div className="game-setup"><div className="setup-icon pink"><BrainCircuit size={40}/></div><h2>Trust your memory.</h2><p>How many pairs do you want to match?</p><div className="choice-pills">{[6,8,10].map(n => <button className={pairs === n ? 'selected' : ''} onClick={() => setPairs(n)} key={n}>{n} pairs</button>)}</div><button className="button button-primary button-lg" onClick={start}>Shuffle cards <Sparkles size={18}/></button></div> : phase === 'done' ? <GameResult title="Perfectly matched!" description={`You found ${pairs} pairs in ${moves} moves.`} score={scoreFor(moves, elapsed)} onRestart={start}/> : <div className="memory-stage"><div className="memory-counters"><div><small>PAIRS FOUND</small><b>{matched.length/2} <span>/ {pairs}</span></b></div><div><small>MOVES</small><b>{moves}</b></div></div><div className={`memory-grid ${pairs === 10 ? 'memory-five' : ''}`}>{cards.map(card => {
      const faceUp = flipped.includes(card.id) || matched.includes(card.id);
      return <button key={card.id} className={`memory-card ${faceUp ? 'flipped' : ''} ${matched.includes(card.id) ? 'matched' : ''}`} onClick={() => flip(card.id)} disabled={matched.includes(card.id)} aria-label={faceUp ? `${card.symbol} card` : 'Face down card'}><span>{faceUp ? card.symbol : '✳'}</span></button>;
    })}</div></div>}
  </GameFrame>;
}
