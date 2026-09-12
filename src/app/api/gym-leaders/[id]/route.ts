import { NextResponse } from 'next/server'
import { gymLeadersById } from '@/lib/gym-leaders'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params
  const numId = Number(id)

  if (Number.isNaN(numId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const leader = gymLeadersById.get(numId)
  if (!leader) {
    return NextResponse.json({ error: 'Gym leader not found' }, { status: 404 })
  }

  return NextResponse.json(leader)
}
