# Manual QA checklist

Once PostgreSQL and all three apps are running:

- [ ] Visit `http://localhost:4000/api/health`: `{"status":"ok"}`.
- [ ] Open `http://localhost:5173`: verify hero, responsive navigation, search filters, and five game cards.
- [ ] Play each game as a guest; verify its result and replay behavior (and that guest scores aren't saved).
- [ ] Register a player with a password of at least ten characters; verify logout and subsequent login.
- [ ] Favorite a game; refresh; verify the heart remains selected. Unfavorite and refresh again.
- [ ] Finish a game while signed in; verify recent history on `/account` and the new leaderboard entry.
- [ ] Update display name and password; verify new login credentials.
- [ ] Open `http://localhost:5174` using an admin account; verify the overview, game list and user list.
- [ ] Hide a game; verify it disappears from the player library and its direct URL is blocked. Publish it again.
- [ ] Add a custom metadata-only game and verify the player library labels it `Coming soon`.
- [ ] Edit a game description; verify the player catalog updates. Delete the custom game.
- [ ] Create a second admin, sign out, and sign in with the new admin credentials.
- [ ] Check layouts at 375px, 768px, and desktop widths. Confirm no horizontal overflow.

Automated logic tests: `cd client && npm test` (Node.js 22+).
