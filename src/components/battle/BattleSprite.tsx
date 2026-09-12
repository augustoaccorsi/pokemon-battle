'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface BattleSpriteProps {
  /** PokéAPI sprite URL or any image URL */
  src?: string
  name: string
  side: 'player' | 'enemy'
  /** Visual state driven by battle events */
  state: 'normal' | 'hit' | 'faint'
}

const POKEAPI_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

function spriteUrl(src: string | undefined, name: string, side: 'player' | 'enemy'): string {
  if (src) return src
  // Fall back to a search by name: we can't resolve id from name here,
  // so callers should pass src. This is a bare fallback.
  void name
  return side === 'enemy' ? `${POKEAPI_BASE}/1.png` : `${POKEAPI_BASE}/back/1.png`
}

export function BattleSprite({ src, name, side, state }: BattleSpriteProps) {
  const url = spriteUrl(src, name, side)
  const isPlayer = side === 'player'

  return (
    <AnimatePresence>
      {state !== 'faint' && (
        <motion.div
          key="sprite"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 48, transition: { duration: 0.4 } }}
          animate={
            state === 'hit'
              ? {
                  filter: [
                    'brightness(1)',
                    'brightness(10) saturate(0)',
                    'brightness(1)',
                    'brightness(10) saturate(0)',
                    'brightness(1)',
                  ],
                  transition: { duration: 0.4 },
                }
              : { filter: 'brightness(1)' }
          }
          className="relative"
          style={{
            imageRendering: 'pixelated',
            transform: isPlayer ? 'scaleX(-1)' : 'none',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={name}
            width={isPlayer ? 128 : 112}
            height={isPlayer ? 128 : 112}
            style={{ imageRendering: 'pixelated' }}
            draggable={false}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
