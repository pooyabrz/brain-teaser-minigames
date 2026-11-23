import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, type Game } from '../lib/api';
import { playableSlugs } from '../lib/catalog';
import RPS from './RPS';
import TicTacToe from './TicTacToe';
import Sudoku from './Sudoku';
import MemoryMatch from './MemoryMatch';
import MathSprint from './MathSprint';
export default function GameRouter() {
  const { slug } = useParams();
  const [published, setPublished] = useState<boolean | null>(null);
  useEffect(() => {
    setPublished(null);
    api<Game[]>('/games').then(games => setPublished(games.some(game => game.slug === slug))).catch(() => setPublished(true));
  }, [slug]);
  if (!slug || !playableSlugs.includes(slug)) return <section className="shell empty-screen"><h1>Game not found</h1><p>This game doesn't have a playable module yet.</p><Link className="button button-primary" to="/games">Browse games</Link></section>;
  if (published === null) return <section className="shell empty-screen">Loading game…</section>;
  if (!published) return <section className="shell empty-screen"><h1>Game unavailable</h1><p>This game is currently hidden by an administrator.</p><Link className="button button-primary" to="/games">Browse games</Link></section>;
  switch (slug) { case 'sudoku': return <Sudoku/>; case 'tic-tac-toe': return <TicTacToe/>; case 'rock-paper-scissors': return <RPS/>; case 'memory-match': return <MemoryMatch/>; case 'math-sprint': return <MathSprint/>; default: return <section className="shell empty-screen"><h1>Game not found</h1><p>This game doesn't have a playable module yet.</p><Link className="button button-primary" to="/games">Browse games</Link></section>; }
}
