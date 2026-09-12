import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { TurnRecord } from '@/lib/battle-storage'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params

  const battle = await db.battle.findUnique({
    where: { id },
    include: {
      turns: { orderBy: { turnNumber: 'desc' }, take: 1 },
    },
  })

  if (!battle) {
    return NextResponse.json({ error: 'Battle not found' }, { status: 404 })
  }

  const latestTurn = battle.turns[0]
  if (!latestTurn) {
    return NextResponse.json({ error: 'Battle has no state yet' }, { status: 500 })
  }

  const record = latestTurn.events as unknown as TurnRecord

  return NextResponse.json({
    battleId: battle.id,
    outcome: battle.outcome,
    state: record.state,
  })
}
