'use client'

import { useState, useEffect, useCallback } from 'react'
import { TypeBadge } from '@/components/ui/TypeBadge'
import { PokemonCard } from '@/components/pokedex/PokemonCard'
import type { PokemonListItem, PokemonType, PokemonListResponse } from '@/types'

const ALL_TYPES: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel',
]

type GenFilter = '' | '1' | '2' | '3'

const GEN_LABELS: Record<GenFilter, string> = {
  '':  'All',
  '1': 'Kanto',
  '2': 'Johto',
  '3': 'Hoenn',
}

export default function PokedexPage() {
  const [search, setSearch]       = useState('')
  const [debouncedSearch, setDs]  = useState('')
  const [gen, setGen]             = useState<GenFilter>('')
  const [selectedType, setType]   = useState<PokemonType | ''>('')
  const [pokemon, setPokemon]     = useState<PokemonListItem[]>([])
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [loading, setLoading]     = useState(false)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDs(search), 300)
    return () => clearTimeout(t)
  }, [search])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
    setPokemon([])
  }, [debouncedSearch, gen, selectedType])

  const fetchPokemon = useCallback(
    async (targetPage: number, append: boolean) => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: String(targetPage), limit: '30' })
        if (debouncedSearch) params.set('search', debouncedSearch)
        if (gen)             params.set('gen', gen)
        if (selectedType)    params.set('type', selectedType)

        const res  = await fetch(`/api/pokemon?${params}`)
        const data: PokemonListResponse = await res.json()

        setPokemon((prev) => (append ? [...prev, ...data.pokemon] : data.pokemon))
        setTotal(data.total)
      } finally {
        setLoading(false)
      }
    },
    [debouncedSearch, gen, selectedType],
  )

  // Initial + filter-change fetch
  useEffect(() => {
    fetchPokemon(1, false)
  }, [fetchPokemon])

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchPokemon(next, true)
  }

  const hasMore = pokemon.length < total

  return (
    <div
      style={{
        minHeight:  '100vh',
        background: 'var(--panel-light)',
        padding:    '16px',
      }}
    >
      {/* ── Header ───────────────────────────────── */}
      <div className="panel-dark" style={{ padding: '12px 16px', marginBottom: 16, textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'inherit', fontSize: '1rem', letterSpacing: '0.08em', margin: 0 }}>
          POKÉDEX
        </h1>
        <p style={{ fontFamily: 'inherit', fontSize: '0.45rem', marginTop: 4, color: 'var(--text-on-dark)', opacity: 0.7 }}>
          GEN I · II · III
        </p>
      </div>

      {/* ── Search ───────────────────────────────── */}
      <div className="panel" style={{ padding: '8px 10px', marginBottom: 12 }}>
        <input
          type="search"
          placeholder="SEARCH POKÉMON..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width:        '100%',
            background:   'transparent',
            border:       'none',
            outline:      'none',
            fontFamily:   'inherit',
            fontSize:     '0.6rem',
            color:        'var(--text-primary)',
            letterSpacing: '0.05em',
          }}
        />
      </div>

      {/* ── Generation tabs ──────────────────────── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {(Object.keys(GEN_LABELS) as GenFilter[]).map((g) => (
          <button
            key={g}
            onClick={() => setGen(g)}
            className={gen === g ? '' : ''}
            style={{
              fontFamily:     'inherit',
              fontSize:       '0.5rem',
              padding:        '4px 10px',
              cursor:         'pointer',
              border:         gen === g ? '2px solid var(--pokemon-yellow)' : 'var(--pixel-border)',
              background:     gen === g ? 'var(--pokemon-yellow)' : 'var(--panel-light)',
              color:          gen === g ? 'var(--text-primary)' : 'var(--text-secondary)',
              letterSpacing:  '0.05em',
              textTransform:  'uppercase',
              transition:     'all 0.1s',
            }}
          >
            {GEN_LABELS[g]}
          </button>
        ))}
      </div>

      {/* ── Type filter ──────────────────────────── */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 16 }}>
        <button
          onClick={() => setType('')}
          style={{
            fontFamily:   'inherit',
            fontSize:     '0.45rem',
            padding:      '2px 8px',
            cursor:       'pointer',
            border:       selectedType === '' ? '2px solid var(--pokemon-yellow)' : 'var(--pixel-border)',
            background:   selectedType === '' ? 'var(--pokemon-yellow)' : 'var(--panel-light)',
            color:        'var(--text-primary)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          All
        </button>
        {ALL_TYPES.map((t) => (
          <TypeBadge
            key={t}
            type={t}
            size="sm"
            onClick={() => setType(selectedType === t ? '' : t)}
            selected={selectedType === t}
          />
        ))}
      </div>

      {/* ── Count ────────────────────────────────── */}
      <p style={{ fontFamily: 'inherit', fontSize: '0.45rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
        {loading && pokemon.length === 0 ? 'Loading...' : `${total} Pokémon found`}
      </p>

      {/* ── Grid ─────────────────────────────────── */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap:                 12,
          marginBottom:        20,
        }}
      >
        {pokemon.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </div>

      {/* ── Empty state ──────────────────────────── */}
      {!loading && pokemon.length === 0 && (
        <div className="panel" style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ fontFamily: 'inherit', fontSize: '0.55rem', color: 'var(--text-secondary)' }}>
            No Pokémon found.
          </p>
        </div>
      )}

      {/* ── Load more ────────────────────────────── */}
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 24 }}>
          <button
            onClick={loadMore}
            disabled={loading}
            className="battle-btn"
            style={{ opacity: loading ? 0.6 : 1, minWidth: 160 }}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}
