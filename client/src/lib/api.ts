import { FALLBACK_GAMES } from './catalog';
import { localFavorites, toggleLocalFavorite, localLeaders } from './demo';
export const DEMO_MODE = import.meta.env.MODE === 'pages';
export interface User { id: number; name: string; email: string; role: 'PLAYER' | 'ADMIN' }
export interface Game { id: number; slug: string; title: string; description: string; category: string; difficulty: string; icon: string; accent: string; plays: number; isFavorite: boolean; isPublished?: boolean }
export interface Stats { gamesPlayed: number; bestScore: number; wins: number; favorites: number; recent: { id: number; game: string; slug: string; score: number; outcome: string; createdAt: string }[] }
export interface Leader { rank: number; id: number; name: string; game: string; slug: string; score: number; elapsed: number; userId: number }

export async function api<T>(path: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET', body?: unknown): Promise<T> {
  if (DEMO_MODE) {
    if (method === 'GET' && path === '/auth/me') return { user: null } as T;
    if (method === 'GET' && path === '/games') return FALLBACK_GAMES.map(g => ({...g, isFavorite: localFavorites().includes(g.slug)})) as T;
    const favorite = /^\/games\/(\d+)\/favorite$/.exec(path);
    if (method === 'POST' && favorite) {
      const game = FALLBACK_GAMES.find(g => g.id === Number(favorite[1]));
      if (!game) throw new Error('Game not found');
      return { isFavorite: toggleLocalFavorite(game.slug) } as T;
    }
    if (method === 'GET' && path.startsWith('/leaderboard?')) {
      const slug = new URLSearchParams(path.split('?')[1]).get('game');
      const game = FALLBACK_GAMES.find(g => g.slug === slug);
      return (game ? localLeaders(game) : []) as T;
    }
    throw new Error('This feature requires the full-stack server. This edition stores practice data on your device.');
  }
  const response = await fetch(`/api${path}`, {
    method, credentials: 'include', headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((payload as { message?: string }).message || `Request failed (${response.status})`);
  return payload as T;
}
export const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
