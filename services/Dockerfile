# ── Stage 1: Install dependencies ──────────────────────────
FROM oven/bun:1.3 AS deps

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# ── Stage 2: Production image ─────────────────────────────
FROM oven/bun:1.3-slim AS runner

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and migration files
COPY package.json ./
COPY src ./src
COPY identity ./identity
COPY mobility ./mobility
COPY realtime ./realtime
COPY prediction ./prediction
COPY drizzle ./drizzle

# Render injects PORT at runtime (default 10000)
# Do NOT hardcode — let Render decide
#
# NOTE: WebSocket currently runs on PORT+1 (e.g. 10001).
# Render free tier only exposes 1 port, so WebSocket won't work on Render.
# Options for production:
#   1. Upgrade to Render paid plan (supports multiple ports)
#   2. Move to a host that supports multiple ports (Railway, Fly.io)
#   3. Use a reverse proxy to route /ws to PORT+1
# For now, HTTP API works on Render. WebSocket is for local dev / future host.
ENV NODE_ENV=production
EXPOSE 10000

# Start the server
CMD ["bun", "run", "src/server.ts"]
