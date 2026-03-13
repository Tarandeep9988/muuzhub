# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Keep this non-frozen until lockfile/package.json are synchronized.
RUN pnpm install --no-frozen-lockfile

FROM deps AS builder
WORKDIR /app
COPY . .

RUN pnpm prisma generate
RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# The start script uses `tsx server.ts`.
RUN npm install --global tsx@4.20.6

COPY --from=builder /app ./

EXPOSE 3000

USER node

# Set RUN_MIGRATIONS=true to run Prisma migrations before app start.
CMD ["sh", "-c", "if [ \"$RUN_MIGRATIONS\" = \"true\" ]; then pnpm prisma migrate deploy; fi && pnpm start"]
