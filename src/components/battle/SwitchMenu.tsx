'use client'

import type { BattlePokemon } from '@/game/battle'

interface SwitchMenuProps {
  team: BattlePokemon[]
  onSelect: (idx: number) => void
  onBack: () => void
}

function HpBar({ current, max }: { current: number; max: number }) {
  const pct = max > 0 ? Math.max(0, Math.min(1, current / max)) : 0
  const cls =
    pct > 0.5 ? 'hp-bar-full' : pct > 0.25 ? 'hp-bar-mid' : 'hp-bar-low'

  return (
    <div
      className="w-full rounded-sm overflow-hidden"
      style={{ height: '4px', background: 'var(--panel-border)' }}
    >
      <div
        className={cls}
        style={{ width: `${pct * 100}%`, height: '100%', transition: 'width 0.3s' }}
      />
    </div>
  )
}

export function SwitchMenu({ team, onSelect, onBack }: SwitchMenuProps) {
  return (
    <div className="flex flex-col gap-1">
      {team.map((pokemon, idx) => {
        const isFainted = pokemon.currentHp === 0

        return (
          <button
            key={pokemon.id}
            onClick={() => !isFainted && onSelect(idx)}
            disabled={isFainted}
            className={`battle-btn flex items-center gap-2 w-full text-left px-2 py-1.5 ${
              isFainted
                ? 'opacity-40 cursor-not-allowed'
                : 'hover:bg-[var(--pokemon-yellow)]'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-1">
                <span
                  className="font-bold truncate"
                  style={{ fontSize: '0.55rem', letterSpacing: '0.03em' }}
                >
                  {pokemon.name}
                </span>
                <span
                  className="shrink-0"
                  style={{ fontSize: '0.45rem', color: 'var(--text-secondary)' }}
                >
                  Lv.{pokemon.level}
                </span>
              </div>
              <HpBar current={pokemon.currentHp} max={pokemon.maxHp} />
              <span
                style={{ fontSize: '0.4rem', color: 'var(--text-secondary)' }}
              >
                {isFainted ? 'FAINTED' : `${pokemon.currentHp}/${pokemon.maxHp} HP`}
              </span>
            </div>
          </button>
        )
      })}

      <button
        onClick={onBack}
        className="battle-btn w-full text-center mt-1"
        style={{ fontSize: '0.5rem' }}
      >
        ← BACK
      </button>
    </div>
  )
}
