import { Link } from 'react-router-dom';
import { ArrowLeft, Clock3, CircleHelp, Trophy, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { formatTime } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function GameFrame({ title, kicker, elapsed, children, instructions, onRestart, status }: { title: string; kicker: string; elapsed?: number; children: ReactNode; instructions: string; onRestart?: () => void; status?: ReactNode }) {
  return <section className="shell play-shell">
    <Link className="back-link" to="/games"><ArrowLeft size={17}/> All games</Link>
    <div className="play-top"><div><span className="eyebrow">{kicker}</span><h1>{title}</h1><p>{instructions}</p></div><div className="play-top-actions">{elapsed !== undefined && <span className="play-stat"><Clock3 size={18}/> {formatTime(elapsed)}</span>}{onRestart && <button className="button button-ghost" onClick={onRestart}><RotateCcw size={16}/> New game</button>}</div></div>
    <div className="game-stage">{children}</div>{status && <div className="game-footnote"><CircleHelp size={17}/> {status}</div>}
  </section>;
}
export function GameResult({ title, description, score, onRestart }: { title: string; description: string; score: number; onRestart: () => void }) {
  const { user } = useAuth();
  return <div className="result-box" role="status"><div className="result-icon"><Trophy size={27}/></div><h2>{title}</h2><p>{description}</p><div className="result-points">{score.toLocaleString()}<small> points</small></div>{!user && <p className="result-note">Sign in to save your future scores to the leaderboard.</p>}<button className="button button-primary" onClick={onRestart}><RotateCcw size={16}/> Play again</button></div>;
}
