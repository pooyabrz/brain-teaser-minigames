import type { Game, Leader } from './api';
import { results } from './progress.ts';
const KEY = 'bw-local-favorites';
export function localFavorites(): string[] {
  try { const value: unknown = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []; } catch { return []; }
}
export function toggleLocalFavorite(slug: string): boolean {
  const current = localFavorites();
  const added = !current.includes(slug);
  localStorage.setItem(KEY, JSON.stringify(added ? [...current, slug] : current.filter(v => v !== slug)));
  return added;
}
export function localLeaders(game: Pick<Game, 'slug' | 'title'>): Leader[] {
  return results().filter(r => r.slug === game.slug && r.completed && Number.isFinite(r.score))
    .sort((a,b) => b.score-a.score || a.elapsed-b.elapsed).slice(0, 20)
    .map((r,i) => ({rank:i+1,id:i+1,name:'You (local)',game:game.title,slug:game.slug,score:r.score,elapsed:r.elapsed,userId:0}));
}
