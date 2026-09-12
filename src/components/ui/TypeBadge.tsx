import type { CSSProperties } from 'react'
import type { PokemonType } from '@/types'

const TYPE_COLORS: Record<PokemonType, string> = {
  normal:   '#A8A878',
  fire:     '#F08030',
  water:    '#6890F0',
  electric: '#F8D030',
  grass:    '#78C850',
  ice:      '#98D8D8',
  fighting: '#C03028',
  poison:   '#A040A0',
  ground:   '#E0C068',
  flying:   '#A890F0',
  psychic:  '#F85888',
  bug:      '#A8B820',
  rock:     '#B8A038',
  ghost:    '#705898',
  dragon:   '#7038F8',
  dark:     '#705848',
  steel:    '#B8B8D0',
}

function textOnBg(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.55 ? '#2C1810' : '#F8F0D8'
}

interface TypeBadgeProps {
  type: PokemonType
  size?: 'sm' | 'md'
  /** Optional click handler – renders as <button> when provided */
  onClick?: () => void
  /** Visual selection state when used as a filter button */
  selected?: boolean
}

export function TypeBadge({ type, size = 'md', onClick, selected = false }: TypeBadgeProps) {
  const bg = TYPE_COLORS[type]
  const color = textOnBg(bg)
  const fontSize = size === 'sm' ? '0.45rem' : '0.55rem'
  const padding  = size === 'sm' ? '2px 5px'  : '3px 8px'

  const baseStyle: CSSProperties = {
    background:     bg,
    color,
    fontFamily:     'inherit',
    fontSize,
    fontWeight:     'bold',
    textTransform:  'uppercase',
    letterSpacing:  '0.05em',
    padding,
    border:         selected ? '2px solid var(--pokemon-yellow)' : '1px solid rgba(0,0,0,0.25)',
    borderRadius:   2,
    display:        'inline-block',
    lineHeight:     1.4,
    whiteSpace:     'nowrap',
    textShadow:     '1px 1px 0 rgba(0,0,0,0.4)',
    cursor:         onClick ? 'pointer' : 'default',
    userSelect:     'none',
  }

  if (onClick) {
    return (
      <button type="button" style={baseStyle} onClick={onClick}>
        {type}
      </button>
    )
  }

  return <span style={baseStyle}>{type}</span>
}
