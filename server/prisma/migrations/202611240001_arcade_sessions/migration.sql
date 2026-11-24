-- Additive migration for existing installations. Do not reset existing databases.
CREATE TABLE IF NOT EXISTS "ArcadeSession" (
  "id" TEXT PRIMARY KEY,
  "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "slug" TEXT NOT NULL,
  "seed" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finishedAt" TIMESTAMP(3),
  "score" INTEGER,
  "actions" JSONB,
  "xp" INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS "ArcadeSession_userId_createdAt_idx" ON "ArcadeSession"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "ArcadeSession_slug_score_idx" ON "ArcadeSession"("slug", "score");
