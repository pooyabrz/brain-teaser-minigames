export type Board = number[][];
export type Difficulty = 'easy'|'medium'|'hard';
const samples: Record<Difficulty, string> = {
  easy:   '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
  medium: '000260701680070090190004500820100040004602900050003028009300074040050036703018000',
  hard:   '000000907000420180000705026100904000050000040000507009920108000034059000507000000',
};
export function safe(board: Board, row: number, col: number, n: number) {
  for (let i = 0; i < 9; i++) if (board[row][i] === n || board[i][col] === n) return false;
  for (let r = Math.floor(row / 3) * 3; r < Math.floor(row / 3) * 3 + 3; r++)
    for (let c = Math.floor(col / 3) * 3; c < Math.floor(col / 3) * 3 + 3; c++) if (board[r][c] === n) return false;
  return true;
}
export function solve(input: Board): Board | null {
  const board = input.map(row => [...row]);
  const find = (): boolean => {
    let best: [number,number,number[]] | null = null;
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (board[r][c]) continue;
      const options = Array.from({ length: 9 }, (_, i) => i + 1).filter(n => safe(board, r, c, n));
      if (!options.length) return false;
      if (!best || options.length < best[2].length) best = [r,c,options];
    }
    if (!best) return true;
    const [row, col, options] = best;
    for (const n of options) { board[row][col] = n; if (find()) return true; board[row][col] = 0; }
    return false;
  };
  return find() ? board : null;
}
function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}
export function puzzle(difficulty: Difficulty): { initial: Board; solution: Board } {
  const source = samples[difficulty];
  const parsed = Array.from({ length: 9 }, (_, r) => Array.from({ length: 9 }, (_, c) => Number(source[r * 9 + c])));
  const solved = solve(parsed);
  if (!solved) throw new Error('Invalid Sudoku template');
  const digits = shuffle([1,2,3,4,5,6,7,8,9]);
  const rowBands = shuffle([0,1,2]); const colBands = shuffle([0,1,2]);
  const rows = rowBands.flatMap(b => shuffle([0,1,2]).map(i => b * 3 + i));
  const cols = colBands.flatMap(b => shuffle([0,1,2]).map(i => b * 3 + i));
  const remap = (board: Board) => rows.map(r => cols.map(c => board[r][c] ? digits[board[r][c] - 1] : 0));
  return { initial: remap(parsed), solution: remap(solved) };
}
export function boardComplete(board: Board, solution: Board): boolean { return board.every((row, r) => row.every((n, c) => n === solution[r][c])); }
