'use client'

import { useState } from 'react'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { PokemonSprite } from '@/components/ui/PokemonSprite'
import { StatBar } from '@/components/ui/StatBar'
import type { PokemonDetail } from '@/types'

type Tab = 'overview' | 'stats' | 'moves' | 'evolution'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',   label: 'Overview' },
  { id: 'stats',      label: 'Stats' },
  { id: 'moves',      label: 'Moves' },
  { id: 'evolution',  label: 'Evolution' },
]

const STAT_LABELS: Record<string, string> = {
  hp:        'HP',
  attack:    'Attack',
  defense:   'Defense',
  spAttack:  'Sp. Atk',
  spDefense: 'Sp. Def',
  speed:     'Speed',
}

interface DetailTabsProps {
  pokemon: PokemonDetail
}

export function DetailTabs({ pokemon }: DetailTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [shiny, setShiny]         = useState(false)

  const spriteSrc = shiny
    ? (pokemon.spriteFrontShiny ?? pokemon.spriteFront)
    : pokemon.spriteFront

  const totalStats =
    pokemon.hp + pokemon.attack + pokemon.defense +
    pokemon.spAttack + pokemon.spDefense + pokemon.speed

  return (
    <div>
      {/* ── Tab Bar ──────────────────────────────── */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 16, flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              fontFamily:    'inherit',
              fontSize:      '0.5rem',
              padding:       '5px 10px',
              cursor:        'pointer',
              border:        activeTab === t.id ? '2px solid var(--pokemon-yellow)' : 'var(--pixel-border)',
              background:    activeTab === t.id ? 'var(--pokemon-yellow)' : 'var(--panel-light)',
              color:         activeTab === t.id ? 'var(--text-primary)'   : 'var(--text-secondary)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              transition:    'all 0.1s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview ─────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Sprite + shiny toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <PokemonSprite src={spriteSrc} name={pokemon.name} size="xl" shiny={shiny} />
              {pokemon.spriteFrontShiny && (
                <button
                  onClick={() => setShiny((s) => !s)}
                  className="battle-btn"
                  style={{ fontSize: '0.45rem', padding: '3px 8px' }}
                >
                  {shiny ? 'Normal' : 'Shiny'}
                </button>
              )}
            </div>

            {/* Info panel */}
            <div style={{ flex: 1, minWidth: 180 }}>
              {/* Types */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                {pokemon.types.map((t) => (
                  <TypeBadge key={t} type={t} size="md" />
                ))}
              </div>

              {/* Height / weight */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                {[
                  { label: 'Height', value: `${(pokemon.height / 10).toFixed(1)} m` },
                  { label: 'Weight', value: `${(pokemon.weight / 10).toFixed(1)} kg` },
                ].map(({ label, value }) => (
                  <div key={label} className="panel" style={{ padding: '6px 10px' }}>
                    <div style={{ fontFamily: 'inherit', fontSize: '0.4rem', color: 'var(--text-secondary)', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontFamily: 'inherit', fontSize: '0.55rem', fontWeight: 'bold' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Legendary badge */}
              {pokemon.isLegendary && (
                <div
                  style={{
                    display: 'inline-block',
                    background: 'var(--pokemon-yellow)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '0.45rem',
                    padding: '2px 8px',
                    border: 'var(--pixel-border)',
                    marginBottom: 12,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Legendary
                </div>
              )}

              {/* Abilities */}
              <div>
                <p style={{ fontFamily: 'inherit', fontSize: '0.45rem', color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase' }}>
                  Abilities
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {pokemon.abilities.map((a) => (
                    <div
                      key={a.name}
                      style={{
                        fontFamily:    'inherit',
                        fontSize:      '0.5rem',
                        color:         a.isHidden ? 'var(--text-secondary)' : 'var(--text-primary)',
                        textTransform: 'capitalize',
                      }}
                    >
                      {a.name}
                      {a.isHidden && (
                        <span style={{ fontSize: '0.4rem', marginLeft: 6, color: 'var(--text-secondary)' }}>
                          (hidden)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stats ────────────────────────────────── */}
      {activeTab === 'stats' && (
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(
              [
                ['hp',        pokemon.hp],
                ['attack',    pokemon.attack],
                ['defense',   pokemon.defense],
                ['spAttack',  pokemon.spAttack],
                ['spDefense', pokemon.spDefense],
                ['speed',     pokemon.speed],
              ] as [string, number][]
            ).map(([key, val]) => (
              <StatBar key={key} label={STAT_LABELS[key] ?? key} value={val} max={255} />
            ))}

            {/* Total */}
            <div style={{ borderTop: 'var(--pixel-border)', paddingTop: 10, marginTop: 4 }}>
              <StatBar label="Total" value={totalStats} max={720} />
            </div>
          </div>
        </div>
      )}

      {/* ── Moves ────────────────────────────────── */}
      {activeTab === 'moves' && (
        <div className="panel" style={{ padding: 16, overflowX: 'auto' }}>
          {pokemon.moves.length === 0 ? (
            <p style={{ fontFamily: 'inherit', fontSize: '0.5rem', color: 'var(--text-secondary)' }}>
              No level-up moves found.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Lv.', 'Move', 'Type'].map((h) => (
                    <th
                      key={h}
                      style={{
                        fontFamily:    'inherit',
                        fontSize:      '0.45rem',
                        textTransform: 'uppercase',
                        textAlign:     'left',
                        padding:       '4px 8px',
                        borderBottom:  '2px solid var(--panel-border)',
                        color:         'var(--text-secondary)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pokemon.moves.map((m, i) => (
                  <tr
                    key={`${m.name}-${i}`}
                    style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.04)' }}
                  >
                    <td style={{ fontFamily: 'inherit', fontSize: '0.5rem', padding: '3px 8px', color: 'var(--text-secondary)' }}>
                      {m.level ?? '—'}
                    </td>
                    <td style={{ fontFamily: 'inherit', fontSize: '0.5rem', padding: '3px 8px', textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                      {m.name}
                    </td>
                    <td style={{ padding: '3px 8px' }}>
                      <TypeBadge type={m.type} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Evolution ────────────────────────────── */}
      {activeTab === 'evolution' && (
        <div className="panel" style={{ padding: 16 }}>
          {pokemon.evolutions.length === 0 ? (
            <p style={{ fontFamily: 'inherit', fontSize: '0.5rem', color: 'var(--text-secondary)' }}>
              This Pokémon does not evolve further.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pokemon.evolutions.map((e, i) => (
                <div
                  key={i}
                  style={{
                    display:    'flex',
                    alignItems: 'center',
                    gap:        16,
                    flexWrap:   'wrap',
                  }}
                >
                  {/* From */}
                  <div style={{ textAlign: 'center' }}>
                    <PokemonSprite
                      src={pokemon.id === e.fromId ? pokemon.spriteFront : undefined}
                      name={`#${String(e.fromId).padStart(3, '0')}`}
                      size="md"
                    />
                    <div style={{ fontFamily: 'inherit', fontSize: '0.45rem', marginTop: 4 }}>
                      #{String(e.fromId).padStart(3, '0')}
                    </div>
                  </div>

                  {/* Arrow + trigger */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontFamily: 'inherit', fontSize: '0.8rem', color: 'var(--pokemon-yellow)' }}>
                      →
                    </span>
                    <span style={{ fontFamily: 'inherit', fontSize: '0.4rem', color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'center' }}>
                      {e.trigger}
                      {e.minLevel ? ` Lv. ${e.minLevel}` : ''}
                      {e.itemName ? ` (${e.itemName})` : ''}
                    </span>
                  </div>

                  {/* To */}
                  <div style={{ textAlign: 'center' }}>
                    <PokemonSprite
                      src={pokemon.id === e.toId ? pokemon.spriteFront : undefined}
                      name={`#${String(e.toId).padStart(3, '0')}`}
                      size="md"
                    />
                    <div style={{ fontFamily: 'inherit', fontSize: '0.45rem', marginTop: 4 }}>
                      #{String(e.toId).padStart(3, '0')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
