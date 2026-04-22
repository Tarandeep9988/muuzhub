# MuuzHub

MuuzHub is a collaborative room-based music queue app built with Next.js, Prisma, PostgreSQL, NextAuth (Google), and Socket.IO.

Users can create a room, join with a room id, add YouTube links to a shared queue, and vote tracks up in real time.

## Repository Layout

This repository is organized as:

- `app/` - full Next.js application (source, Prisma schema/migrations, Docker assets)
- `README.md` - this root-level guide

Most development commands run inside `app/`.

## What This Project Contains

### Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Prisma 7 with PostgreSQL (`@prisma/adapter-pg`)
- NextAuth with Google OAuth provider
- Socket.IO for real-time room and queue updates
- Tailwind CSS v4 + Radix UI components

### Core Features

- Google sign-in (NextAuth)
- Room creation and room joining
- Shared room queue
- Add stream from YouTube URL
- Queue ordering by:
  1. active stream first
  2. upvote count descending
  3. creation time ascending
- Real-time updates over WebSocket events

### Important Runtime Entry Point

The app uses a custom Node HTTP server (`server.ts`) to host Next.js and attach Socket.IO handlers.

## Directory Highlights (inside `app/`)

- `app/app/` - Next.js routes and pages
  - `app/(app)/dashboard/page.tsx` - create/join room UI
  - `app/(app)/room/[roomId]/` - room experience and queue/player components
  - `app/api/` - API routes (`auth`, `room`, `stream`, `streams`)
- `app/handlers/` - Socket.IO event handlers
- `app/services/` - stream/upvote domain logic
- `app/lib/` - DB client, socket setup, YouTube helpers, env loading
- `app/prisma/schema.prisma` - data model
- `app/prisma/migrations/` - migration history
- `app/Dockerfile`, `app/docker-compose.yml` - container setup

## Data Model Summary

Prisma models:

- `User` (email + auth provider)
- `Room` (admin user, current stream, active status)
- `Stream` (YouTube metadata, active/played status, room ownership)
- `Upvote` (unique by user + stream)

## API and Realtime Surface

### API Routes (App Router)

- `POST /api/auth/[...nextauth]` - auth flow (handled by NextAuth)
- `POST /api/room` - create room (authenticated)
- `GET /api/room/[roomCode]` - validate room existence
- `POST /api/stream` - add stream by URL
- `POST /api/stream/upvote` - upvote stream
- `POST /api/stream/downvote` - remove upvote
- `GET /api/streams/[roomId]` - list streams for a room

### Socket.IO Events

- `joinRoom`
- `addStream`
- `deleteStream`
- `nextStream`
- `upvoteStream`
- server emit: `queueUpdated`

## Prerequisites

- Node.js 22.x recommended
- pnpm (via Corepack)
- PostgreSQL database
- Google OAuth credentials

Why Node 22 recommendation:
Prisma 7 requires modern Node runtimes. If install fails with an engine message, use Node 22.12.0+.

## Environment Variables

A template exists at:

- `app/.env.docker.example`

Required values include:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `HOST` and `PORT` (for custom server)

For local development, create/update:

- `app/.env`

For Docker deployment, create/update:

- `app/.env.docker`

## Local Development

```bash
cd app
corepack enable
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm dev
```

App runs at:

- http://localhost:3000

## Production Build and Start

```bash
cd app
pnpm build
pnpm start
```

## Docker

From `app/` directory:

```bash
docker compose up --build
```

Notes:

- The container starts with `tsx server.ts`.
- Set `RUN_MIGRATIONS=true` to execute `prisma migrate deploy` at startup.

## Useful Scripts

Inside `app/package.json`:

- `pnpm dev` - run dev server with `tsx watch server.ts`
- `pnpm build` - Next.js production build
- `pnpm start` - run custom server
- `pnpm lint` - run ESLint

## Current Observations (Analysis)

- The project is a single-app repo nested under `app/`.
- There is no root workspace package manifest; package management is app-scoped.
- Real-time queue behavior is socket-first, with DB-backed ordering.
- Auth persists users by email on first sign-in.
- Existing `.env` files should be treated as sensitive; keep secrets out of git and rotate exposed credentials.

## Recommended Next Improvements

- Add explicit response payloads for upvote/downvote API routes (currently no success response body).
- Add tests for queue ordering and Socket.IO event flows.
- Add a minimal architecture diagram to docs.
- Add CI checks: lint + build + Prisma schema validation.
