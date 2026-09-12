import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Battle } from '@/game/battle'
import type { BattleAction } from '@/game/battle'
import type { TurnRecord } from '@/lib/battle-storage'

interface RouteParams {
  params: Promise<{ id: string }>
}

interface ActionBody {
  action: BattleAction
}

export async function POST(req: Request, { params }: RouteParams) {
  const { id } = await params

  let body: ActionBody
  try {
    body = (await req.json()) as ActionBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { action } = body
  if (!action?.type) {
    return NextResponse.json({ error: 'action.type is required' }, { status: 400 })
  }

  const battle = await db.battle.findUnique({
    where: { id },
    include: {
      turns: { orderBy: { turnNumber: 'desc' }, take: 1 },
    },
  })

  if (!battle) {
    return NextResponse.json({ error: 'Battle not found' }, { status: 404 })
  }

  if (battle.outcome !== 'in_progress') {
    return NextResponse.json({ error: 'Battle is already over' }, { status: 409 })
  }

  const latestTurn = battle.turns[0]
  if (!latestTurn) {
    return NextResponse.json({ error: 'Battle state missing' }, { status: 500 })
  }

  const currentRecord = latestTurn.events as unknown as TurnRecord
  const currentState = currentRecord.state

  if (currentState.phase === 'ended') {
    return NextResponse.json({ error: 'Battle has ended' }, { status: 409 })
  }

  // Run through the Battle engine
  const engine = new Battle(currentState)
  const events = engine.executeTurn(action)
  const newState = engine.getState()

  const newTurnNumber = latestTurn.turnNumber + 1
  const newRecord: TurnRecord = { events, state: newState }

  const outcome =
    newState.phase === 'ended'
      ? newState.winner === 'player'
        ? 'victory'
        : 'defeat'
      : 'in_progress'

  await db.$transaction([
    db.battleTurn.create({
      data: { battleId: id, turnNumber: newTurnNumber, events: newRecord as object },
    }),
    db.battle.update({ where: { id }, data: { outcome } }),
  ])

  return NextResponse.json({ events, state: newState })
}
