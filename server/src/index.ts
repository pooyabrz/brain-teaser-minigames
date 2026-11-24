import { v2 } from './v2';
import { extra } from './games/engines';
import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const production = process.env.NODE_ENV === 'production';
const origins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173,http://localhost:5174').split(',').map(s => s.trim());

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  throw new Error('SESSION_SECRET must be configured with at least 32 characters.');
}
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
if (production) app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(cors({ origin: origins, credentials: true }));
app.use(express.json({ limit: '20kb' }));
app.use((req, res, next) => {
  // A same-site session cookie is not a substitute for rejecting foreign origins on writes.
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.headers.origin && !origins.includes(req.headers.origin)) {
    res.status(403).json({ message: 'Origin not allowed' });
    return;
  }
  next();
});
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
app.use(session({
  name: 'brain.sid',
  store: new (connectPgSimple(session))({ pool, createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { httpOnly: true, sameSite: 'lax', secure: production, maxAge: 7 * 24 * 60 * 60 * 1000 },
}));

declare module 'express-session' {
  interface SessionData { userId?: number }
}

type Handler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
const wrap = (fn: Handler): Handler => (req, res, next) => { Promise.resolve(fn(req, res, next)).catch(next); };
const error = (res: Response, code: number, message: string) => res.status(code).json({ message });
const safeUser = (user: { id: number; email: string; name: string; role: string }) => ({ id: user.id, email: user.email, name: user.name, role: user.role });
const emailOf = (value: unknown) => typeof value === 'string' ? value.trim().toLowerCase() : '';
const validEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
const validPassword = (s: unknown) => typeof s === 'string' && s.length >= 10 && s.length <= 128;
const requireUser: Handler = (req, res, next) => {
  if (!req.session.userId) { error(res, 401, 'Sign in to continue'); return; }
  next();
};
const requireAdmin: Handler = wrap(async (req, res, next) => {
  if (!req.session.userId) { error(res, 401, 'Sign in to continue'); return; }
  const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
  if (!user || user.role !== 'ADMIN') { error(res, 403, 'Administrator access required'); return; }
  next();
});
const loginSession = (req: Request, id: number) => new Promise<void>((resolve, reject) => {
  req.session.regenerate(err => {
    if (err) return reject(err);
    req.session.userId = id;
    req.session.save(err2 => err2 ? reject(err2) : resolve());
  });
});

app.get('/api/health', (_req, res) => { res.json({ status: 'ok' }); });
app.get('/api/auth/me', wrap(async (req, res) => {
  const user = req.session.userId && await prisma.user.findUnique({ where: { id: req.session.userId } });
  res.json({ user: user ? safeUser(user) : null });
}));
app.post('/api/auth/register', wrap(async (req, res) => {
  const email = emailOf(req.body.email);
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  if (!validEmail(email) || !validPassword(req.body.password) || name.length < 2 || name.length > 60) {
    error(res, 400, 'Use a valid name, email and password (at least 10 characters)'); return;
  }
  if (await prisma.user.findUnique({ where: { email } })) { error(res, 409, 'Email is already registered'); return; }
  const user = await prisma.user.create({ data: { email, name, password: await argon2.hash(req.body.password) } });
  await loginSession(req, user.id);
  res.status(201).json({ user: safeUser(user) });
}));
app.post('/api/auth/login', wrap(async (req, res) => {
  const email = emailOf(req.body.email);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || typeof req.body.password !== 'string' || !(await argon2.verify(user.password, req.body.password))) {
    error(res, 401, 'Incorrect email or password'); return;
  }
  await loginSession(req, user.id);
  res.json({ user: safeUser(user) });
}));
app.post('/api/auth/logout', wrap(async (req, res) => {
  await new Promise<void>((resolve, reject) => req.session.destroy(err => err ? reject(err) : resolve()));
  res.clearCookie('brain.sid');
  res.json({ message: 'Signed out' });
}));
app.patch('/api/account', requireUser, wrap(async (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  if (name.length < 2 || name.length > 60) { error(res, 400, 'Name must be 2–60 characters'); return; }
  const user = await prisma.user.update({ where: { id: req.session.userId! }, data: { name } });
  res.json({ user: safeUser(user) });
}));
app.post('/api/account/password', requireUser, wrap(async (req, res) => {
  if (!validPassword(req.body.newPassword) || typeof req.body.currentPassword !== 'string') {
    error(res, 400, 'New password must have at least 10 characters'); return;
  }
  const user = await prisma.user.findUniqueOrThrow({ where: { id: req.session.userId! } });
  if (!(await argon2.verify(user.password, req.body.currentPassword))) { error(res, 403, 'Current password is incorrect'); return; }
  await prisma.user.update({ where: { id: user.id }, data: { password: await argon2.hash(req.body.newPassword) } });
  res.json({ message: 'Password updated' });
}));

app.get('/api/games', wrap(async (req, res) => {
  const userId = req.session.userId;
  const games = await prisma.game.findMany({ where: { isPublished: true }, orderBy: { id: 'asc' }, include: { favoredBy: { where: { id: userId || -1 }, select: { id: true } }, _count: { select: { records: true } } } });
  res.json(games.map(({ favoredBy, _count, ...g }) => ({ ...g, isFavorite: favoredBy.length > 0, plays: _count.records })));
}));
app.post('/api/games/:id/favorite', requireUser, wrap(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id)) { error(res, 400, 'Invalid game ID'); return; }
  const game = await prisma.game.findFirst({ where: { id, isPublished: true }, include: { favoredBy: { where: { id: req.session.userId! }, select: { id: true } } } });
  if (!game) { error(res, 404, 'Game not found'); return; }
  const isFavorite = game.favoredBy.length === 0;
  await prisma.user.update({ where: { id: req.session.userId! }, data: { favoriteGames: isFavorite ? { connect: { id } } : { disconnect: { id } } } });
  res.json({ isFavorite });
}));
app.post('/api/records', requireUser, wrap(async (req, res) => {
  const { gameSlug, score, elapsed, outcome } = req.body;
  if (typeof gameSlug !== 'string' || !Number.isInteger(score) || score < 0 || score > 10000 || !Number.isInteger(elapsed) || elapsed < 0 || elapsed > 86400 || !['win','loss','draw','completed'].includes(outcome)) {
    error(res, 400, 'Invalid game result'); return;
  }
  const game = await prisma.game.findFirst({ where: { slug: gameSlug, isPublished: true } });
  if (!game) { error(res, 404, 'Game is not available'); return; }
  const record = await prisma.record.create({ data: { userId: req.session.userId!, gameId: game.id, score, elapsed, outcome } });
  res.status(201).json({ record });
}));
app.get('/api/leaderboard', wrap(async (req, res) => {
  const slug = typeof req.query.game === 'string' ? req.query.game : undefined;
  const records = await prisma.record.findMany({
    where: { game: { isPublished: true, ...(slug ? { slug } : {}) } },
    orderBy: [{ score: 'desc' }, { elapsed: 'asc' }, { createdAt: 'asc' }],
    take: 300, include: { user: { select: { id: true, name: true } }, game: { select: { slug: true, title: true } } },
  });
  // Each player is listed once, using their highest-scoring attempt.
  const unique = new Set<number>();
  const top = records.filter(r => { if (unique.has(r.userId)) return false; unique.add(r.userId); return true; }).slice(0, 30);
  res.json(top.map((r, i) => ({ rank: i + 1, id: r.id, name: r.user.name, game: r.game.title, slug: r.game.slug, score: r.score, elapsed: r.elapsed, createdAt: r.createdAt, userId: r.userId })));
}));
app.get('/api/me/stats', requireUser, wrap(async (req, res) => {
  const userId = req.session.userId!;
  const [gamesPlayed, highest, wins, favorites, recent] = await Promise.all([
    prisma.record.count({ where: { userId } }),
    prisma.record.aggregate({ where: { userId }, _max: { score: true } }),
    prisma.record.count({ where: { userId, outcome: { in: ['win', 'completed'] } } }),
    prisma.user.findUnique({ where: { id: userId }, select: { _count: { select: { favoriteGames: true } } } }),
    prisma.record.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 8, include: { game: { select: { title: true, slug: true } } } }),
  ]);
  res.json({ gamesPlayed, bestScore: highest._max.score || 0, wins, favorites: favorites?._count.favoriteGames || 0, recent: recent.map(r => ({ id: r.id, game: r.game.title, slug: r.game.slug, score: r.score, outcome: r.outcome, createdAt: r.createdAt })) });
}));

