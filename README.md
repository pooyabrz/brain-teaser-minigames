# Brainwave 2.0 — Neo-Arcade development build

**Play smarter. Think faster. Level up.**

This version extends the original full-stack project with 20 new game modules (25 total), six themes, local practice progression, daily puzzles, achievements, analytics, a command palette, local multiplayer games, and selected server rule-validated sessions. See [implementation status](docs/IMPLEMENTATION_STATUS.md) for completed features and explicit PRD gaps. This is not a production-certified release.

## GitHub Pages — standalone edition

The repository includes `.github/workflows/deploy-pages.yml`. Upload the **contents** of the extracted project folder to your repository root (including `.github`), on branch `main`, then run the deployment workflow from the Actions tab or push to `main`. The workflow enables GitHub Pages with Actions as its source; if repository policy prevents automatic enablement, select **GitHub Actions** under GitHub Settings → Pages → Build and deployment.

For the original repository the published URL is `https://pooyabrz.github.io/brain-teaser-minigames/`. The Pages build uses relative assets and hash routing so forks and custom domains do not need a hard-coded base path.

To run the standalone edition locally (Node 22+):

```bash
cd client
npm ci
npm run dev:pages
```

To build and preview the exact production edition:

```bash
npm run build:pages
npm run preview
```

Open the URL shown by Vite. No Express server, database, environment secrets or registration is required for this edition. Practice results, XP, daily challenges, themes, favorites and personal records are saved in browser localStorage, not synchronized. The static leaderboard is personal only. The production build generates a scope-specific offline cache of its bundled assets; visit once online and allow installation to finish before going offline. External fonts may fall back to local fonts.

The full-stack source remains available using the separate setup below. Online accounts, server-backed rankings and administration require the API. Online multiplayer and other incomplete PRD features are still listed in the implementation status. The Pages workflow runs tests and a production build before publishing; this archive has not itself been deployed.

### Quick start (full-stack)

Requires Node.js 22+, npm and Docker (or PostgreSQL 16).

```bash
docker compose up -d postgres
cd server
cp .env.example .env
# Edit .env and set a unique SESSION_SECRET and database credentials.
npm ci
npm run prisma:generate
npm run db:push
npm run seed
npm run dev
```

For an existing database, back it up first. The new table is additive; inspect Prisma's proposed changes before applying. Never use `--force-reset` or `--accept-data-loss` to upgrade this project. The standalone additive migration SQL is under `server/prisma/migrations/202611240001_arcade_sessions/`; this is not a complete migration baseline for a fresh database.

In a second terminal:

```bash
cd client
npm ci
npm run dev
```

Player: http://localhost:5173. API: http://localhost:4000. For the separate admin UI, run `npm ci && npm run dev` in `admin-interface` (port 5174). Set admin credentials in server `.env` before seeding.

Run `npm test` in `client` to execute engine tests without dependencies on Node 22. Run `npm run build` in each application after installing dependencies. Full-stack production deployment requires an API server, PostgreSQL and HTTPS; GitHub Pages alone cannot host the backend.

---

## Original repository documentation (retained for reference)

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
