import { ProgressStrip } from './Platform';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Brain, Clock3, Flame, Gamepad2, Sparkles, Trophy, Users, Zap } from 'lucide-react';
import { DEMO_MODE, api, type Game, type Stats } from '../lib/api';
import { FALLBACK_GAMES } from '../lib/catalog';
import { GameCard } from '../components/GameCard';
import { useAuth } from '../context/AuthContext';
export default function Dashboard() {
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>(FALLBACK_GAMES);
  const [stats, setStats] = useState<Stats | null>(null);
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    api<Game[]>('/games').then(setGames).catch(() => setOffline(true));
    if (user) api<Stats>('/me/stats').then(setStats).catch(() => undefined);
  }, [user]);
  const markFavorite = (id: number, isFavorite: boolean) => setGames(old => old.map(g => g.id === id ? { ...g, isFavorite } : g));
  return <>
    <section className="hero"><div className="shell hero-inner"><div className="hero-copy"><div className="hero-kicker"><span className="pulse-dot"/> THE PLAYGROUND FOR CURIOUS MINDS <Sparkles size={15}/></div>
    <h1>Unleash your<br/><em>mind.</em><span className="hero-asterisk">✳</span></h1><p>Play smarter. Think faster. Level up. Your next challenge is waiting.</p>
    <div className="hero-cta"><Link className="button button-primary button-lg" to="/games">Explore games <ArrowUpRight size={18}/></Link><Link className="button button-outline button-lg" to="/daily"><Trophy size={17}/> Daily challenge</Link></div>
    <div className="hero-social"><div className="social-avatars"><span>🧠</span><span>🎮</span><span>✨</span></div><span><b>25 ways to play</b><br/>Start any game for free</span></div></div>
    <div className="hero-visual" aria-hidden="true"><div className="hero-doodle star-one">✳</div><div className="hero-doodle star-two">✦</div><div className="hero-doodle circle-one">◌</div><div className="hero-orbit orbit-a"/><div className="hero-orbit orbit-b"/><div className="hero-main-tile"><div className="hero-tile-top">LEVEL UP YOUR MIND <span>✷</span></div><div className="hero-brain"><Brain size={156} strokeWidth={1.25}/><span>⚡</span></div><div className="hero-tile-bottom"><span>READY PLAYER ONE</span><span>01 / 25</span></div></div><div className="float-card float-a"><Zap size={22} fill="currentColor"/> +10 BRAIN POWER</div><div className="float-card float-b"><Trophy size={22}/> NICE WORK!</div><span className="hero-visual-dot dot-a"/><span className="hero-visual-dot dot-b"/></div>
    </div></section>
    <section className="shell dashboard-content">
      <ProgressStrip/><div className="stats-strip"><div className="stats-item"><span className="stats-icon purple"><Gamepad2 size={24}/></span><div><strong>{stats?.gamesPlayed ?? '25'}</strong><small>{user ? 'Games completed' : 'Mini games'}</small></div></div><div className="stats-item"><span className="stats-icon mint"><Trophy size={24}/></span><div><strong>{stats?.bestScore ?? '∞'}</strong><small>{user ? 'Your best score' : 'Chances to grow'}</small></div></div><div className="stats-item"><span className="stats-icon orange"><Flame size={24}/></span><div><strong>{stats?.wins ?? '24/7'}</strong><small>{user ? 'Victories' : 'Fun on demand'}</small></div></div><div className="stats-item"><span className="stats-icon pink"><Users size={24}/></span><div><strong>{stats?.favorites ?? '100%'}</strong><small>{user ? 'Favorite games' : 'Free to explore'}</small></div></div></div>
      {DEMO_MODE && <div className="notice">Standalone arcade · Your scores, favorites and progress stay in this browser. No account required.</div>}
      {offline && <div className="notice">Demo mode: Games are playable, but accounts, favorites, and scores require the API server.</div>}
      <div className="section-heading"><div><span className="eyebrow"><span className="eyebrow-dot"/> PICK YOUR CHALLENGE</span><h2>Find your next <em>obsession.</em></h2><p>Explore 25 games across eight skill categories.</p></div><Link to="/games" className="text-link">See all games <ArrowRight size={18}/></Link></div>
      <div className="game-grid">{games.slice(0, 3).map(game => <GameCard key={game.id} game={game} onFavorite={markFavorite}/>)}</div>
      <div className="bottom-banners"><Link to="/games" className="banner banner-purple"><div className="banner-badge"><Clock3 size={16}/> QUICK BREAK?</div><h3>Five minutes. <br/>A sharper mind.</h3><p>Turn screen time into playtime.</p><span className="banner-arrow"><ArrowUpRight size={23}/></span><span className="banner-art">✴</span></Link><Link to="/leaderboard" className="banner banner-lime"><div className="banner-badge"><Trophy size={16}/> A LITTLE COMPETITION</div><h3>Got what it takes <br/>to top the board?</h3><p>Put your best scores on display.</p><span className="banner-arrow"><ArrowUpRight size={23}/></span><span className="banner-art">★</span></Link></div>
    </section>
  </>;
}
