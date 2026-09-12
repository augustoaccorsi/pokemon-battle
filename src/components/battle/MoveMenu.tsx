'use client'

import type { BattleMove } from '@/game/battle'

interface MoveMenuProps {
  moves: BattleMove[]
  onSelect: (idx: number) => void
  onBack: () => void
}

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
}

function TypeBadge({ type }: { type: string }) {
  const color = TYPE_COLORS[type.toLowerCase()] ?? TYPE_COLORS.normal
  return (
    <span
      className="inline-block px-1 py-0.5 rounded-sm text-white"
      style={{
        background: color,
        fontSize: '0.45rem',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
      }}
    >
      {type}
    </span>
  )
}

export function MoveMenu({ moves, onSelect, onBack }: MoveMenuProps) {
  // Pad to 4 slots
  const slots = Array.from({ length: 4 }, (_, i) => moves[i] ?? null)

  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-2 gap-1">
        {slots.map((move, idx) => {
          if (!move) {
            return (
              <div
                key={idx}
                className="panel opacity-30 flex items-center justify-center min-h-[52px]"
                style={{ fontSize: '0.55rem' }}
              >
                ---
              </div>
            )
          }

          const isEmpty = move.currentPP === 0

          return (
            <button
              key={idx}
              onClick={() => !isEmpty && onSelect(idx)}
              disabled={isEmpty}
              className={`battle-btn flex flex-col items-start gap-0.5 min-h-[52px] px-2 py-1.5 ${
                isEmpty ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--pokemon-yellow)]'
              }`}
            >
              <span
                className="font-bold truncate w-full"
                style={{ fontSize: '0.55rem', letterSpacing: '0.03em' }}
              >
                {move.name}
              </span>
              <div className="flex items-center justify-between w-full gap-1">
                <TypeBadge type={move.type} />
                <span
                  style={{ fontSize: '0.45rem', color: 'var(--text-secondary)' }}
                >
                  PP {move.currentPP}/{move.maxPP}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={onBack}
        className="battle-btn w-full text-center"
        style={{ fontSize: '0.5rem' }}
      >
        ← BACK
      </button>
    </div>
  )
}
