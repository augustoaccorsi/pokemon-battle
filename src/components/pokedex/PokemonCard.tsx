import Link from 'next/link'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { PokemonSprite } from '@/components/ui/PokemonSprite'
import type { PokemonListItem } from '@/types'

interface PokemonCardProps {
  pokemon: PokemonListItem
}

function padId(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link
      href={`/pokedex/${pokemon.id}`}
      style={{
        display:         'block',
        textDecoration:  'none',
        color:           'inherit',
      }}
    >
      <div
        className="panel"
        style={{
          padding:        12,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          gap:            6,
          cursor:         'pointer',
          transition:     'transform 0.1s, box-shadow 0.1s, border-color 0.1s',
          userSelect:     'none',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.transform   = 'scale(1.03)'
          el.style.borderColor = 'var(--pokemon-yellow)'
          el.style.boxShadow   = '3px 3px 0 var(--panel-shadow)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.transform   = ''
          el.style.borderColor = ''
          el.style.boxShadow   = ''
        }}
      >
        {/* Pokédex number */}
        <span
          style={{
            fontFamily:   'inherit',
            fontSize:     '0.5rem',
            color:        'var(--text-secondary)',
            alignSelf:    'flex-start',
            letterSpacing: '0.05em',
          }}
        >
          {padId(pokemon.id)}
        </span>

        {/* Sprite */}
        <PokemonSprite
          src={pokemon.spriteFront}
          name={pokemon.name}
          size="md"
        />

        {/* Name */}
        <span
          style={{
            fontFamily:   'inherit',
            fontSize:     '0.6rem',
            fontWeight:   'bold',
            color:        'var(--text-primary)',
            textTransform: 'capitalize',
            textAlign:    'center',
            letterSpacing: '0.03em',
          }}
        >
          {pokemon.name}
        </span>

        {/* Types */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>
      </div>
    </Link>
  )
}
