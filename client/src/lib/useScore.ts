import { rememberResult } from './progress';
import { extra } from '../games/engines';
import { useRef, useState } from 'react';
import { api } from './api';
import { useAuth } from '../context/AuthContext';
export function useScore(gameSlug: string) {
  const { user } = useAuth();
  const submitted = useRef(false);
  const [saveState, setSaveState] = useState('');
  const resetScore = () => { submitted.current = false; setSaveState(''); };
  const saveScore = async (score: number, elapsed: number, outcome: 'win'|'loss'|'draw'|'completed') => {
    if (submitted.current) return;
    submitted.current = true;
    if (!extra.some(g=>g[0]===gameSlug)) rememberResult({slug:gameSlug,score,elapsed,completed:outcome==='win'||outcome==='completed',date:new Date().toISOString()});
    if (!user) return;
    try { await api('/records', 'POST', { gameSlug, score, elapsed, outcome }); setSaveState('Score saved to your profile'); }
    catch { setSaveState('Could not save this score. Check your connection.'); }
  };
  return { saveScore, resetScore, saveState };
}