app.get('/api/admin/overview', requireAdmin, wrap(async (_req, res) => {
  const [players, games, sessions, records] = await Promise.all([prisma.user.count({ where: { role: 'PLAYER' } }), prisma.game.count(), prisma.record.count(), prisma.record.findMany({ take: 8, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true } }, game: { select: { title: true } } } })]);
  res.json({ players, games, sessions, recent: records.map(r => ({ id: r.id, player: r.user.name, game: r.game.title, score: r.score, createdAt: r.createdAt })) });
}));
app.get('/api/admin/games', requireAdmin, wrap(async (_req, res) => {
  const games = await prisma.game.findMany({ orderBy: { id: 'asc' }, include: { _count: { select: { records: true } } } });
  res.json(games.map(({ _count, ...g }) => ({ ...g, plays: _count.records })));
}));
const gameFields = (body: Record<string, unknown>) => {
  const required = ['slug', 'title', 'description', 'category', 'difficulty', 'icon', 'accent'] as const;
  if (required.some(key => typeof body[key] !== 'string' || (body[key] as string).trim().length === 0 || (body[key] as string).length > 300)) return null;
  if (!/^[a-z0-9-]{2,48}$/.test(body.slug as string)) return null;
  return Object.fromEntries(required.map(key => [key, (body[key] as string).trim()])) as { slug: string; title: string; description: string; category: string; difficulty: string; icon: string; accent: string };
};
app.post('/api/admin/games', requireAdmin, wrap(async (req, res) => {
  const data = gameFields(req.body);
  if (!data) { error(res, 400, 'Invalid game fields'); return; }
  const game = await prisma.game.create({ data: { ...data, isPublished: Boolean(req.body.isPublished) && ['sudoku','tic-tac-toe','rock-paper-scissors','memory-match','math-sprint',...extra.map(g=>g[0])].includes(data.slug) } });
  res.status(201).json(game);
}));
app.patch('/api/admin/games/:id', requireAdmin, wrap(async (req, res) => {
  const id = Number(req.params.id);
  const game = await prisma.game.findUnique({ where: { id } });
  if (!game) { error(res, 404, 'Game not found'); return; }
  const data = gameFields(req.body);
  if (!data) { error(res, 400, 'Invalid game fields'); return; }
  res.json(await prisma.game.update({ where: { id }, data: { ...data, isPublished: Boolean(req.body.isPublished) && ['sudoku','tic-tac-toe','rock-paper-scissors','memory-match','math-sprint',...extra.map(g=>g[0])].includes(data.slug) } }));
}));
app.delete('/api/admin/games/:id', requireAdmin, wrap(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id)) { error(res, 400, 'Invalid game ID'); return; }
  await prisma.game.update({ where: { id }, data: { isPublished: false } });
  res.json({ message: 'Game unpublished; historical records preserved' });
}));
app.get('/api/admin/users', requireAdmin, wrap(async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { records: true } } } });
  res.json(users.map(({ _count, ...user }) => ({ ...user, plays: _count.records })));
}));
app.post('/api/admin/users', requireAdmin, wrap(async (req, res) => {
  const email = emailOf(req.body.email);
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  if (!validEmail(email) || !validPassword(req.body.password) || name.length < 2 || name.length > 60) { error(res, 400, 'Invalid administrator details'); return; }
  const user = await prisma.user.create({ data: { email, name, role: 'ADMIN', password: await argon2.hash(req.body.password) } });
  res.status(201).json({ user: safeUser(user) });
}));
app.use('/api/v2', v2(prisma));
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const e = err as { code?: string; message?: string };
  if (e.code === 'P2002') { error(res, 409, 'This value already exists'); return; }
  if (e.code === 'P2025') { error(res, 404, 'Record not found'); return; }
  console.error(err);
  error(res, 500, 'An unexpected server error occurred');
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Brain Teaser API: http://localhost:${port}`));
process.on('SIGTERM', async () => { await prisma.$disconnect(); await pool.end(); process.exit(0); });
