# Pokémon Battle Simulator

A Gen I–III Pokémon battle simulator built with Next.js, featuring a Pokédex, Team Builder, and Gym Leader battles with a faithful FireRed/LeafGreen aesthetic.

## Features

- **Pokédex** — Browse all 386 Pokémon (Gen I–III) with search, type filters, and generation tabs
- **Team Builder** — Build a team of 6 with manual pick or random generator, saved to the database
- **Battle Simulator** — Turn-based battles with the Gen III damage formula, status effects, priority moves, and seeded-RNG replays
- **Gym Leaders** — Fight all 8 Kanto Gym Leaders across 3 difficulty tiers

## Tech Stack

- **Next.js 16** (App Router, TypeScript strict)
- **Prisma 5** + PostgreSQL
- **Tailwind CSS v4**
- **Framer Motion** for animations
- **Vitest** — 57 battle engine unit tests

## Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)

## First-time Setup

**1. Start the database:**
```bash
DOCKER_API_VERSION=1.43 docker run -d \
  --name pokemon-db \
  -e POSTGRES_USER=pokemon \
  -e POSTGRES_PASSWORD=pokemon \
  -e POSTGRES_DB=pokemon_battle \
  -p 5432:5432 \
  postgres:16-alpine
```

**2. Install, migrate, and import data (~5 min):**
```bash
npm install
npm run setup
```

**3. Start the dev server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Subsequent Runs

If the Docker container already exists but is stopped:
```bash
DOCKER_API_VERSION=1.43 docker start pokemon-db
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at :3000 |
| `npm run setup` | Migrate DB + import all Pokémon data |
| `npm run setup:dev` | Same but skips migration history (`db push`) |
| `npm run test` | Run battle engine tests |
| `npm run typecheck` | TypeScript check |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── battle/           # Battle page
│   ├── gym-leaders/      # Gym Leaders page
│   ├── pokedex/          # Pokédex page
│   └── team/             # Team Builder page
├── components/
│   └── battle/           # Battle UI components (BattleScreen, etc.)
├── game/
│   └── battle/           # Pure-TS battle engine (no React)
├── lib/                  # Prisma client, gym leader data
└── types/                # Shared TypeScript types
prisma/
└── schema.prisma         # Database schema
scripts/
└── import-*.ts           # PokéAPI data import scripts
```

## Environment

Copy `.env` and set your database URL:
```
DATABASE_URL="postgresql://pokemon:pokemon@localhost:5432/pokemon_battle"
```
