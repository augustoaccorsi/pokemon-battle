import Link from 'next/link'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { DetailTabs } from '@/components/pokedex/DetailTabs'
import type { PokemonDetail, PokemonType } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getPokemon(id: number): Promise<PokemonDetail | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pokemon: any = await prisma.pokemon.findUnique({
    where: { id },
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
          move: { include: { type: { select: { name: true } } } },
        },
        orderBy: { levelLearnedAt: 'asc' },
      },
    },
  })

  if (!pokemon) return null

  // Fetch full evolution chain (two-pass for multi-stage lines)
  const directSteps = await prisma.evolutionStep.findMany({
    where: { OR: [{ fromPokemonId: id }, { toPokemonId: id }] },
  })
  const chainIds = new Set<number>([id])
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

  return {
    id: pokemon.id,
    name: pokemon.name,
    generation: pokemon.generation,
    height: pokemon.height,
    weight: pokemon.weight,
    isLegendary: pokemon.isLegendary,
    hp: pokemon.hp,
    attack: pokemon.attack,
    defense: pokemon.defense,
    spAttack: pokemon.spAttack,
    spDefense: pokemon.spDefense,
    speed: pokemon.speed,
    spriteFront: pokemon.spritesFront ?? undefined,
    spriteBack: pokemon.spritesBack ?? undefined,
    spriteFrontShiny: pokemon.spritesFrontShiny ?? undefined,
    spriteBackShiny: pokemon.spritesBackShiny ?? undefined,
    types: (pokemon.types as any[]).map((t: any) => t.type.name as PokemonType), // eslint-disable-line @typescript-eslint/no-explicit-any
    abilities: (pokemon.abilities as any[]).map((a: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      name: a.ability.name as string,
      isHidden: a.isHidden as boolean,
    })),
    moves: (pokemon.moves as any[]).map((m: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      name: m.move.name as string,
      type: m.move.type.name as PokemonType,
      learnMethod: m.learnMethod as string,
      level: (m.levelLearnedAt ?? undefined) as number | undefined,
    })),
    evolutions: allChainSteps.map((e: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
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
}

function padId(id: number) {
  return `#${String(id).padStart(3, '0')}`
}

export default async function PokemonDetailPage({ params }: PageProps) {
  const { id } = await params
  const pokemonId = parseInt(id, 10)

  if (isNaN(pokemonId)) notFound()

  const pokemon = await getPokemon(pokemonId)
  if (!pokemon) notFound()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--panel-light)', padding: 16 }}>
      {/* ── Back navigation ──────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <Link
          href="/pokedex"
          style={{
            fontFamily:    'inherit',
            fontSize:      '0.5rem',
            color:         'var(--text-secondary)',
            textDecoration: 'none',
            letterSpacing: '0.05em',
          }}
          onMouseOver={undefined}
        >
          ← Back to Pokédex
        </Link>
      </div>

      {/* ── Title bar ────────────────────────────── */}
      <div className="panel-dark" style={{ padding: '10px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'inherit', fontSize: '0.55rem', color: 'var(--text-on-dark)', opacity: 0.7 }}>
            {padId(pokemon.id)}
          </span>
          <h1
            style={{
              fontFamily:    'inherit',
              fontSize:      '0.9rem',
              margin:        0,
              textTransform: 'capitalize',
              letterSpacing: '0.06em',
              flex:          1,
            }}
          >
            {pokemon.name}
          </h1>
          <div style={{ display: 'flex', gap: 6 }}>
            {pokemon.types.map((t) => (
              <TypeBadge key={t} type={t} size="md" />
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs (client component) ──────────────── */}
      <DetailTabs pokemon={pokemon} />
    </div>
  )
}
