export type MathDifficulty = 'easy'|'medium'|'hard';
export type MathQuestion = { text: string; answer: number; options: number[] };
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
export function makeQuestion(level: MathDifficulty): MathQuestion {
  const max = level === 'easy' ? 15 : level === 'medium' ? 35 : 75;
  const a = random(1, max), b = random(1, level === 'hard' ? 12 : max);
  const op = level === 'easy' ? random(0, 1) : random(0, 2);
  const first = op === 1 ? Math.max(a, b) : a; const second = op === 1 ? Math.min(a, b) : b;
  const answer = op === 0 ? first + second : op === 1 ? first - second : first * second;
  const options = new Set<number>([answer]);
  let attempts = 0;
  while (options.size < 4 && attempts < 100) { attempts++; const delta = random(1, Math.max(5, Math.floor(answer * .18))); const guess = Math.max(0, answer + (Math.random() < .5 ? -delta : delta)); options.add(guess); }
  for (let n = 1; options.size < 4; n++) options.add(answer + n);
  const answers = [...options].sort(() => Math.random() - .5);
  return { text: `${first} ${op === 0 ? '+' : op === 1 ? '−' : '×'} ${second}`, answer, options: answers };
}
