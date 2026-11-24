import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Crown, Medal, Trophy } from 'lucide-react';
import { DEMO_MODE, api, type Leader } from '../lib/api';
import { FALLBACK_GAMES } from '../lib/catalog';
export default function Leaderboard() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [game, setGame] = useState('sudoku');
  const [verified,setVerified]=useState(false);
  const [error, setError] = useState('');
  useEffect(() => { api<Leader[]>(`${verified?'/v2/leaderboards':'/leaderboard'}?game=${encodeURIComponent(game)}`).then(data => { setLeaders(data); setError(''); }).catch(() => setError('Could not load scores. Check that the API server is running.')); }, [game,verified]);
  return <section className="shell standard-page"><div className="page-heading"><span className="eyebrow"><Trophy size={16}/> THE HALL OF FAME</span><h1>Brains on <em>top.</em></h1><p>{DEMO_MODE?'Your completed practice scores on this device. Not a global or verified leaderboard.':'Casual client-reported scores, separated by game. These are not verified rankings.'}</p></div>
    <div className="leader-banner"><div><div className="eyebrow">THE CHALLENGE IS ON</div><h2>Every point counts.</h2><p>Play, improve, and find your name up here.</p></div><div className="leader-crown"><Crown size={80} strokeWidth={1.5}/></div></div>
    {!DEMO_MODE&&<label><input type="checkbox" checked={verified} onChange={e=>setVerified(e.target.checked)}/> Rule-validated board (selected new games; not bot-proof)</label>}<div className="leader-controls"><h2><Medal size={22}/> {DEMO_MODE?'Personal records':'Top players'}</h2><label>Filter by game <select value={game} onChange={e => setGame(e.target.value)}>{FALLBACK_GAMES.map(g => <option value={g.slug} key={g.slug}>{g.title}</option>)}</select></label></div>
    {error && <div className="notice">{error}</div>}
    <div className="leader-table" role="table" aria-label="Top scores"><div className="leader-row leader-header" role="row"><span>RANK</span><span>PLAYER</span><span>GAME</span><span>SCORE</span></div>{leaders.map(entry => <div className="leader-row" role="row" key={entry.id}><span className={`rank rank-${entry.rank}`}>{entry.rank <= 3 ? <Trophy size={17}/> : `#${entry.rank}`}</span><span className="leader-person"><span className="leader-initial">{entry.name.charAt(0).toUpperCase()}</span><b>{entry.name}</b></span><span>{entry.game}</span><strong>{entry.score.toLocaleString()} <small>pts</small></strong></div>)}{leaders.length === 0 && !error && <div className="leader-empty"><Trophy size={37}/><h3>No scores yet</h3><p>{DEMO_MODE?'Finish a game to create your first personal record.':'Be the first to leave a mark on the leaderboard.'}</p><Link to="/games" className="button button-primary">Play a game <ArrowUpRight size={17}/></Link></div>}</div>
  </section>;
}
