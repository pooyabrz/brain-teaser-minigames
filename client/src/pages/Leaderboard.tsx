import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Crown, Medal, Trophy } from 'lucide-react';
import { api, type Leader } from '../lib/api';
import { FALLBACK_GAMES } from '../lib/catalog';
export default function Leaderboard() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [game, setGame] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { api<Leader[]>(`/leaderboard${game ? `?game=${encodeURIComponent(game)}` : ''}`).then(data => { setLeaders(data); setError(''); }).catch(() => setError('Could not load scores. Check that the API server is running.')); }, [game]);
  return <section className="shell standard-page"><div className="page-heading"><span className="eyebrow"><Trophy size={16}/> THE HALL OF FAME</span><h1>Brains on <em>top.</em></h1><p>A little friendly rivalry never hurt. Make a move and claim your spot.</p></div>
    <div className="leader-banner"><div><div className="eyebrow">THE CHALLENGE IS ON</div><h2>Every point counts.</h2><p>Play, improve, and find your name up here.</p></div><div className="leader-crown"><Crown size={80} strokeWidth={1.5}/></div></div>
    <div className="leader-controls"><h2><Medal size={22}/> Top players</h2><label>Filter by game <select value={game} onChange={e => setGame(e.target.value)}><option value="">All games</option>{FALLBACK_GAMES.map(g => <option value={g.slug} key={g.slug}>{g.title}</option>)}</select></label></div>
    {error && <div className="notice">{error}</div>}
    <div className="leader-table" role="table" aria-label="Top scores"><div className="leader-row leader-header" role="row"><span>RANK</span><span>PLAYER</span><span>GAME</span><span>SCORE</span></div>{leaders.map(entry => <div className="leader-row" role="row" key={entry.id}><span className={`rank rank-${entry.rank}`}>{entry.rank <= 3 ? <Trophy size={17}/> : `#${entry.rank}`}</span><span className="leader-person"><span className="leader-initial">{entry.name.charAt(0).toUpperCase()}</span><b>{entry.name}</b></span><span>{entry.game}</span><strong>{entry.score.toLocaleString()} <small>pts</small></strong></div>)}{leaders.length === 0 && !error && <div className="leader-empty"><Trophy size={37}/><h3>No scores yet</h3><p>Be the first to leave a mark on the leaderboard.</p><Link to="/games" className="button button-primary">Play a game <ArrowUpRight size={17}/></Link></div>}</div>
  </section>;
}
