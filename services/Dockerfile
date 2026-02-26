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
ENV NODE_ENV=production
EXPOSE 10000

# Start the server
CMD ["bun", "run", "src/server.ts"]
