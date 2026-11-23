import { useEffect, useState } from 'react';
import { Hand, HandMetal, Scissors, Sparkles, Trophy } from 'lucide-react';
import { GameFrame, GameResult } from '../components/GameFrame';
import { useScore } from '../lib/useScore';

import { outcomeOf, type Choice } from '../lib/rps';
const choices = [ { label: 'Rock', emoji: '✊', icon: HandMetal }, { label: 'Paper', emoji: '✋', icon: Hand }, { label: 'Scissors', emoji: '✌️', icon: Scissors } ];
export default function RPS() {
  const [roundLimit, setRoundLimit] = useState(5);
  const [phase, setPhase] = useState<'setup'|'playing'|'done'>('setup');
  const [played, setPlayed] = useState(0); const [wins, setWins] = useState(0); const [losses, setLosses] = useState(0); const [draws, setDraws] = useState(0);
  const [last, setLast] = useState<{ player: Choice; bot: Choice; outcome: string } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const { saveScore, resetScore, saveState } = useScore('rock-paper-scissors');
  useEffect(() => { if (phase !== 'playing') return; const id = window.setInterval(() => setElapsed(t => t + 1), 1000); return () => clearInterval(id); }, [phase]);
  const start = () => { resetScore(); setPhase('playing'); setPlayed(0); setWins(0); setLosses(0); setDraws(0); setLast(null); setElapsed(0); };
  const choose = (player: Choice) => {
    if (phase !== 'playing') return;
    const bot = Math.floor(Math.random() * 3) as Choice;
    const result = outcomeOf(player, bot);
    const nw = wins + Number(result === 'win'), nl = losses + Number(result === 'loss'), nd = draws + Number(result === 'draw');
    const total = played + 1;
    setLast({ player, bot, outcome: result }); setWins(nw); setLosses(nl); setDraws(nd); setPlayed(total);
    if (total >= roundLimit) { setPhase('done'); void saveScore(nw * 150 + nd * 50, elapsed, nw > nl ? 'win' : nl > nw ? 'loss' : 'draw'); }
  };
  const score = wins * 150 + draws * 50;
  return <GameFrame title="Rock, paper, scissors." kicker="QUICK PLAY / CLASSIC" elapsed={phase === 'setup' ? undefined : elapsed} instructions="A timeless showdown. Choose your move and see if you can beat the bot." onRestart={phase !== 'setup' ? start : undefined} status={saveState || 'Beat the bot over a best-of series. Each win earns 150 points.'}>
    {phase === 'setup' ? <div className="game-setup"><div className="setup-icon orange"><Hand size={40}/></div><h2>Ready to throw down?</h2><p>How many rounds should we play?</p><div className="choice-pills">{[3,5,7].map(n => <button className={roundLimit === n ? 'selected' : ''} key={n} onClick={() => setRoundLimit(n)}>{n} rounds</button>)}</div><button className="button button-primary button-lg" onClick={start}>Start match <Sparkles size={18}/></button></div> : phase === 'done' ? <GameResult title={wins > losses ? 'You win the match!' : wins < losses ? 'The bot wins this one!' : "It's a draw!"} description={`${wins} wins · ${losses} losses · ${draws} draws`} score={score} onRestart={start}/> : <div className="rps-stage">
      <div className="round-tracker"><span>ROUND {played + 1} OF {roundLimit}</span><div className="round-progress"><div style={{ width: `${played / roundLimit * 100}%` }}/></div></div>
      <div className="rps-scoreboard"><div><span>YOU</span><strong>{wins}</strong></div><span className="rps-versus">VS</span><div><span>BOT</span><strong>{losses}</strong></div></div>
      {last ? <div className="rps-reveal"><span>{choices[last.player].emoji}</span><div><small>LAST ROUND</small><strong>{last.outcome === 'win' ? 'Nice move! You won.' : last.outcome === 'loss' ? 'The bot got you!' : 'A perfect tie.'}</strong></div><span>{choices[last.bot].emoji}</span></div> : <div className="rps-hint">Make your first move below!</div>}
      <h3>Choose your move</h3><div className="rps-choices">{choices.map((choice, i) => <button onClick={() => choose(i as Choice)} key={choice.label} aria-label={`Choose ${choice.label}`} className="rps-choice"><span>{choice.emoji}</span><b>{choice.label}</b></button>)}</div><div className="rps-small"><Trophy size={15}/> {draws} draws so far</div>
    </div>}
  </GameFrame>;
}
