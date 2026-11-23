import { useEffect, useState } from 'react';
import { Calculator, Zap } from 'lucide-react';
import { GameFrame, GameResult } from '../components/GameFrame';
import { useScore } from '../lib/useScore';
import { makeQuestion, type MathDifficulty as Difficulty, type MathQuestion as Question } from '../lib/math';
export default function MathSprint() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium'); const [phase, setPhase] = useState<'setup'|'playing'|'done'>('setup');
  const [question, setQuestion] = useState<Question>(() => makeQuestion('medium'));
  const [remaining, setRemaining] = useState(60); const [correct, setCorrect] = useState(0); const [wrong, setWrong] = useState(0); const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const { saveScore, resetScore, saveState } = useScore('math-sprint');
  useEffect(() => { if (phase !== 'playing') return; const id = window.setInterval(() => setRemaining(t => Math.max(0, t - 1)), 1000); return () => window.clearInterval(id); }, [phase]);
  useEffect(() => { if (phase === 'playing' && remaining === 0) { setPhase('done'); void saveScore(Math.max(0, correct * 120 - wrong * 20), 60, 'completed'); } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, remaining, correct, wrong]);
  const start = () => { resetScore(); setRemaining(60); setCorrect(0); setWrong(0); setLastCorrect(null); setQuestion(makeQuestion(difficulty)); setPhase('playing'); };
  const answer = (value: number) => {
    if (phase !== 'playing' || remaining <= 0) return;
    const good = value === question.answer;
    setCorrect(c => c + Number(good)); setWrong(w => w + Number(!good)); setLastCorrect(good);
    setQuestion(makeQuestion(difficulty));
  };
  useEffect(() => { const listener = (e: KeyboardEvent) => { if (phase !== 'playing') return; const index = Number(e.key) - 1; if (index >= 0 && index < 4) answer(question.options[index]); }; window.addEventListener('keydown', listener); return () => window.removeEventListener('keydown', listener); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, question, remaining]);
  return <GameFrame title="Math Sprint." kicker="QUICK PLAY / MENTAL MATH" elapsed={phase === 'setup' ? undefined : 60 - remaining} instructions="Sixty seconds on the clock. Answer as many quick-fire math questions as you can." onRestart={phase === 'setup' ? undefined : start} status={saveState || 'Click an answer or use number keys 1–4. A correct answer earns 120 points.'}>
    {phase === 'setup' ? <div className="game-setup"><div className="setup-icon blue"><Calculator size={40}/></div><h2>Time to crunch.</h2><p>Choose your level and get ready for 60 seconds of numbers.</p><div className="choice-pills">{(['easy','medium','hard'] as Difficulty[]).map(n => <button key={n} className={difficulty === n ? 'selected' : ''} onClick={() => setDifficulty(n)}>{n[0].toUpperCase() + n.slice(1)}</button>)}</div><button className="button button-primary button-lg" onClick={start}>Start sprint <Zap size={18}/></button></div> : phase === 'done' ? <GameResult title="Time's up. Great hustle!" description={`${correct} correct answers · ${wrong} to practice`} score={Math.max(0, correct * 120 - wrong * 20)} onRestart={start}/> : <div className="math-stage"><div className="math-stats"><div><small>TIME LEFT</small><b>{remaining}s</b></div><div><small>RIGHT ANSWERS</small><b>{correct}</b></div><div><small>TO IMPROVE</small><b>{wrong}</b></div></div><div className="math-timer-track"><div style={{ width: `${remaining / 60 * 100}%` }}/></div><div className="math-question"><span>WHAT IS THE ANSWER?</span><h2>{question.text} <em>= ?</em></h2></div><div className="math-options">{question.options.map((n, i) => <button key={`${question.text}-${i}`} onClick={() => answer(n)}><small>{i + 1}</small>{n}</button>)}</div><div className={`math-feedback ${lastCorrect === true ? 'good' : lastCorrect === false ? 'bad' : ''}`} aria-live="polite">{lastCorrect === null ? 'Your brain is warming up…' : lastCorrect ? '✓ Nice one! Keep going!' : 'Not quite — onto the next!'}</div></div>}
  </GameFrame>;
}
