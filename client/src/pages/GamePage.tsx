import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { api, type Game } from '../lib/api';
import { FALLBACK_GAMES } from '../lib/catalog';
import { GameCard } from '../components/GameCard';
export default function Games() {
  const [games, setGames] = useState<Game[]>(FALLBACK_GAMES);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All games');
  const [error, setError] = useState('');
  useEffect(() => { api<Game[]>('/games').then(setGames).catch(() => setError('You are browsing in demo mode. Start the API server to sync your progress.')); }, []);
  const categories = ['All games', ...new Set(games.map(g => g.category))];
  const visible = useMemo(() => games.filter(g => (category === 'All games' || g.category === category) && `${g.title} ${g.description}`.toLowerCase().includes(query.toLowerCase())), [games, query, category]);
  return <section className="shell standard-page"><div className="page-heading"><span className="eyebrow"><Sparkles size={14}/> THE GAME LIBRARY</span><h1>Pick your <em>brain break.</em></h1><p>Big fun in small packages. Browse, explore, and find your favorite way to unwind.</p></div>
    <div className="filter-bar"><label className="search-field"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search games…" aria-label="Search games"/></label><div className="filters"><SlidersHorizontal size={18}/>{categories.map(c => <button key={c} className={`filter-chip ${category === c ? 'selected' : ''}`} onClick={() => setCategory(c)}>{c}</button>)}</div></div>
    {error && <div className="notice">{error}</div>}
    <div className="results-meta">Showing <strong>{visible.length}</strong> {visible.length === 1 ? 'game' : 'games'}</div><div className="game-grid">{visible.map(game => <GameCard game={game} key={game.id} onFavorite={(id, isFavorite) => setGames(old => old.map(g => g.id === id ? { ...g, isFavorite } : g))}/>)}</div>
    {visible.length === 0 && <div className="empty-screen"><p>Nothing matches that search.</p><button className="button button-outline" onClick={() => { setQuery(''); setCategory('All games'); }}>Clear filters</button></div>}
  </section>;
}
