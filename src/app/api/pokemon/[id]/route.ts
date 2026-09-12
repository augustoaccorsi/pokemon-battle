import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import type { PokemonDetail, PokemonType } from '@/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const pokemonId = parseInt(id, 10)

  if (isNaN(pokemonId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pokemon: any = await prisma.pokemon.findUnique({
    where: { id: pokemonId },
    include: {
      types: {
        include: { type: { select: { name: true } } },
        orderBy: { slot: 'asc' },
      },
      abilities: {
        include: { ability: { select: { name: true } } },
        orderBy: { slot: 'asc' },
      },
      moves: {
        where: { learnMethod: 'level-up' },
        include: {
          move: {
            include: { type: { select: { name: true } } },
          },
        },
        orderBy: { levelLearnedAt: 'asc' },
      },
    },
  })

  // Fetch full evolution chain (two-pass to handle multi-stage lines)
  const directSteps = await prisma.evolutionStep.findMany({
    where: { OR: [{ fromPokemonId: pokemonId }, { toPokemonId: pokemonId }] },
  })
  const chainIds = new Set<number>([pokemonId])
  for (const s of directSteps) { chainIds.add(s.fromPokemonId); chainIds.add(s.toPokemonId) }

  const chainIdArr = Array.from(chainIds)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allChainSteps: any[] = await prisma.evolutionStep.findMany({
    where: {
      OR: [
        { fromPokemonId: { in: chainIdArr } },
        { toPokemonId: { in: chainIdArr } },
      ],
    },
    include: {
      fromPokemon: { select: { id: true, name: true, spritesFront: true } },
      toPokemon:   { select: { id: true, name: true, spritesFront: true } },
    },
    orderBy: { fromPokemonId: 'asc' },
  })

  if (!pokemon) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const detail: PokemonDetail = {
    id: pokemon.id as number,
    name: pokemon.name as string,
    generation: pokemon.generation as number,
    height: pokemon.height as number,
    weight: pokemon.weight as number,
    isLegendary: pokemon.isLegendary as boolean,
    hp: pokemon.hp as number,
    attack: pokemon.attack as number,
    defense: pokemon.defense as number,
    spAttack: pokemon.spAttack as number,
    spDefense: pokemon.spDefense as number,
    speed: pokemon.speed as number,
    spriteFront: (pokemon.spritesFront ?? undefined) as string | undefined,
    spriteBack: (pokemon.spritesBack ?? undefined) as string | undefined,
    spriteFrontShiny: (pokemon.spritesFrontShiny ?? undefined) as string | undefined,
    spriteBackShiny: (pokemon.spritesBackShiny ?? undefined) as string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    types: (pokemon.types as any[]).map((t: any) => t.type.name as PokemonType),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abilities: (pokemon.abilities as any[]).map((a: any) => ({
      name: a.ability.name as string,
      isHidden: a.isHidden as boolean,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    moves: (pokemon.moves as any[]).map((m: any) => ({
      name: m.move.name as string,
      type: m.move.type.name as PokemonType,
      learnMethod: m.learnMethod as string,
      level: (m.levelLearnedAt ?? undefined) as number | undefined,
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    evolutions: allChainSteps.map((e: any) => ({
      fromId:     e.fromPokemonId as number,
      fromName:   e.fromPokemon.name as string,
      fromSprite: (e.fromPokemon.spritesFront ?? undefined) as string | undefined,
      toId:       e.toPokemonId as number,
      toName:     e.toPokemon.name as string,
      toSprite:   (e.toPokemon.spritesFront ?? undefined) as string | undefined,
      trigger:    e.trigger as string,
      minLevel:   (e.minLevel ?? undefined) as number | undefined,
      itemName:   (e.itemName ?? undefined) as string | undefined,
    })),
  }

  return NextResponse.json(detail)
}
