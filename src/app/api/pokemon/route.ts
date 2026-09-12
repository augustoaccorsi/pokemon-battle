import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import type { PokemonListItem, PokemonType, PokemonListResponse } from '@/types'

// Custom where-input types that match the Prisma schema without relying on
// generated client types (Prisma generate requires a live database connection).
interface IdRange { gte?: number; lte?: number }
interface StringFilter { contains?: string; equals?: string; mode?: 'insensitive' | 'default' }
interface TypesFilter { some: { type: { name: StringFilter } } }
interface PokemonWhere {
  id?: IdRange
  name?: StringFilter
  types?: TypesFilter
}

const GEN_RANGES: Record<number, IdRange> = {
  1: { gte: 1, lte: 151 },
  2: { gte: 152, lte: 251 },
  3: { gte: 252, lte: 386 },
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const gen = searchParams.get('gen')
  const type = searchParams.get('type')
  const search = searchParams.get('search')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '30', 10)))

  const where: PokemonWhere = {}

  if (gen) {
    const genNum = parseInt(gen, 10)
    const range = GEN_RANGES[genNum]
    if (range) where.id = range
  }

  if (search) {
    where.name = { contains: search, mode: 'insensitive' }
  }

  if (type) {
    where.types = { some: { type: { name: { equals: type, mode: 'insensitive' } } } }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prismaWhere = where as any

  const [rawPokemon, total] = await Promise.all([
    prisma.pokemon.findMany({
      where: prismaWhere,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: 'asc' },
      select: {
        id: true,
        name: true,
        generation: true,
        spritesFront: true,
        types: {
          select: { slot: true, type: { select: { name: true } } },
          orderBy: { slot: 'asc' },
        },
      },
    }),
    prisma.pokemon.count({ where: prismaWhere }),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pokemon: PokemonListItem[] = (rawPokemon as any[]).map((p: any) => ({
    id: p.id as number,
    name: p.name as string,
    generation: p.generation as number,
    spriteFront: (p.spritesFront ?? undefined) as string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    types: (p.types as any[]).map((t: any) => t.type.name as PokemonType),
  }))

  const response: PokemonListResponse = { pokemon, total: total as number, page }
  return NextResponse.json(response)
}
