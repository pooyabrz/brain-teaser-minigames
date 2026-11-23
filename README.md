# Brainwave — Brain Teaser Minigames 🧠

An interactive, full-stack brain-training playground. This completion of the original **Brain Teaser Minigames** repository contains a redesigned player app, five fully playable games, an administrator studio, and a PostgreSQL-backed Express API.

## What's included

| Component | Features | Local URL |
| --- | --- | --- |
| **Player** (`client/`) | Game catalog, responsive dashboard, registration/sign-in, profiles, saved scores, favorites, leaderboard | http://localhost:5173 |
| **Admin** (`admin-interface/`) | Sign-in, overview, scores, game CRUD, publishing controls, player list, admin creation, password changes | http://localhost:5174 |
| **API** (`server/`) | Session auth, Argon2 password hashes, game catalog, saved scores, profile settings, admin API | http://localhost:4000 |
| **Database** (`docker-compose.yml`) | PostgreSQL 16 local development database | localhost:5432 |

### Playable games

- **Sudoku** — three difficulties, randomized valid boards, keyboard controls, timer, three-mistake limit, two hints, completion scoring.
- **Tic Tac Toe** — classic 3×3 against a random or minimax bot, plus Ultimate Tic Tac Toe with nine linked boards and legal-move restrictions.
- **Rock Paper Scissors** — 3-, 5-, or 7-round matches with round results and scoring.
- **Memory Match** — shuffle and find 6, 8, or 10 pairs, with move and time tracking.
- **Math Sprint** — 60-second arithmetic quiz, difficulty choices, four-answer selection, keyboard shortcuts, scoring.

Guests can play without an account. Signed-in players can save scores and favorite games. The admin interface manages catalog metadata: **a newly added game only becomes playable after its React game component is implemented**. Otherwise the player library labels it *Coming soon*.

## Prerequisites

- Node.js **22+** and npm
- Docker Desktop or a running PostgreSQL 15+ server

## Start locally (development)

**1. Start PostgreSQL** from the project root:

```bash
docker compose up -d
```

Or use an existing PostgreSQL database and adjust `DATABASE_URL` accordingly.

**2. Install and configure the API:**

```bash
cd server
npm ci
cp .env.example .env
```

Edit `.env`: set a unique `SESSION_SECRET` (32+ characters), replace `ADMIN_EMAIL` and `ADMIN_PASSWORD` with credentials of your choosing, and configure `DATABASE_URL` if necessary. **Do not commit `.env` or use the example credentials.**

```bash
npm run prisma:generate
npm run db:push
npm run seed
npm run dev
```

The seed is idempotent. It creates the five catalog games if they do not exist and bootstraps the initial administrator. **Re-running the seed does not reset an existing admin password.** Use the admin account settings to change it.

**3. Start the player app** in another terminal:

```bash
cd client
npm ci
npm run dev
```

Visit **http://localhost:5173**.

**4. Start the admin app** in a third terminal:

```bash
cd admin-interface
npm ci
npm run dev
```

Visit **http://localhost:5174** and sign in using the admin email/password configured during seeding.

> Windows PowerShell: use `Copy-Item .env.example .env` instead of `cp` if needed.

## Commands

| Working directory | Command | Description |
| --- | --- | --- |
| `server` | `npm run dev` | Start the Express API with TypeScript hot reload |
| `server` | `npm run build && npm start` | Compile and start the API |
| `server` | `npm run db:push` | Apply Prisma schema to the dev database |
| `server` | `npm run seed` | Create built-in games and optional admin |
| `client` | `npm run dev` | Start player frontend |
| `client` | `npm run build` | Type-check and build the frontend |
| `client` | `npm test` | Run pure game-logic tests (Node 22+) |
| `admin-interface` | `npm run dev` | Start admin frontend |
| `admin-interface` | `npm run build` | Type-check and build admin frontend |

All three apps use existing npm lockfiles for reproducibility. Vite proxies `/api` requests from ports 5173 and 5174 to port 4000, so the browser uses same-origin cookies.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| GET | `/api/auth/me` | Current player/admin session |
| POST | `/api/auth/register` | Player registration |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | Sign out |
| PATCH | `/api/account` | Update display name (signed in) |
| POST | `/api/account/password` | Change password (signed in) |
| GET | `/api/games` | Published games and player favorite status |
| POST | `/api/games/:id/favorite` | Toggle a favorite (signed in) |
| POST | `/api/records` | Save a game result (signed in) |
| GET | `/api/leaderboard?game=slug` | Top scores, optionally per game |
| GET | `/api/me/stats` | Player totals and recent sessions (signed in) |
| GET | `/api/admin/overview` | Admin summary |
| GET | `/api/admin/games` | All games including hidden |
| POST | `/api/admin/games` | Create metadata entry |
| PATCH | `/api/admin/games/:id` | Update entry or publication state |
| DELETE | `/api/admin/games/:id` | Delete entry and associated records |
| GET | `/api/admin/users` | List players and administrators |
| POST | `/api/admin/users` | Create administrator |

## Production considerations

- Always enable HTTPS and set `NODE_ENV=production`. Deploy behind a correctly configured HTTPS reverse proxy that routes `/api` to the backend, and set `CLIENT_ORIGINS` to the actual browser origins.
- Use a secure secret, strong administrator password, backups, and production Prisma migrations rather than `prisma db push` as your release mechanism.
- Scores are **client-reported casual results**, not anti-cheat verified. For prizes, tournaments, or competitive rankings, add server-issued challenges, server-side verification and abuse protection before trusting scores.
- Add distributed rate limiting to authentication endpoints and CSRF measures appropriate to your production routing and threat model. Session storage is PostgreSQL-backed, but rate limiting is not enabled in this starter.
- The Vite frontends are development servers. Run their build commands and serve the static `dist/` output through a production web server.
- This archive contains the pre-completion frontend source under `client/legacy/` and `admin-interface/legacy/` for reference only. These folders are not part of the build.

## Testing status

The pure TypeScript game engines have automated tests in `client/tests/`. They verify valid Sudoku puzzles, the Sudoku solver, Tic Tac Toe wins and draws, minimax behavior, and Ultimate board routing. **Integration testing requires installing npm dependencies and starting PostgreSQL**. The packaged source has been syntax checked, but a full production build and database-backed browser run are not claimed without those prerequisites.
