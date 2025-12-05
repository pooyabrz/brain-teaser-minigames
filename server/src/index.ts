import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
import dotenv from 'dotenv';
import passport from 'passport';

dotenv.config();

const app = express();
const PgStore = connectPgSimple(session);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use(session({
  store: new PgStore({ pool }),
  secret: process.env.SESSION_SECRET || 'changeme',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true in prod with HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

// Test route
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
