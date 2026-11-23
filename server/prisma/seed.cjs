require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');
const db = new PrismaClient();
const games = [
  { slug: 'sudoku', title: 'Sudoku', description: 'Find the hidden pattern. Fill a 9 × 9 grid with logic and patience.', category: 'Logic', difficulty: 'Challenging', icon: 'grid-3x3', accent: 'violet' },
  { slug: 'tic-tac-toe', title: 'Tic Tac Toe', description: 'Outsmart the bot in a classic or ultimate nine-board match.', category: 'Strategy', difficulty: 'Medium', icon: 'grid-2x2', accent: 'mint' },
  { slug: 'rock-paper-scissors', title: 'Rock Paper Scissors', description: 'Think fast and win a best-of series against the machine.', category: 'Quick play', difficulty: 'Easy', icon: 'hand', accent: 'orange' },
  { slug: 'memory-match', title: 'Memory Match', description: 'Flip colorful cards and find the matching pairs.', category: 'Memory', difficulty: 'Medium', icon: 'brain', accent: 'pink' },
  { slug: 'math-sprint', title: 'Math Sprint', description: 'A 60-second arithmetic challenge to sharpen your reflexes.', category: 'Quick play', difficulty: 'Medium', icon: 'zap', accent: 'blue' },
];
async function main() {
  for (const game of games) await db.game.upsert({ where: { slug: game.slug }, update: {}, create: game });
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 10) throw new Error('ADMIN_PASSWORD must have 10+ characters');
    const existing = await db.user.findUnique({ where: { email } });
    if (existing && existing.role !== 'ADMIN') throw new Error('ADMIN_EMAIL belongs to an existing player. Choose a different email; automatic promotion is forbidden.');
    if (!existing) await db.user.create({ data: { email, name: 'Administrator', role: 'ADMIN', password: await argon2.hash(password) } });
    console.log(`Admin account ready: ${email}`);
  } else console.log('No admin seeded (set ADMIN_EMAIL and ADMIN_PASSWORD in .env)');
  console.log('Starter games seeded.');
}
main().catch(err => { console.error(err); process.exitCode = 1; }).finally(() => db.$disconnect());
