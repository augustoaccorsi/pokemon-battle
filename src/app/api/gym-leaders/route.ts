import { NextResponse } from 'next/server'
import { gymLeaders } from '@/lib/gym-leaders'

export async function GET() {
  // Return the list without the full difficulty/team data to keep payload small
  const list = gymLeaders.map(({ id, name, region, city, typeName, badge }) => ({
    id,
    name,
    region,
    city,
    typeName,
    badge,
  }))
  return NextResponse.json(list)
}
