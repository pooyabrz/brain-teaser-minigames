import { Link } from 'react-router-dom';
import { ArrowUpRight, Heart, Play } from 'lucide-react';
import { useState } from 'react';
import { DEMO_MODE, api, type Game } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { GameIcon, Illustration, playableSlugs } from '../lib/catalog';
export function GameCard({ game, onFavorite }: { game: Game; onFavorite?: (id: number, value: boolean) => void }) {
  const { user } = useAuth(); const [saving, setSaving] = useState(false);
  const playable = playableSlugs.includes(game.slug);
  const favorite = async () => {
    if (!user && !DEMO_MODE) return;
    setSaving(true);
    try { const result = await api<{ isFavorite: boolean }>(`/games/${game.id}/favorite`, 'POST'); onFavorite?.(game.id, result.isFavorite); } catch { /* Keep existing status on failure */ } finally { setSaving(false); }
  };
  return <article className={`game-card ${game.accent || 'violet'}`}>
    <div className="game-card-art"><div className="game-art-icon"><GameIcon slug={game.slug} size={21}/></div><Illustration slug={game.slug}/><span className="game-art-corner">✦</span></div>
    <div className="game-card-content"><div className="game-card-top"><span className="eyebrow">{game.category}</span>{(user || DEMO_MODE) && <button className={`favorite-btn ${game.isFavorite ? 'saved' : ''}`} onClick={favorite} disabled={saving} aria-label={game.isFavorite ? `Remove ${game.title} from favorites` : `Favorite ${game.title}`}><Heart size={18} fill={game.isFavorite ? 'currentColor' : 'none'}/></button>}</div>
    <h3><Link to={`/games/${game.slug}`}>{game.title}</Link></h3><p>{game.description}</p><div className="game-card-bottom"><span className="game-difficulty"><i/> {game.difficulty}</span>{playable ? <Link to={`/play/${game.slug}`} className="game-play" aria-label={`Play ${game.title}`}><Play size={17} fill="currentColor"/></Link> : <span className="soon" title="This game does not have an implementation">Coming soon <ArrowUpRight size={13}/></span>}</div></div>
  </article>;
}
