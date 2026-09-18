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
- [Colima](https://github.com/abiosoft/colima) + Docker CLI (no Docker Desktop required)

```bash
brew install colima docker
```

## First-time Setup

```bash
npm install
npm run start:fresh
```

That's it. `start:fresh` will:
1. Start Colima (the Docker daemon) if it's not running
2. Create and start the PostgreSQL container
3. Run database migrations
4. Import all Pokémon data from PokéAPI (~10–15 min, rate-limited)
5. Start the dev server at [http://localhost:3000](http://localhost:3000)

## Subsequent Runs

On subsequent runs the import is skipped — just start the app:
```bash
npm run dev
```

If the database container is stopped (e.g. after a reboot):
```bash
npm run docker:up
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run start:fresh` | Full first-time setup: Docker + DB + import + dev server |
| `npm run docker:up` | Start Colima + Postgres container |
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
