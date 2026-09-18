import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { gymLeadersById } from '@/lib/gym-leaders'
import type { TurnRecord } from '@/lib/battle-storage'
import type {
  BattlePokemon,
  BattleMove,
  BattleSide,
  BattleState,
  StatusCondition,
} from '@/game/battle'

// ─── Stat formulas (Gen III) ─────────────────────────────────────────────────

function calcHp(base: number, level: number): number {
  return Math.floor((2 * base * level) / 100) + level + 10
}

function calcStat(base: number, level: number): number {
  return Math.floor((2 * base * level) / 100) + 5
}

// ─── Build BattleMove from DB (with sensible fallbacks) ──────────────────────

async function resolveMove(moveName: string, slot: number): Promise<BattleMove> {
  const found = await db.move.findFirst({
    where: { name: { equals: moveName, mode: 'insensitive' } },
    include: { type: true },
  })
  const pp = found?.pp ?? 20
  return {
    id: moveName.toLowerCase().replace(/\s+/g, '-'),
    name: moveName,
    type: found?.type.name ?? 'normal',
    category: (found?.category as BattleMove['category']) ?? 'physical',
    power: found?.power ?? undefined,
    accuracy: found?.accuracy ?? undefined,
    currentPP: pp,
    maxPP: pp,
    priority: 0,
    effect: undefined,
  }
}

// ─── Build BattlePokemon ─────────────────────────────────────────────────────

async function buildBattlePokemon(
  slotIndex: number,
  sideId: 'player' | 'enemy',
  pokemonId: number,
  name: string,
  level: number,
  moveNames: string[],
): Promise<BattlePokemon> {
  const dbPokemon = await db.pokemon.findUnique({
    where: { id: pokemonId },
    include: { types: { include: { type: true }, orderBy: { slot: 'asc' } } },
  })

  const baseHp = dbPokemon?.hp ?? 45
  const maxHp = calcHp(baseHp, level)

  // If no moves provided, load the Pokémon's first 4 level-up moves from DB
  let resolvedMoveNames = moveNames
  if (resolvedMoveNames.length === 0) {
    const dbMoves = await db.pokemonMove.findMany({
      where: { pokemonId, learnMethod: 'level-up' },
      include: { move: true },
      orderBy: { levelLearnedAt: 'asc' },
      take: 4,
    })
    resolvedMoveNames = dbMoves.map((pm: { move: { name: string } }) => pm.move.name)
    // Last resort fallback
    if (resolvedMoveNames.length === 0) resolvedMoveNames = ['tackle']
  }

  const moves = await Promise.all(
    resolvedMoveNames.slice(0, 4).map((m, i) => resolveMove(m, i)),
  )

  return {
    id: `${sideId}-${pokemonId}-${slotIndex}`,
    name,
    currentHp: maxHp,
    maxHp,
    level,
    attack: calcStat(dbPokemon?.attack ?? 50, level),
    defense: calcStat(dbPokemon?.defense ?? 40, level),
    spAttack: calcStat(dbPokemon?.spAttack ?? 45, level),
    spDefense: calcStat(dbPokemon?.spDefense ?? 40, level),
    speed: calcStat(dbPokemon?.speed ?? 45, level),
    types: dbPokemon?.types.map((t: { type: { name: string } }) => t.type.name) ?? [],
    moves,
    status: undefined as StatusCondition | undefined,
    isActive: slotIndex === 0,
  }
}

// ─── POST /api/battles ───────────────────────────────────────────────────────

interface CreateBattleBody {
  teamId: string
  gymLeaderId: number
  difficulty: 'normal' | 'hard' | 'challenge'
}

export async function POST(req: Request) {
  let body: CreateBattleBody
  try {
    body = (await req.json()) as CreateBattleBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { teamId, gymLeaderId, difficulty } = body

  if (!teamId || !gymLeaderId || !difficulty) {
    return NextResponse.json(
      { error: 'teamId, gymLeaderId and difficulty are required' },
      { status: 400 },
    )
  }

  if (!(['normal', 'hard', 'challenge'] as const).includes(difficulty)) {
    return NextResponse.json(
      { error: 'difficulty must be normal | hard | challenge' },
      { status: 400 },
    )
  }

  const leader = gymLeadersById.get(gymLeaderId)
  if (!leader) {
    return NextResponse.json({ error: `Gym leader ${gymLeaderId} not found` }, { status: 404 })
  }

  const team = await db.team.findUnique({
    where: { id: teamId },
    include: {
      pokemon: {
        include: {
          pokemon: {
            include: { types: { include: { type: true }, orderBy: { slot: 'asc' } } },
          },
        },
        orderBy: { slot: 'asc' },
      },
    },
  })

  if (!team || team.pokemon.length === 0) {
    return NextResponse.json({ error: 'Team not found or empty' }, { status: 404 })
  }

  const DEFAULT_LEVEL = 50

  // Build player side — use per-Pokémon level stored in the team slot
  const playerPokemon: BattlePokemon[] = await Promise.all(
    team.pokemon.map((slot: { pokemonId: number; pokemon: { name: string }; level: number }, i: number) =>
      buildBattlePokemon(i, 'player', slot.pokemonId, slot.pokemon.name, slot.level ?? DEFAULT_LEVEL, []),
    ),
  )

  // Build enemy side from static leader data
  const leaderTeam = leader.difficulty[difficulty]
  const enemyPokemon: BattlePokemon[] = await Promise.all(
    leaderTeam.pokemon.map((slot, i) =>
      buildBattlePokemon(i, 'enemy', slot.pokemonId, slot.name, slot.level, slot.moves),
    ),
  )

  // Create DB record
  const seed = Math.random().toString(36).slice(2)
  const battle = await db.battle.create({
    data: { teamId, gymLeaderId, difficulty, seed, outcome: 'in_progress' },
  })

  const playerSide: BattleSide = {
    id: 'player',
    pokemon: playerPokemon,
    activeIndex: 0,
  }
  const enemySide: BattleSide = {
    id: 'enemy',
    pokemon: enemyPokemon,
    activeIndex: 0,
  }

  const initialState: BattleState = {
    id: battle.id,
    player: playerSide,
    enemy: enemySide,
    turn: 0,
    seed,
    log: [],
    phase: 'selecting',
  }

  const record: TurnRecord = { events: [], state: initialState }
  await db.battleTurn.create({
    data: { battleId: battle.id, turnNumber: 0, events: record as object },
  })

  return NextResponse.json({ battleId: battle.id }, { status: 201 })
}
