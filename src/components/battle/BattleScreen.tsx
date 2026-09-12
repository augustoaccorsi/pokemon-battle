'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { BattleState, BattleEvent, BattleAction, BattlePokemon } from '@/game/battle'
import { BattleSprite } from './BattleSprite'
import { BattleMessage } from './BattleMessage'
import { MoveMenu } from './MoveMenu'
import { SwitchMenu } from './SwitchMenu'

// ─── Types ───────────────────────────────────────────────────────────────────

type UIPhase = 'selecting' | 'animating' | 'switching' | 'ended'

type SpriteState = 'normal' | 'hit' | 'faint'

interface HpBarProps {
  pokemon: BattlePokemon
  side: 'player' | 'enemy'
}

// ─── HP Bar ───────────────────────────────────────────────────────────────────

function HpBar({ pokemon, side }: HpBarProps) {
  const pct = pokemon.maxHp > 0
    ? Math.max(0, Math.min(1, pokemon.currentHp / pokemon.maxHp))
    : 0
  const barClass =
    pct > 0.5 ? 'hp-bar-full' : pct > 0.25 ? 'hp-bar-mid' : 'hp-bar-low'

  return (
    <div
      className="panel px-2 py-1.5 flex flex-col gap-0.5"
      style={{ minWidth: '180px' }}
    >
      <div className="flex items-baseline justify-between">
        <span
          className="font-bold"
          style={{ fontSize: '0.6rem', letterSpacing: '0.03em' }}
        >
          {pokemon.name}
        </span>
        <span style={{ fontSize: '0.5rem', color: 'var(--text-secondary)' }}>
          Lv.{pokemon.level}
        </span>
      </div>
      <div
        className="w-full rounded-sm overflow-hidden"
        style={{ height: '6px', background: 'var(--panel-border)' }}
      >
        <motion.div
          className={barClass}
          style={{ height: '100%' }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {side === 'player' && (
        <span style={{ fontSize: '0.45rem', color: 'var(--text-secondary)' }}>
          {pokemon.currentHp}/{pokemon.maxHp}
        </span>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface BattleScreenProps {
  battleId: string
}

export function BattleScreen({ battleId }: BattleScreenProps) {
  const router = useRouter()
  const [state, setState] = useState<BattleState | null>(null)
  const [uiPhase, setUiPhase] = useState<UIPhase>('selecting')
  const [messages, setMessages] = useState<string[]>(['Loading battle…'])
  const [msgIndex, setMsgIndex] = useState(0)
  const [spriteStates, setSpriteStates] = useState<{
    player: SpriteState
    enemy: SpriteState
  }>({ player: 'normal', enemy: 'normal' })
  const [isLoading, setIsLoading] = useState(false)
  const [showMoves, setShowMoves] = useState(false)

  // ─── Load initial state ──────────────────────────────────────────────────

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(`/api/battles/${battleId}`)
        if (!res.ok) throw new Error('Failed to load battle')
        const data = (await res.json()) as { state: BattleState; outcome: string }
        setState(data.state)
        const enemy = data.state.enemy.pokemon[data.state.enemy.activeIndex]
        setMessages([`A wild ${enemy.name} appeared!`, 'What will you do?'])
      } catch {
        setMessages(['Failed to load battle.'])
      }
    })()
  }, [battleId])

  // ─── Process events → UI animation sequence ──────────────────────────────

  const processEvents = useCallback(
    async (events: BattleEvent[], newState: BattleState) => {
      const newMessages: string[] = []

      for (const event of events) {
        switch (event.type) {
          case 'MOVE_USED':
            newMessages.push(
              `${event.attacker} used ${event.move}!`,
              event.damage !== undefined
                ? `It dealt ${event.damage} damage!`
                : 'But nothing happened…',
            )
            if (event.critical) newMessages.push('A critical hit!')
            if (event.effectiveness === 2) newMessages.push("It's super effective!")
            if (event.effectiveness === 0.5) newMessages.push("It's not very effective…")
            break
          case 'MISSED':
            newMessages.push(`${event.attacker}'s ${event.move} missed!`)
            break
          case 'FAINT':
            newMessages.push(`${event.pokemon} fainted!`)
            setSpriteStates(prev => ({ ...prev, [event.side]: 'faint' }))
            await delay(500)
            setSpriteStates(prev => ({ ...prev, [event.side]: 'normal' }))
            break
          case 'STATUS':
            newMessages.push(
              event.applied
                ? `${event.pokemon} was ${event.status}ed!`
                : `${event.pokemon} is hurt by its ${event.status}!`,
            )
            break
          case 'SWITCH':
            newMessages.push(`${event.outPokemon} switched out! Go, ${event.inPokemon}!`)
            break
          case 'BATTLE_END':
            newMessages.push(
              event.winner === 'player' ? 'You won! 🏆' : 'You blacked out…',
            )
            break
        }
      }

      if (newMessages.length === 0) newMessages.push('What will you do?')

      setState(newState)
      setMessages(newMessages)
      setMsgIndex(0)

      const isEnded = newState.phase === 'ended'
      setUiPhase(isEnded ? 'ended' : 'selecting')
      setShowMoves(false)
    },
    [],
  )

  // ─── Submit action ────────────────────────────────────────────────────────

  const submitAction = useCallback(
    async (action: BattleAction) => {
      if (isLoading || !state) return
      setIsLoading(true)
      setUiPhase('animating')
      setShowMoves(false)

      try {
        const res = await fetch(`/api/battles/${battleId}/actions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        })
        if (!res.ok) throw new Error('Action failed')
        const data = (await res.json()) as { events: BattleEvent[]; state: BattleState }

        // Flash hit on attacking events
        const hasPlayerDamage = data.events.some(e => e.type === 'MOVE_USED')
        if (hasPlayerDamage) {
          setSpriteStates(prev => ({ ...prev, enemy: 'hit' }))
          await delay(400)
          setSpriteStates(prev => ({ ...prev, enemy: 'normal' }))
        }

        await processEvents(data.events, data.state)
      } catch {
        setMessages(['Something went wrong. Please try again.'])
        setUiPhase('selecting')
      } finally {
        setIsLoading(false)
      }
    },
    [battleId, isLoading, state, processEvents],
  )

  // ─── Render ──────────────────────────────────────────────────────────────

  if (!state) {
    return (
      <div className="flex items-center justify-center h-full">
        <p style={{ fontSize: '0.6rem' }}>Loading…</p>
      </div>
    )
  }

  const playerPokemon = state.player.pokemon[state.player.activeIndex]
  const enemyPokemon = state.enemy.pokemon[state.enemy.activeIndex]

  // PokéAPI sprite URLs
  const SPRITES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'
  // Extract numeric pokemon id from our id string e.g. "player-25-0" → 25
  const pidFromId = (id: string) => id.split('-')[1] ?? '0'

  const playerSpriteUrl = `${SPRITES}/back/${pidFromId(playerPokemon.id)}.png`
  const enemySpriteUrl  = `${SPRITES}/${pidFromId(enemyPokemon.id)}.png`

  return (
    <div
      className="flex flex-col h-full w-full max-w-2xl mx-auto select-none"
      style={{ background: 'var(--background)', userSelect: 'none' }}
    >
      {/* ── Battle field ─────────────────────────────────────────────────── */}
      <div
        className="relative flex-1 flex items-end justify-between px-4 pb-2"
        style={{
          background: 'linear-gradient(to bottom, #87CEEB 0%, #90EE90 60%, #228B22 100%)',
          minHeight: '220px',
        }}
      >
        {/* Enemy Pokémon (top-right) */}
        <div className="absolute top-3 right-4 flex flex-col items-end gap-1">
          <HpBar pokemon={enemyPokemon} side="enemy" />
          <BattleSprite
            src={enemySpriteUrl}
            name={enemyPokemon.name}
            side="enemy"
            state={spriteStates.enemy}
          />
        </div>

        {/* Player Pokémon (bottom-left) */}
        <div className="absolute bottom-3 left-4 flex flex-col items-start gap-1">
          <BattleSprite
            src={playerSpriteUrl}
            name={playerPokemon.name}
            side="player"
            state={spriteStates.player}
          />
          <HpBar pokemon={playerPokemon} side="player" />
        </div>
      </div>

      {/* ── Message box ──────────────────────────────────────────────────── */}
      <div className="px-2 py-1" style={{ background: 'var(--panel-light)' }}>
        <BattleMessage
          messages={messages}
          current={msgIndex}
          onDone={() => {
            if (msgIndex < messages.length - 1) {
              setMsgIndex(i => i + 1)
            }
          }}
        />
      </div>

      {/* ── Menu ─────────────────────────────────────────────────────────── */}
      <div className="panel-dark px-2 py-2" style={{ minHeight: '120px' }}>
        <AnimatePresence mode="wait">
          {uiPhase === 'ended' ? (
            <motion.div
              key="ended"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-2 h-full py-4"
            >
              <p
                style={{ fontSize: '0.65rem', color: 'var(--text-on-dark)', letterSpacing: '0.08em' }}
              >
                {state.winner === 'player' ? '★ VICTORY! ★' : '✗ BLACKED OUT ✗'}
              </p>
            </motion.div>
          ) : uiPhase === 'switching' ? (
            <motion.div key="switching" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <SwitchMenu
                team={state.player.pokemon}
                onSelect={idx => submitAction({ type: 'SWITCH', pokemonIndex: idx })}
                onBack={() => setUiPhase('selecting')}
              />
            </motion.div>
          ) : showMoves ? (
            <motion.div key="moves" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MoveMenu
                moves={playerPokemon.moves}
                onSelect={idx => submitAction({ type: 'MOVE', moveIndex: idx })}
                onBack={() => setShowMoves(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-1"
            >
              <button
                className="battle-btn"
                onClick={() => setShowMoves(true)}
                disabled={uiPhase === 'animating'}
              >
                ⚔ FIGHT
              </button>
              <button
                className="battle-btn"
                onClick={() => setUiPhase('switching')}
                disabled={uiPhase === 'animating'}
              >
                ◎ POKÉMON
              </button>
              <button
                className="battle-btn opacity-40 cursor-not-allowed"
                disabled
              >
                🎒 BAG
              </button>
              <button
                className="battle-btn"
                onClick={() => {
                  if (confirm('Run from battle?')) {
                    router.push('/')
                  }
                }}
                disabled={uiPhase === 'animating'}
              >
                ↩ RUN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
