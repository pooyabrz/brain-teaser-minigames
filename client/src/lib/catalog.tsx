import { extra } from '../games/engines';
import { BrainCircuit, Calculator, Grid2X2, Grid3X3, Hand, Puzzle, Sparkles } from 'lucide-react';
import type { Game } from './api';
import type { ReactNode } from 'react';
export const playableSlugs = ['sudoku', 'tic-tac-toe', 'rock-paper-scissors', 'memory-match', 'math-sprint', ...extra.map(g=>g[0])];
export const FALLBACK_GAMES: Game[] = [
  { id: 1, slug: 'sudoku', title: 'Sudoku', description: 'Find the hidden pattern. Fill a 9 × 9 grid with logic and patience.', category: 'Logic', difficulty: 'Challenging', icon: 'grid-3x3', accent: 'violet', isFavorite: false, plays: 0 },
  { id: 2, slug: 'tic-tac-toe', title: 'Tic Tac Toe', description: 'Outsmart the bot in a classic or ultimate nine-board match.', category: 'Strategy', difficulty: 'Medium', icon: 'grid-2x2', accent: 'mint', isFavorite: false, plays: 0 },
  { id: 3, slug: 'rock-paper-scissors', title: 'Rock Paper Scissors', description: 'Think fast and win a best-of series against the machine.', category: 'Quick play', difficulty: 'Easy', icon: 'hand', accent: 'orange', isFavorite: false, plays: 0 },
  { id: 4, slug: 'memory-match', title: 'Memory Match', description: 'Flip colorful cards and find the matching pairs.', category: 'Memory', difficulty: 'Medium', icon: 'brain', accent: 'pink', isFavorite: false, plays: 0 },
  { id: 5, slug: 'math-sprint', title: 'Math Sprint', description: 'A 60-second arithmetic challenge to sharpen your reflexes.', category: 'Quick play', difficulty: 'Medium', icon: 'zap', accent: 'blue', isFavorite: false, plays: 0 },
];
FALLBACK_GAMES.push(...extra.map((g,i)=>({id:6+i,slug:g[0],title:g[1],category:g[2],description:g[3],difficulty:'Medium',icon:'puzzle',accent:['violet','mint','orange','pink','blue'][i%5],isFavorite:false,plays:0})));
export function GameIcon({ slug, size = 28 }: { slug: string; size?: number }): ReactNode {
  const props = { size, strokeWidth: 1.8 };
  if (slug === 'sudoku') return <Grid3X3 {...props} />;
  if (slug === 'tic-tac-toe') return <Grid2X2 {...props} />;
  if (slug === 'rock-paper-scissors') return <Hand {...props} />;
  if (slug === 'memory-match') return <BrainCircuit {...props} />;
  if (slug === 'math-sprint') return <Calculator {...props} />;
  return <Puzzle {...props} />;
}
export function Illustration({ slug }: { slug: string }) {
  if (slug === 'sudoku') return <div className="mini-sudoku">{[5, 2, '', 7, '', 8, '', 4, 3].map((n, i) => <span key={i}>{n}</span>)}</div>;
  if (slug === 'tic-tac-toe') return <div className="mini-tic"><span>×</span><span>○</span><span>×</span><span>○</span><span>×</span><span>○</span><span>○</span><span>×</span><span>×</span></div>;
  if (slug === 'rock-paper-scissors') return <div className="mini-emoji">✊ <span>✌️</span> ✋</div>;
  if (slug === 'memory-match') return <div className="mini-memory"><span>✦</span><span>?</span><span>◆</span><span>✦</span></div>;
  if (slug === 'math-sprint') return <div className="mini-math">12 <span>+</span> 8 <span>=</span> ?</div>;
  return <div className="mini-fallback arcade-art">{extra.find(g=>g[0]===slug)?.[4] || <Sparkles size={70}/>}</div>;
}
