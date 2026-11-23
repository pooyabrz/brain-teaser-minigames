export interface User { id: number; name: string; email: string; role: 'PLAYER' | 'ADMIN' }
export interface Game { id: number; slug: string; title: string; description: string; category: string; difficulty: string; icon: string; accent: string; plays: number; isFavorite: boolean; isPublished?: boolean }
export interface Stats { gamesPlayed: number; bestScore: number; wins: number; favorites: number; recent: { id: number; game: string; slug: string; score: number; outcome: string; createdAt: string }[] }
export interface Leader { rank: number; id: number; name: string; game: string; slug: string; score: number; elapsed: number; userId: number }

export async function api<T>(path: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET', body?: unknown): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method, credentials: 'include', headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((payload as { message?: string }).message || `Request failed (${response.status})`);
  return payload as T;
}
export const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
