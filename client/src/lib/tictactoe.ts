export type Mark = 'X'|'O'|null;
export type Result = 'X'|'O'|'T'|null;
export const lines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
export function winner(board: Mark[]): Result {
  for (const [a,b,c] of lines) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  return board.every(Boolean) ? 'T' : null;
}
function evaluate(board: Mark[], maximizing: boolean, depth: number): number {
  const result = winner(board);
  if (result === 'O') return 10 - depth;
  if (result === 'X') return depth - 10;
  if (result === 'T') return 0;
  const scores = board.flatMap((cell, i) => {
    if (cell) return [];
    const next = [...board]; next[i] = maximizing ? 'O' : 'X';
    return [evaluate(next, !maximizing, depth + 1)];
  });
  return maximizing ? Math.max(...scores) : Math.min(...scores);
}
export function botClassic(board: Mark[], level: 'casual'|'smart'): number {
  const available = board.map((cell,i) => cell === null ? i : -1).filter(i => i !== -1);
  if (!available.length) return -1;
  if (level === 'casual') return available[Math.floor(Math.random() * available.length)];
  let best = -Infinity; let pick = available[0];
  for (const i of available) { const next = [...board]; next[i] = 'O'; const score = evaluate(next, false, 0); if (score > best) { best = score; pick = i; } }
  return pick;
}
export function botUltimate(boards: Mark[][], owners: Result[], target: number | null): [number,number] | null {
  const forced = target !== null && owners[target] === null ? target : null;
  const allowed = owners.map((owner,i) => owner === null && (forced === null || forced === i) ? i : -1).filter(i => i !== -1);
  if (!allowed.length) return null;
  // Prefer a winning local move, then a block, then a strategic center.
  for (const sub of allowed) for (const player of ['O','X'] as const) for (let cell = 0; cell < 9; cell++) {
    if (boards[sub][cell] !== null) continue;
    const copy = [...boards[sub]]; copy[cell] = player;
    if (winner(copy) === player) return [sub,cell];
  }
  const squares = allowed.flatMap(sub => boards[sub].map((value, cell) => value === null ? [sub,cell] as [number,number] : null).filter((m): m is [number,number] => m !== null));
  if (!squares.length) return null;
  const centers = squares.filter(([,cell]) => cell === 4);
  return (centers.length ? centers : squares)[Math.floor(Math.random() * (centers.length || squares.length))];
}
